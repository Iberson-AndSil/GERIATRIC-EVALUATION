"use client";
import { useState, useEffect } from 'react';
import { Card, Button, Checkbox, Input, Space, Typography, Progress, Row, Col, Statistic, Alert, Tag, Select, Divider, Form } from 'antd';
import { useGlobalContext } from '../context/GlobalContext';
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Option } = Select;

type CalculoItems = 'item3' | 'item4' | 'item5' | 'item6' | 'item7';

type RespuestaItem = {
  estado: 'correcto' | 'correcto_segundo' | 'incorrecto' | null;
  intentos: number;
};

export default function EvaluacionMonetaria() {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(1);
    const [tiempoFluencia, setTiempoFluencia] = useState(60);
    const { fileHandle } = useGlobalContext();
    const router = useRouter();

    const [monedasCorrectas, setMonedasCorrectas] = useState({
        centimos10: false,
        centimos20: false,
        centimos50: false,
        soles1: false,
        soles2: false,
        soles5: false,
        otrasMonedas: '',
    });
    const [billetesCorrectos, setBilletesCorrectos] = useState({
        soles10: false,
        soles20: false,
        soles50: false,
        soles100: false,
        soles200: false,
        otrosBilletes: '',
    });
    const [calculos, setCalculos] = useState<Record<CalculoItems, RespuestaItem>>({
        item3: { estado: null, intentos: 0 },
        item4: { estado: null, intentos: 0 },
        item5: { estado: null, intentos: 0 },
        item6: { estado: null, intentos: 0 },
        item7: { estado: null, intentos: 0 },
    });
    const [animales, setAnimales] = useState<string[]>([]);
    const [intrusiones, setIntrusiones] = useState({
        monedas: 0,
        billetes: 0,
        recuerdo: 0,
    });

    const [recuerdo, setRecuerdo] = useState({
        cantidadMonedas: '',
        totalDinero: '',
        monedasRecordadas: {
            centimos20: 0,
            centimos50: 0,
            sol1: 0,
            soles2: 0,
        },
    });

    useEffect(() => {
        if (currentStep !== 4) return;

        if (tiempoFluencia <= 0) {
            const timeout = setTimeout(() => {
                nextStep();
            }, 1000);
            return () => clearTimeout(timeout);
        }

        const interval = setInterval(() => {
            setTiempoFluencia(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentStep, tiempoFluencia]);

    const handleStep1Next = () => {
        const seleccionadas = Object.values(monedasCorrectas).filter(v => v === true).length;
        if (seleccionadas === 0) {
            alert('Seleccione al menos una moneda.');
            return;
        }
        nextStep();
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleMonedasChange = (key: any) => (e: any) => {
        setMonedasCorrectas(prev => ({ ...prev, [key]: e.target.checked }));
    };

    const handleBilletesChange = (key: any) => (e: any) => {
        setBilletesCorrectos(prev => ({ ...prev, [key]: e.target.checked }));
    };

    const handleIntrusionChange = (tipo: 'monedas' | 'billetes' | 'recuerdo', value: number) => {
        setIntrusiones(prev => ({ ...prev, [tipo]: value }));
    };

    const handleSelectChange = (item: CalculoItems, value: string) => {
        setCalculos(prev => ({
            ...prev,
            [item]: {
                estado: value as 'correcto' | 'correcto_segundo' | 'incorrecto',
                intentos: value === 'incorrecto' ? 2 : 1
            }
        }));
    };

    const handleAnimalChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value.trim();
            if (value) {
                setAnimales(prev => [...prev, value]);
                (e.target as HTMLInputElement).value = '';
            }
        }
    };

    // Calcula los totales correctos
    const totalMonedasCorrectas = Math.max(0, 
        Object.values(monedasCorrectas)
        .filter(val => val === true).length - intrusiones.monedas);
    
    const totalBilletesCorrectos = Math.max(0, 
        Object.values(billetesCorrectos)
        .filter(val => val === true).length - intrusiones.billetes);

    // Calcula puntaje de cada parte
    const calcularPuntajeParte1 = () => {
        return totalMonedasCorrectas + totalBilletesCorrectos;
    };

    const calcularPuntajeParte2 = () => {
        return Object.values(calculos).reduce((total, item) => {
            if (item.estado === 'correcto') return total + 2;
            if (item.estado === 'correcto_segundo') return total + 1;
            return total;
        }, 0);
    };

    const calcularPuntajeParte3 = () => {
        let puntaje = 0;
        
        // Ítem 1: Recordar cantidad de monedas (11)
        if (recuerdo.cantidadMonedas === '11') puntaje += 1;
        
        // Ítem 2: Recordar total de dinero (9 soles)
        if (recuerdo.totalDinero === '9') puntaje += 1;
        
        // Ítem 3: Recordar tipo y cantidad de monedas
        if (recuerdo.monedasRecordadas.centimos20 === 5) puntaje += 2;
        else if (recuerdo.monedasRecordadas.centimos20 > 0) puntaje += 1;
        
        if (recuerdo.monedasRecordadas.centimos50 === 2) puntaje += 2;
        else if (recuerdo.monedasRecordadas.centimos50 > 0) puntaje += 1;
        
        if (recuerdo.monedasRecordadas.sol1 === 1) puntaje += 2;
        else if (recuerdo.monedasRecordadas.sol1 > 0) puntaje += 1;
        
        if (recuerdo.monedasRecordadas.soles2 === 3) puntaje += 2;
        else if (recuerdo.monedasRecordadas.soles2 > 0) puntaje += 1;
        
        // Restar intrusiones (mínimo 0)
        return Math.max(0, puntaje - intrusiones.recuerdo);
    };

    const calcularPuntajeTotal = () => {
        return calcularPuntajeParte1() + calcularPuntajeParte2() + calcularPuntajeParte3();
    };

    const interpretarResultado = () => {
        const puntajeTotal = calcularPuntajeTotal();
        
        if (puntajeTotal <= 24) {
            return {
                diagnostico: "Posible trastorno cognitivo",
                color: "red",
                descripcion: "El puntaje sugiere la presencia de deterioro cognitivo (sensibilidad del 90.5%). Se recomienda una evaluación más completa.",
                recomendacion: "Derivar a evaluación neuropsicológica completa y valoración geriátrica integral."
            };
        } else {
            return {
                diagnostico: "Función cognitiva probablemente preservada",
                color: "green",
                descripcion: "El puntaje sugiere que no hay evidencia de deterioro cognitivo significativo (especificidad del 83.3%).",
                recomendacion: "Continuar con seguimiento según protocolo de evaluación geriátrica."
            };
        }
    };

    const handleSaveData = async () => {
            try {
                if (!fileHandle) {
                    alert("Por favor seleccione un archivo primero");
                    return;
                }
    
                const file = await fileHandle.getFile();
                const arrayBuffer = await file.arrayBuffer();
                const existingWb = XLSX.read(arrayBuffer, { type: "array" });
                const wsName = existingWb.SheetNames[0];
                const ws = existingWb.Sheets[wsName];
    
                const existingData: number[][] = XLSX.utils.sheet_to_json(ws, {
                    header: 1,
                    defval: ""
                });
                const lastRowIndex = existingData.length - 1;
    
                if (lastRowIndex >= 0) {
                    while (existingData[lastRowIndex].length < 31) {
                        existingData[lastRowIndex].push(0);
                    }
    
                    existingData[lastRowIndex][30] = calcularPuntajeTotal();
                }
    
                const updatedWs = XLSX.utils.aoa_to_sheet(existingData);
                const updatedWb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(updatedWb, updatedWs, wsName);
    
                const writable = await fileHandle.createWritable();
                await writable.write(XLSX.write(updatedWb, {
                    bookType: "xlsx",
                    type: "buffer",
                    bookSST: true
                }));
                await writable.close();
    
                form.resetFields();
                alert("Resultados guardados exitosamente");
                router.push('/');
    
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("Error detallado:", err);
                    alert(`Error al guardar: ${err.message}`);
                } else {
                    console.error("Error desconocido:", err);
                    alert("Error al guardar: Verifique la consola para más detalles");
                }
            }
    
    
        };

    return (
        <div>
            <Title
                    level={3}
                    style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        color: '#1890ff',
                        fontWeight: 500
                    }}
                >
                    VALORACIÓN COGNITIVA - SOL TEST
                </Title>
            <Text type="secondary">Adaptación peruana del eurotest para tamizaje de trastorno cognitivo</Text>
            <Progress percent={(currentStep / 5) * 100} showInfo={false} />

            {currentStep === 1 && (
                <Card title="1. Conocimiento/Denominación (Monedas)" style={{ marginBottom: '20px' }}>
                    <Text>“¿Recuerda de qué cantidades hay monedas en la actualidad?; fíjese que le pregunto monedas y no billetes”</Text>
                    <p>(máximo un minuto)</p>

                    <Space direction="vertical" style={{ margin: '20px 0' }}>
                        <Checkbox onChange={handleMonedasChange('centimos10')}>10 céntimos</Checkbox>
                        <Checkbox onChange={handleMonedasChange('centimos20')}>20 céntimos</Checkbox>
                        <Checkbox onChange={handleMonedasChange('centimos50')}>50 céntimos</Checkbox>
                        <Checkbox onChange={handleMonedasChange('soles1')}>1 sol</Checkbox>
                        <Checkbox onChange={handleMonedasChange('soles2')}>2 soles</Checkbox>
                        <Checkbox onChange={handleMonedasChange('soles5')}>5 soles</Checkbox>
                        <Input
                            placeholder="Otras (especificar)"
                            onChange={(e) => setMonedasCorrectas(prev => ({ ...prev, otrasMonedas: e.target.value }))}
                        />
                    </Space>

                    <div style={{ margin: '16px 0' }}>
                        <Text strong>Intrusiones (respuestas incorrectas adicionales): </Text>
                        <Input 
                            type="number" 
                            min={0}
                            style={{ width: '80px' }}
                            value={intrusiones.monedas}
                            onChange={(e) => handleIntrusionChange('monedas', parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <Text strong>Total correctas: {totalMonedasCorrectas} (máximo 6)</Text>

                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <Button type="primary" onClick={handleStep1Next}>Siguiente</Button>
                    </div>
                </Card>
            )}

            {currentStep === 2 && (
                <>
                    <Card title="1. Conocimiento/Denominación (Billetes)" style={{ marginBottom: '20px' }}>
                        <Text>“¿Recuerda de qué cantidades hay billetes actualmente?”</Text>
                        <p>(máximo un minuto)</p>

                        <Space direction="vertical" style={{ margin: '20px 0' }}>
                            <Checkbox onChange={handleBilletesChange('soles10')}>10 soles</Checkbox>
                            <Checkbox onChange={handleBilletesChange('soles20')}>20 soles</Checkbox>
                            <Checkbox onChange={handleBilletesChange('soles50')}>50 soles</Checkbox>
                            <Checkbox onChange={handleBilletesChange('soles100')}>100 soles</Checkbox>
                            <Checkbox onChange={handleBilletesChange('soles200')}>200 soles</Checkbox>
                            <Input
                                placeholder="Otras (especificar)"
                                onChange={(e) => setBilletesCorrectos(prev => ({ ...prev, otrosBilletes: e.target.value }))}
                            />
                        </Space>

                        <div style={{ margin: '16px 0' }}>
                            <Text strong>Intrusiones (respuestas incorrectas adicionales): </Text>
                            <Input 
                                type="number" 
                                min={0}
                                style={{ width: '80px' }}
                                value={intrusiones.billetes}
                                onChange={(e) => handleIntrusionChange('billetes', parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <Text strong>Total correctas: {totalBilletesCorrectos} (máximo 5)</Text>
                    </Card>

                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
                        <Button type="primary" onClick={nextStep}>Siguiente</Button>
                    </div>
                </>
            )}

            {currentStep === 3 &&(
                <>
                
                <Card title="2. Cálculo con monedas" style={{ marginBottom: '20px' }}>
                        <Text>Material: 3 monedas de 2 soles, 1 de 1 sol, 2 de 50 céntimos, 5 de 20 céntimos</Text>
                        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '16px' }}>
                            <div>
                                <Text strong>Item 3: ¿Cuántas monedas hay aquí? (11)</Text>
                                <Space>
                                    <Select
                                        style={{ width: 250 }}
                                        placeholder="Seleccione una opción"
                                        onChange={(value) => handleSelectChange('item3', value)}
                                        value={calculos.item3.estado}
                                    >
                                        <Option value="correcto">Correcto (primer intento)</Option>
                                        <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                                        <Option value="incorrecto">Incorrecto</Option>
                                    </Select>
                                </Space>
                            </div>

                            <div>
                                <Text strong>Item 4: “¿Puede cambiarme en sencillo esta moneda?” (1 moneda de 2 soles)</Text>
                                <Text type="secondary">Respuesta esperada: 1 de 1 sol + 2 de 50 céntimos</Text>
                                <Space>
                                    <Select
                                        style={{ width: 250 }}
                                        placeholder="Seleccione una opción"
                                        onChange={(value) => handleSelectChange('item4', value)}
                                        value={calculos.item4.estado}
                                    >
                                        <Option value="correcto">Correcto (primer intento)</Option>
                                        <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                                        <Option value="incorrecto">Incorrecto</Option>
                                    </Select>
                                </Space>
                            </div>

                            <div>
                                <Text strong>Item 5: “¿Cuánto dinero hay aquí en total?” (9 soles)</Text>
                                <Space>
                                    <Select
                                        style={{ width: 250 }}
                                        placeholder="Seleccione una opción"
                                        onChange={(value) => handleSelectChange('item5', value)}
                                        value={calculos.item5.estado}
                                    >
                                        <Option value="correcto">Correcto (primer intento)</Option>
                                        <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                                        <Option value="incorrecto">Incorrecto</Option>
                                    </Select>
                                </Space>
                            </div>

                            <div>
                                <Text strong>Item 6: Reparta estas monedas en dos montones que tengan el mismo dinero (4,50 soles)</Text>
                                <Space>
                                    <Select
                                        style={{ width: 250 }}
                                        placeholder="Seleccione una opción"
                                        onChange={(value) => handleSelectChange('item6', value)}
                                        value={calculos.item6.estado}
                                    >
                                        <Option value="correcto">Correcto (primer intento)</Option>
                                        <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                                        <Option value="incorrecto">Incorrecto</Option>
                                    </Select>
                                </Space>
                            </div>

                            <div>
                                <Text strong>Item 7: Reparta estas monedas en tres montones que tengan el mismo dinero (3 soles)</Text>
                                <Space>
                                    <Select
                                        style={{ width: 250 }}
                                        placeholder="Seleccione una opción"
                                        onChange={(value) => handleSelectChange('item7', value)}
                                        value={calculos.item7.estado}
                                    >
                                        <Option value="correcto">Correcto (primer intento)</Option>
                                        <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                                        <Option value="incorrecto">Incorrecto</Option>
                                    </Select>
                                </Space>
                            </div>
                        </Space>
                    </Card>
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
                        <Button type="primary" onClick={nextStep}>Siguiente</Button>
                    </div>
                </>
            )}

            {currentStep === 4 && (
                <Card title="3. Tarea de distracción: fluencia verbal semántica" style={{ marginBottom: '20px' }}>
                    <Text>“Quiero que me diga todos los nombres de animales que se le ocurran, ya sean de la tierra, del mar o del aire, del campo o de la casa, ¡¡todos los que se le ocurran!!”</Text>

                    <div style={{ margin: '20px 0' }}>
                        <Input
                            placeholder="Escriba un animal y presione Enter"
                            onKeyDown={handleAnimalChange}
                            allowClear
                        />

                        <div style={{ marginTop: '10px', height: '200px', overflowY: 'auto', border: '1px solid #d9d9d9', padding: '10px' }}>
                            {animales.map((animal, index) => (
                                <Tag key={index} style={{ marginBottom: '5px' }}>{animal}</Tag>
                            ))}
                        </div>

                        <Text strong style={{ display: 'block', marginTop: '10px' }}>Tiempo restante: {tiempoFluencia} segundos</Text>
                        <Text strong>Total animales: {animales.length}</Text>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
                        <Button
                            type="primary"
                            onClick={nextStep}
                            disabled={tiempoFluencia > 0}
                            loading={tiempoFluencia > 0}
                        >
                            {tiempoFluencia > 0 ? `Espere... (${tiempoFluencia}s)` : 'Siguiente'}
                        </Button>
                    </div>
                </Card>
            )}

            {currentStep === 5 && (
                <Card title="4. Tercera parte (recuerdo)" style={{ marginBottom: '20px' }}>
                    <Text>“Para finalizar, quiero que haga un último esfuerzo y trate de recordar”:</Text>

                    <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '20px' }}>
                        <div>
                            <Text strong>“¿Cuántas monedas le enseñé antes?” (11)</Text>
                            <Input
                                type="number"
                                style={{ width: '80px' }}
                                value={recuerdo.cantidadMonedas}
                                onChange={(e) => setRecuerdo(prev => ({ ...prev, cantidadMonedas: e.target.value }))}
                            />
                        </div>

                        <div>
                            <Text strong>“¿Cuánto dinero había en total?” (9 soles)</Text>
                            <Input
                                type="number"
                                style={{ width: '80px' }}
                                value={recuerdo.totalDinero}
                                onChange={(e) => setRecuerdo(prev => ({ ...prev, totalDinero: e.target.value }))}
                            />
                        </div>

                        <div>
                            <Text strong>“¿Recuerda qué monedas había exactamente?”</Text>
                            <table style={{ width: '100%', marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Moneda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Input
                                                type="number"
                                                style={{ width: '60px' }}
                                                value={recuerdo.monedasRecordadas.centimos20}
                                                onChange={(e) => setRecuerdo((prev: any) => ({
                                                    ...prev,
                                                    monedasRecordadas: {
                                                        ...prev.monedasRecordadas,
                                                        centimos20: e.target.value
                                                    }
                                                }))}
                                            />
                                        </td>
                                        <td>de 20 céntimos</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Input
                                                type="number"
                                                style={{ width: '60px' }}
                                                value={recuerdo.monedasRecordadas.centimos50}
                                                onChange={(e) => setRecuerdo((prev: any) => ({
                                                    ...prev,
                                                    monedasRecordadas: {
                                                        ...prev.monedasRecordadas,
                                                        centimos50: e.target.value
                                                    }
                                                }))}
                                            />
                                        </td>
                                        <td>de 50 céntimos</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Input
                                                type="number"
                                                style={{ width: '60px' }}
                                                value={recuerdo.monedasRecordadas.sol1}
                                                onChange={(e) => setRecuerdo((prev: any) => ({
                                                    ...prev,
                                                    monedasRecordadas: {
                                                        ...prev.monedasRecordadas,
                                                        sol1: e.target.value
                                                    }
                                                }))}
                                            />
                                        </td>
                                        <td>de 1 sol</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Input
                                                type="number"
                                                style={{ width: '60px' }}
                                                value={recuerdo.monedasRecordadas.soles2}
                                                onChange={(e) => setRecuerdo((prev: any) => ({
                                                    ...prev,
                                                    monedasRecordadas: {
                                                        ...prev.monedasRecordadas,
                                                        soles2: e.target.value
                                                    }
                                                }))}
                                            />
                                        </td>
                                        <td>de 2 soles</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ margin: '16px 0' }}>
                            <Text strong>Intrusiones (respuestas incorrectas adicionales): </Text>
                            <Input 
                                type="number" 
                                min={0}
                                style={{ width: '80px' }}
                                value={intrusiones.recuerdo}
                                onChange={(e) => handleIntrusionChange('recuerdo', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </Space>

                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
                        <Button type="primary" onClick={nextStep}>Finalizar</Button>
                    </div>
                </Card>
            )}

            {currentStep === 6 && (
                <Card title="Resultados de la Evaluación">
                    <Title level={4}>Resumen de puntuaciones</Title>

                    <Row gutter={16} style={{ marginBottom: '20px' }}>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="Parte I: Denominación" 
                                    value={calcularPuntajeParte1()} 
                                    suffix={`/11`} 
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="Parte II: Cálculo" 
                                    value={calcularPuntajeParte2()} 
                                    suffix={`/10`} 
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic 
                                    title="Parte III: Recuerdo" 
                                    value={calcularPuntajeParte3()} 
                                    suffix={`/10`} 
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    <Row gutter={16} style={{ marginBottom: '20px' }}>
                        <Col span={24}>
                            <Card>
                                <Statistic 
                                    title="Puntuación Total" 
                                    value={calcularPuntajeTotal()} 
                                    suffix={`/31`} 
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    <Title level={4}>Interpretación Clínica</Title>
                    {(() => {
                        const interpretacion = interpretarResultado();
                        return (
                            <Alert
                                type={interpretacion.color === "red" ? "error" : "success"}
                                message={interpretacion.diagnostico}
                                description={
                                    <>
                                        <p>{interpretacion.descripcion}</p>
                                        <p><strong>Recomendación:</strong> {interpretacion.recomendacion}</p>
                                        <p><em>Punto de corte: ≤24 puntos (Sensibilidad: 90.5%, Especificidad: 83.3%)</em></p>
                                    </>
                                }
                                style={{ marginBottom: '20px' }}
                            />
                        );
                    })()}

                    <Title level={4}>Detalle por Ítems</Title>
                    <Card>
                        <Title level={5}>Parte I: Denominación</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Monedas correctas: </Text>
                                <Text>{totalMonedasCorrectas}/6</Text>
                                <Text type="secondary"> (Intrusiones: {intrusiones.monedas})</Text>
                            </div>
                            <div>
                                <Text strong>Billetes correctos: </Text>
                                <Text>{totalBilletesCorrectos}/5</Text>
                                <Text type="secondary"> (Intrusiones: {intrusiones.billetes})</Text>
                            </div>
                        </Space>

                        <Divider />

                        <Title level={5}>Parte II: Cálculo con monedas</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {Object.entries(calculos).map(([key, value]) => (
                                <div key={key}>
                                    <Text strong>Ítem {key.replace('item', '')}: </Text>
                                    {value.estado === 'correcto' && <Text type="success">Correcto (primer intento) - 2 pts</Text>}
                                    {value.estado === 'correcto_segundo' && <Text type="warning">Correcto (segundo intento) - 1 pt</Text>}
                                    {value.estado === 'incorrecto' && <Text type="danger">Incorrecto - 0 pts</Text>}
                                    {!value.estado && <Text type="secondary">No evaluado</Text>}
                                </div>
                            ))}
                        </Space>

                        <Divider />

                        <Title level={5}>Parte III: Recuerdo</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Cantidad de monedas (11): </Text>
                                {recuerdo.cantidadMonedas === '11' ?
                                    <Text type="success">Correcto - 1 pt</Text> :
                                    <Text type="danger">Incorrecto - 0 pts</Text>}
                            </div>
                            <div>
                                <Text strong>Total de dinero (9 soles): </Text>
                                {recuerdo.totalDinero === '9' ?
                                    <Text type="success">Correcto - 1 pt</Text> :
                                    <Text type="danger">Incorrecto - 0 pts</Text>}
                            </div>
                            <div>
                                <Text strong>Monedas recordadas: </Text>
                                <Text>{calcularPuntajeParte3() - (recuerdo.cantidadMonedas === '11' ? 1 : 0) - (recuerdo.totalDinero === '9' ? 1 : 0)}/8</Text>
                                <Text type="secondary"> (Intrusiones: {intrusiones.recuerdo})</Text>
                            </div>
                        </Space>

                        <Divider />

                        <Title level={5}>Fluencia verbal</Title>
                        <Text>Total animales mencionados: {animales.length} (no puntúa)</Text>
                    </Card>

                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button style={{ marginRight: '10px' }} onClick={() => setCurrentStep(1)}>Volver al inicio</Button>
                        <Button type="primary" onClick={handleSaveData}>Guardar resultados</Button>
                    </div>
                </Card>
            )}
        </div>
    );
}