'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Progress,
  Checkbox,
  Typography,
  List,
  Statistic,
  Alert,
} from 'antd';
import type { DatePickerProps } from 'antd'; // Importar tipos específicos si es necesario
import moment, { Moment } from 'moment'; // Importar Moment para tipado

const { Title, Text } = Typography;
const { Option } = Select;

// 1. Definición de Tipos (Interfaces) para el estado
interface PatientInfo {
  name: string;
  educationLevel: string; // Puede ser number si lo parseas inmediatamente
  gender: 'M' | 'F' | 'O' | '';
  birthDate: Moment | null;
  testDate: Moment | null;
}

interface Memory {
  words: string[];
  firstTrial: string[];
  secondTrial: string[];
  recall: string[];
}

interface Attention {
  digitSpan: string; // Considerar si esto debería ser number[]
  vigilance: boolean[]; // Array de booleanos para los taps correctos
  // Añadir la secuencia de vigilancia, que faltaba en tu estado original
  vigilanceSequence: string; // e.g., 'FBCMNAAJJKLBAFAKDEAAAJAMOFAB'
  serialSevens: (number | null)[];
}

interface Language {
  repetition1: string;
  repetition2: string;
  fluencyWords: string[];
  fluencyCount: number;
}

interface Abstraction {
  trainBicycle: string;
  watchRuler: string;
}

interface Orientation {
  date: string; // Podría ser number
  month: string; // Podría ser number
  year: string; // Podría ser number
  day: string; // Podría ser string (nombre del día)
  place: string;
  city: string;
}

interface Scores {
  total: number;
  memory: number;
  attention: number;
  language: number;
  abstraction: number;
  orientation: number;
  visuospatial: number; // Añadir visuospatial score
  identification: number; // Añadir identification score
}

interface TestData {
  patientInfo: PatientInfo;
  visuospatial: {
    trailMaking: string; // Considerar si esto debe ser algo más específico, e.g. un campo para puntaje
    // Puedes añadir campos para dibujar el cubo y el reloj aquí,
    // por ahora, como no hay interacción directa, los omitimos
    // O podrías tener: clockDrawingScore: number; cubeCopyingScore: number;
  };
  memory: Memory;
  attention: Attention;
  language: Language;
  abstraction: Abstraction;
  orientation: Orientation;
  scores: Scores;
}

const MOCA_TEST = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [testData, setTestData] = useState<TestData>({
    patientInfo: {
      name: '',
      educationLevel: '',
      gender: '',
      birthDate: null,
      testDate: moment(), // Usar moment() para la fecha actual por defecto
    },
    visuospatial: {
      trailMaking: '', // Esto parece incompleto para la automatización total, solo es un string
      // Puedes añadir más campos aquí para la puntuación manual de dibujo
    },
    memory: {
      words: ['ROSTRO', 'SEDA', 'IGLESIA', 'CLAVEL', 'ROJO'],
      firstTrial: [],
      secondTrial: [],
      recall: [],
    },
    attention: {
      digitSpan: '',
      // La secuencia de vigilancia original tenía 30 caracteres.
      // Aquí se define explícitamente y se usa para el array de booleanos.
      vigilanceSequence: 'FBCMNAAJJKLBAFAKDEAAAJAMOFAB',
      vigilance: Array(30).fill(false), // 30 es el número de letras en la secuencia original
      serialSevens: [null, null, null, null, null],
    },
    language: {
      repetition1: '',
      repetition2: '',
      fluencyWords: [],
      fluencyCount: 0,
    },
    abstraction: {
      trainBicycle: '',
      watchRuler: '',
    },
    orientation: {
      date: '',
      month: '',
      year: '',
      day: '',
      place: '',
      city: '',
    },
    scores: {
      total: 0,
      memory: 0,
      attention: 0,
      language: 0,
      abstraction: 0,
      orientation: 0,
      visuospatial: 0, // Inicializar a 0
      identification: 0, // Inicializar a 0
    },
  });

  const [fluencyTime, setFluencyTime] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar el temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startFluencyTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setFluencyTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calculateScores = () => {
    const newScores: Scores = { ...testData.scores }; // Copiar el estado actual de los scores

    // Memoria: 1 punto por cada palabra recordada correctamente (máx 5)
    newScores.memory = testData.memory.recall.filter((word) =>
      testData.memory.words.includes(word.toUpperCase()) // Convertir a mayúsculas para comparación
    ).length;

    // Atención:
    // - Resta serial (1 punto por cada respuesta correcta, máx 5)
    const correctSerialSevens = [93, 86, 79, 72, 65];
    newScores.attention = testData.attention.serialSevens.filter(
      (ans, i) => ans === correctSerialSevens[i]
    ).length;

    // - Vigilancia (1 punto si ≤1 error)
    // Se asume que `vigilance` guarda TRUE si el paciente TAPEO donde había una 'A'
    // Y FALSE si TAPEO donde no había 'A' o NO TAPEO donde había 'A'.
    // Tu lógica actual filtra por `!v` que significa que es un ERROR de TAPEO (no tapó una A o tapó donde no era A)
    const vigilanceErrors = testData.attention.vigilance.filter((tapped, i) => {
      const isA = testData.attention.vigilanceSequence[i] === 'A';
      return (isA && !tapped) || (!isA && tapped); // Error si es 'A' y no tapó, O si no es 'A' y tapó
    }).length;

    if (vigilanceErrors <= 1) newScores.attention += 1;


    // Lenguaje:
    // - Repetición (1 punto por frase correcta, máx 2)
    // Se requiere una coincidencia más exacta para el MoCA. Usar includes es un poco flexible.
    // Podrías usar RegEx o comparar después de normalizar (quitar acentos, puntuación, etc.)
    const repetition1Expected = 'El gato se esconde bajo el sofá cuando los perros entran en la sala.';
    const repetition2Expected = 'Espero que él le entregue el mensaje una vez que ella se lo pida.';

    if (testData.language.repetition1.trim().toLowerCase() === repetition1Expected.toLowerCase()) newScores.language += 1;
    if (testData.language.repetition2.trim().toLowerCase() === repetition2Expected.toLowerCase()) newScores.language += 1;


    // - Fluidez (1 punto si ≥11 palabras)
    if (testData.language.fluencyCount >= 11) newScores.language += 1;

    // Abstracción: 1 punto por cada similitud correcta (máx 2)
    // Es común permitir varias respuestas correctas. Ajusta según los criterios de puntuación del MoCA.
    const trainBicycleAnswers = ['transporte', 'vehículo', 'sirven para transportarse', 'medios de transporte'];
    const watchRulerAnswers = ['medir', 'sirven para medir', 'instrumentos de medición', 'miden'];

    if (trainBicycleAnswers.some(ans => testData.abstraction.trainBicycle.toLowerCase().includes(ans))) {
      newScores.abstraction += 1;
    }
    if (watchRulerAnswers.some(ans => testData.abstraction.watchRuler.toLowerCase().includes(ans))) {
      newScores.abstraction += 1;
    }


    // Orientación: 1 punto por cada respuesta correcta (máx 6)
    const today = moment();
    const todayDayOfWeek = today.format('dddd').toUpperCase(); // e.g., 'MONDAY'

    if (testData.orientation.date === today.date().toString()) newScores.orientation += 1;
    if (testData.orientation.month === (today.month() + 1).toString()) newScores.orientation += 1;
    if (testData.orientation.year === today.year().toString()) newScores.orientation += 1;
    if (testData.orientation.day.toUpperCase() === todayDayOfWeek) newScores.orientation += 1; // Comparar el día de la semana
    // Para Lugar y Ciudad, si son datos sensibles, deberías tener una forma de validar
    // Por ahora, si tienen contenido, asume correcto.
    if (testData.orientation.place.trim() !== '') newScores.orientation += 1;
    if (testData.orientation.city.trim() !== '') newScores.orientation += 1;

    // Puntaje total
    newScores.total =
      newScores.memory +
      newScores.attention +
      newScores.language +
      newScores.abstraction +
      newScores.orientation +
      newScores.visuospatial + // Incluir visuospatial
      newScores.identification; // Incluir identification

    // Ajuste por nivel educativo
    const educationYears = parseInt(testData.patientInfo.educationLevel) || 0;
    if (educationYears <= 12) newScores.total += 1;

    setTestData((prev) => ({
      ...prev,
      scores: newScores,
    }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Manejadores de cambios tipados
  const handlePatientChange = <
    Field extends keyof PatientInfo,
    Value extends PatientInfo[Field]
  >(
    field: Field,
    value: Value
  ) => {
    setTestData((prev) => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [field]: value,
      },
    }));
  };

  const handleWordRecall = (
    trial: 'firstTrial' | 'secondTrial' | 'recall',
    words: string[]
  ) => {
    setTestData((prev) => ({
      ...prev,
      memory: {
        ...prev.memory,
        [trial]: words,
      },
    }));
  };

  const handleSerialSevenChange = (index: number, value: string) => {
    const newSerialSevens = [...testData.attention.serialSevens];
    newSerialSevens[index] = parseInt(value) || null;
    setTestData((prev) => ({
      ...prev,
      attention: {
        ...prev.attention,
        serialSevens: newSerialSevens,
      },
    }));
  };

  const handleVigilanceChange = (index: number, checked: boolean) => {
    const newVigilance = [...testData.attention.vigilance];
    newVigilance[index] = checked;
    setTestData((prev) => ({
      ...prev,
      attention: {
        ...prev.attention,
        vigilance: newVigilance,
      },
    }));
  };

  const handleLanguageRepetitionChange = (field: 'repetition1' | 'repetition2', value: string) => {
    setTestData(prev => ({
      ...prev,
      language: {
        ...prev.language,
        [field]: value
      }
    }));
  };

  const handleAbstractionChange = (field: 'trainBicycle' | 'watchRuler', value: string) => {
    setTestData(prev => ({
      ...prev,
      abstraction: {
        ...prev.abstraction,
        [field]: value
      }
    }));
  };

  const handleOrientationChange = <
    Field extends keyof Orientation,
    Value extends Orientation[Field]
  >(
    field: Field,
    value: Value
  ) => {
    setTestData(prev => ({
      ...prev,
      orientation: {
        ...prev.orientation,
        [field]: value
      }
    }));
  };

  // Componente principal
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        Montreal Cognitive Assessment (MoCA)
      </Title>

      <Progress
        percent={(currentStep / 8) * 100}
        status="active"
        showInfo={false}
      />

      {/* Paso 0: Información del paciente */}
      {currentStep === 0 && (
        <Card title="Datos del Paciente">
          <Form layout="vertical">
            <Form.Item label="Nombre">
              <Input
                value={testData.patientInfo.name}
                onChange={(e) => handlePatientChange('name', e.target.value)}
                placeholder="Nombre completo"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nivel de estudios (años)">
                  <Input
                    type="number"
                    value={testData.patientInfo.educationLevel}
                    onChange={(e) =>
                      handlePatientChange('educationLevel', e.target.value)
                    }
                    placeholder="Años de educación"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Sexo">
                  <Select
                    value={testData.patientInfo.gender}
                    onChange={(value: 'M' | 'F' | 'O' | '') =>
                      handlePatientChange('gender', value)
                    }
                    placeholder="Seleccione"
                  >
                    <Option value="M">Masculino</Option>
                    <Option value="F">Femenino</Option>
                    <Option value="O">Otro</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Fecha de nacimiento">
                  <DatePicker
                    value={testData.patientInfo.birthDate}
                    onChange={(date) => handlePatientChange('birthDate', date)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Fecha de evaluación">
                  <DatePicker
                    value={testData.patientInfo.testDate}
                    onChange={(date) => handlePatientChange('testDate', date)}
                    style={{ width: '100%' }}
                    defaultValue={moment()}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {/* Paso 1: Memoria */}
      {currentStep === 1 && (
        <Card title="Memoria">
          <Text strong>Instrucciones:</Text>
          <Text>
            Lea las siguientes palabras al paciente. El paciente debe repetirlas. Realice dos intentos.
          </Text>

          <div style={{ margin: '20px 0', padding: 15, background: '#f0f2f5', borderRadius: 8 }}>
            {testData.memory.words.map((word, i) => (
              <Text key={i} style={{ fontSize: 18, margin: '0 10px' }}>{word}</Text>
            ))}
          </div>

          <Title level={4}>Primer intento:</Title>
          <Input.TextArea
            placeholder="Palabras repetidas por el paciente, separadas por comas"
            onChange={(e) => handleWordRecall('firstTrial', e.target.value.split(',').map(w => w.trim().toUpperCase()))}
            rows={3}
          />

          <Title level={4} style={{ marginTop: 20 }}>Segundo intento:</Title>
          <Input.TextArea
            placeholder="Palabras repetidas por el paciente, separadas por comas"
            onChange={(e) => handleWordRecall('secondTrial', e.target.value.split(',').map(w => w.trim().toUpperCase()))}
            rows={3}
          />
        </Card>
      )}

      {/* Paso 2: Atención - Restas Seriales */}
      {currentStep === 2 && (
        <Card title="Atención - Restas Seriales">
          <Text strong>Instrucciones:</Text>
          <Text>
            Pida al paciente que reste 7 de 100, y luego continúe restando 7 del resultado,
            5 veces seguidas.
          </Text>

          <div style={{ marginTop: 20 }}>
            {[100, 93, 86, 79, 72].map((start, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <Text strong>{start} - 7 = </Text>
                <Input
                  type="number"
                  style={{ width: 80, marginLeft: 10 }}
                  value={testData.attention.serialSevens[i] || ''}
                  onChange={(e) => handleSerialSevenChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Paso 3: Atención - Vigilancia */}
      {currentStep === 3 && (
        <Card title="Atención - Vigilancia">
          <Text strong>Instrucciones:</Text>
          <Text>
            Pida al paciente que dé un golpecito con la mano cada vez que escuche la letra "A".
          </Text>

          <div style={{
            margin: '20px 0',
            padding: 15,
            background: '#f0f2f5',
            borderRadius: 8,
            fontSize: 18,
            letterSpacing: 3
          }}>
            {testData.attention.vigilanceSequence.split('').map((letter, i) => (
              <span
                key={i}
                style={{
                  margin: '0 2px',
                  color: letter === 'A' ? '#1890ff' : 'inherit',
                  fontWeight: letter === 'A' ? 'bold' : 'normal'
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          <Text>Marque las casillas para cada 'A' donde el paciente *tapó correctamente* (y solo si fue 'A'):</Text>
          <div style={{ marginTop: 10 }}>
            {testData.attention.vigilanceSequence.split('').map((letter, i) => (
              // Solo mostrar checkbox si es una 'A' para simplificar la interfaz,
              // la lógica de errores se maneja en calculateScores
              letter === 'A' && (
                <Checkbox
                  key={i}
                  checked={testData.attention.vigilance[i]}
                  onChange={(e) => handleVigilanceChange(i, e.target.checked)}
                  style={{ marginRight: 10 }}
                >
                  A ({i + 1})
                </Checkbox>
              )
            ))}
            <Alert
              message="Nota sobre Vigilancia"
              description="La puntuación de Vigilancia otorga 1 punto si el paciente comete 0 o 1 error en toda la secuencia. Asegúrese de registrar solo los aciertos (tapó 'A') y los errores (no tapó 'A', o tapó una que NO era 'A') serán contabilizados automáticamente."
              type="info"
              showIcon
              style={{ marginTop: 20 }}
            />
          </div>
        </Card>
      )}

      {/* Paso 4: Lenguaje - Repetición */}
      {currentStep === 4 && (
        <Card title="Lenguaje - Repetición">
          <Text strong>Instrucciones:</Text>
          <Text>
            Pida al paciente que repita exactamente las siguientes frases:
          </Text>

          <div style={{ margin: '20px 0' }}>
            <Text strong style={{ display: 'block', marginBottom: 5 }}>
              1. "El gato se esconde bajo el sofá cuando los perros entran en la sala."
            </Text>
            <Input
              value={testData.language.repetition1}
              onChange={(e) => handleLanguageRepetitionChange('repetition1', e.target.value)}
              placeholder="Respuesta del paciente"
            />

            <Text strong style={{ display: 'block', margin: '20px 0 5px' }}>
              2. "Espero que él le entregue el mensaje una vez que ella se lo pida."
            </Text>
            <Input
              value={testData.language.repetition2}
              onChange={(e) => handleLanguageRepetitionChange('repetition2', e.target.value)}
              placeholder="Respuesta del paciente"
            />
          </div>
        </Card>
      )}

      {/* Paso 5: Lenguaje - Fluidez Verbal */}
      {currentStep === 5 && (
        <Card title="Lenguaje - Fluidez Verbal">
          <Text strong>Instrucciones:</Text>
          <Text>
            Pida al paciente que diga todas las palabras que recuerde que comiencen con la letra "P"
            (excluyendo nombres propios) durante 1 minuto.
          </Text>

          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={((60 - fluencyTime) / 60) * 100}
              format={() => `${fluencyTime}s`}
              status={fluencyTime > 0 ? 'active' : 'success'}
              width={80}
            />

            <div style={{ marginTop: 20 }}>
              {fluencyTime > 0 && !timerRef.current ? ( // Solo mostrar "Comenzar" si no está corriendo
                <Button type="primary" onClick={startFluencyTimer}>
                  Comenzar Prueba
                </Button>
              ) : (
                <Text strong>{fluencyTime > 0 ? "Tiempo en curso..." : "¡Tiempo terminado!"}</Text>
              )}
            </div>
          </div>

          <Input.TextArea
            placeholder="Escriba las palabras dichas por el paciente, separadas por comas"
            rows={4}
            // Deshabilitar la entrada mientras el temporizador esté corriendo
            disabled={fluencyTime > 0 && !!timerRef.current}
            onChange={(e) => {
              const words = e.target.value.split(',').map((w) => w.trim()).filter(w => w !== ''); // Filtrar palabras vacías
              setTestData((prev) => ({
                ...prev,
                language: {
                  ...prev.language,
                  fluencyWords: words,
                  fluencyCount: words.length,
                },
              }));
            }}
          />
        </Card>
      )}

      {/* Paso 6: Abstracción */}
      {currentStep === 6 && (
        <Card title="Pensamiento Abstracto">
          <Text strong>Instrucciones:</Text>
          <Text>
            Pregunte al paciente en qué se parecen los siguientes pares de objetos:
          </Text>

          <div style={{ margin: '20px 0' }}>
            <Text strong style={{ display: 'block', marginBottom: 5 }}>
              1. Tren - Bicicleta
            </Text>
            <Input
              value={testData.abstraction.trainBicycle}
              onChange={(e) => handleAbstractionChange('trainBicycle', e.target.value)}
              placeholder="Respuesta del paciente"
            />

            <Text strong style={{ display: 'block', margin: '20px 0 5px' }}>
              2. Reloj - Regla
            </Text>
            <Input
              value={testData.abstraction.watchRuler}
              onChange={(e) => handleAbstractionChange('watchRuler', e.target.value)}
              placeholder="Respuesta del paciente"
            />
          </div>
        </Card>
      )}

      {/* Paso 7: Memoria - Recuerdo Diferido */}
      {currentStep === 7 && (
        <Card title="Memoria - Recuerdo Diferido">
          <Text strong>Instrucciones:</Text>
          <Text>
            Pida al paciente que recuerde las palabras que le mencionó al principio de la prueba,
            sin darle pistas.
          </Text>

          <Input.TextArea
            placeholder="Escriba las palabras recordadas por el paciente, separadas por comas"
            rows={4}
            style={{ marginTop: 20 }}
            onChange={(e) => handleWordRecall('recall', e.target.value.split(',').map(w => w.trim().toUpperCase()))}
          />
        </Card>
      )}

      {/* Paso 8: Orientación */}
      {currentStep === 8 && (
        <Card title="Orientación">
          <Text strong>Instrucciones:</Text>
          <Text>
            Haga las siguientes preguntas al paciente sobre orientación temporal y espacial.
          </Text>

          <Form layout="vertical" style={{ marginTop: 20 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Día del mes">
                  <Input
                    value={testData.orientation.date}
                    onChange={(e) => handleOrientationChange('date', e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Mes">
                  <Input
                    value={testData.orientation.month}
                    onChange={(e) => handleOrientationChange('month', e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Año">
                  <Input
                    value={testData.orientation.year}
                    onChange={(e) => handleOrientationChange('year', e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Día de la semana">
              <Input
                value={testData.orientation.day}
                onChange={(e) => handleOrientationChange('day', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Lugar">
              <Input
                value={testData.orientation.place}
                onChange={(e) => handleOrientationChange('place', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Ciudad">
              <Input
                value={testData.orientation.city}
                onChange={(e) => handleOrientationChange('city', e.target.value)}
              />
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Paso 9: Resultados */}
      {currentStep === 9 && (
        <Card title="Resultados de la Evaluación">
          {/* Mover la llamada a calculateScores al useEffect o a un botón "Calcular" */}
          <Alert
            message="Resultados Calculados"
            description="La puntuación se calcula automáticamente en función de sus entradas."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />

          <Statistic
            title="Puntuación Total"
            value={testData.scores.total}
            suffix="/ 30"
            style={{ marginBottom: 30, textAlign: 'center' }}
          />

          {testData.scores.total >= 26 ? (
            <Alert
              message="Resultado Normal"
              description="Puntuación dentro del rango normal (≥26/30)"
              type="success"
              showIcon
            />
          ) : (
            <Alert
              message="Posible Deterioro Cognitivo"
              description="Puntuación por debajo del rango normal. Se recomienda evaluación adicional."
              type="warning"
              showIcon
            />
          )}

          <Title level={4} style={{ marginTop: 30 }}>Desglose por Área:</Title>
          <List>
            {/* Visuospatial y Identificación no están aún en la lógica de puntuación */}
            {/* Puedes añadir inputs en pasos anteriores para que el evaluador ingrese estos scores */}
            <List.Item>
              <Text strong>Visuoespacial/Ejecutiva:</Text> {testData.scores.visuospatial}/6
            </List.Item>
            <List.Item>
              <Text strong>Identificación:</Text> {testData.scores.identification}/3
            </List.Item>
            <List.Item>
              <Text strong>Memoria:</Text> {testData.scores.memory}/5
            </List.Item>
            <List.Item>
              <Text strong>Atención:</Text> {testData.scores.attention}/6
            </List.Item>
            <List.Item>
              <Text strong>Lenguaje:</Text> {testData.scores.language}/3
            </List.Item>
            <List.Item>
              <Text strong>Abstracción:</Text> {testData.scores.abstraction}/2
            </List.Item>
            <List.Item>
              <Text strong>Orientación:</Text> {testData.scores.orientation}/6
            </List.Item>
            <List.Item>
              <Text strong>Ajuste Educativo:</Text>
              {(parseInt(testData.patientInfo.educationLevel) || 0) <= 12 ? "+1 punto" : "No aplica"}
            </List.Item>
          </List>
        </Card>
      )}

      {/* Navegación */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {currentStep > 0 && currentStep < 9 && (
          <Button style={{ marginRight: 10 }} onClick={prevStep}>
            Anterior
          </Button>
        )}

        {currentStep < 9 ? (
          <Button type="primary" onClick={nextStep}>
            {currentStep === 0 ? 'Comenzar Evaluación' : 'Siguiente'}
          </Button>
        ) : (
          <Button type="primary" onClick={() => window.print()}>
            Imprimir Resultados
          </Button>
        )}
      </div>
    </div>
  );
};

export default MOCA_TEST;