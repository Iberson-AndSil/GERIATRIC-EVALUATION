"use client";
import { useState } from 'react';
import { Radio, Card, Space, Typography, Col, Input, Checkbox, Button, Row, message, Image } from 'antd';
import { useGlobalContext } from '@/app/context/GlobalContext';
const { Text } = Typography;
import * as XLSX from "xlsx";

export default function Home() {
    const { fileHandle } = useGlobalContext();
    const [depresionResult, setDepresionResult] = useState<string | null>(null);
    const [sensoryResult, setSensoryResult] = useState<string | null>(null);
    const [bristolResult, setBristolResult] = useState<string | null>(null);
    const [adherenciaResult, setAdherenciaResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [depresionData, setDepresionData] = useState({
        vidaSatisfecha: null,
        impotente: null,
        problemasMemoria: null,
        aburrido: null,
    });

    const [sensoryData, setSensoryData] = useState({
        dificultadVista: null,
        usaAnteojos: null,
        dificultadEscucha: null,
        usaAudifonos: null,
    });

    const [bristolData, setBristolData] = useState({
        bristolType: null,
        effort: false,
        hardStool: false,
        incomplete: false,
        obstruction: false,
        manualAid: false,
        lessThanThree: false,
    });

    const [adherenciaData, setAdherenciaData] = useState({
        olvido: null,
        tomarMedicamento: null,
        dejarMedicacion: null,
        sientaMal: null,
    });

    const handleDepresionChange = (field: string, value: string) => {
        const newData = { ...depresionData, [field]: value };
        setDepresionData(newData);
        evaluateDepresion(newData);
    };

    const handleSensoryChange = (field: string, value: string) => {
        const newData = { ...sensoryData, [field]: value };
        setSensoryData(newData);
        evaluateSensory(newData);
        console.log("handleSensoryChange",newData);
        
    };

    const handleBristolChange = (field: string, value: any) => {
        const newData = { ...bristolData, [field]: value };
        setBristolData(newData);
        evaluateBristol(newData);
    };

    const handleAdherenciaChange = (field: string, value: string) => {
        const newData = { ...adherenciaData, [field]: value };
        setAdherenciaData(newData);
        evaluateAdherencia(newData);
    };

    const evaluateDepresion = (data: any) => {
        const respuestasPositivas = Object.values(data).filter(v => v === 'si').length;
        if (Object.values(data).some(v => v === null)) {
            setDepresionResult(null);
            return;
        }
        if (respuestasPositivas >= 2) {
            setDepresionResult('Resultado: Posible depresión (recomendable evaluación adicional)');
        } else {
            setDepresionResult('Resultado: Sin indicios significativos de depresión');
        }
    };

    const evaluateSensory = (data: any) => {
        if (Object.values(data).some(v => v === null)) {
            setSensoryResult(null);
            return;
        }

        const problemasVista = data.dificultadVista === 'si';
        const problemasOido = data.dificultadEscucha === 'si';

        let resultado = 'Resultado: ';
        if (problemasVista && problemasOido) {
            resultado += 'Deterioro visual y auditivo significativo';
        } else if (problemasVista) {
            resultado += 'Deterioro visual significativo';
        } else if (problemasOido) {
            resultado += 'Deterioro auditivo significativo';
        } else {
            resultado += 'Sin deterioro sensorial significativo';
        }

        setSensoryResult(resultado);
    };

    const evaluateBristol = (data: any) => {
        if (data.bristolType === null) {
            setBristolResult(null);
            return;
        }

        const bristolType = parseInt(data.bristolType);
        const symptomsCount = [
            data.effort,
            data.hardStool,
            data.incomplete,
            data.obstruction,
            data.manualAid,
            data.lessThanThree
        ].filter(Boolean).length;

        const isConstipation = (bristolType === 1 || bristolType === 2) && symptomsCount >= 2;

        setBristolResult(
            isConstipation
                ? 'Resultado: Probable estreñimiento funcional (cumple criterios Roma IV)'
                : 'Resultado: No se detectan signos claros de estreñimiento.'
        );
    };

    const evaluateAdherencia = (data: any) => {
        if (Object.values(data).some(v => v === null)) {
            setAdherenciaResult(null);
            return;
        }

        let puntuacion = 0;
        if (data.olvido === 'si') puntuacion++;
        if (data.tomarMedicamento === 'no') puntuacion++;
        if (data.dejarMedicacion === 'si') puntuacion++;
        if (data.sientaMal === 'si') puntuacion++;

        let resultado = 'Resultado: ';
        if (puntuacion === 0) {
            resultado += 'Alta adherencia';
        } else if (puntuacion <= 2) {
            resultado += 'Adherencia intermedia';
        } else {
            resultado += 'Baja adherencia';
        }
        resultado += ` (Puntuación: ${puntuacion})`;

        setAdherenciaResult(resultado);
    };

    const guardarDatos = async () => {

        if (!fileHandle) {
            alert("Por favor seleccione un archivo primero");
            return;
        }
        try {
            setLoading(true);

            const puntajeDepresion = Object.values(depresionData).filter(v => v === 'si').length;
            const puntajeSensorial = [
                sensoryData.dificultadVista === 'si' ? 1 : 0,
                sensoryData.dificultadEscucha === 'si' ? 1 : 0,
                sensoryData.usaAnteojos=== 'si' ? 1 : 0,
                sensoryData.usaAudifonos=== 'si' ? 1 : 0
            ].reduce((a, b) => a + b, 0);

            const puntajeBristol = [
                bristolData.effort ? 1 : 0,
                bristolData.hardStool ? 1 : 0,
                bristolData.incomplete ? 1 : 0,
                bristolData.obstruction ? 1 : 0,
                bristolData.manualAid ? 1 : 0,
                bristolData.lessThanThree ? 1 : 0,
                [1, 2].includes(parseInt(bristolData.bristolType || '0')) ? 1 : 0
            ].reduce((a, b) => a + b, 0);

            const puntajeMoriski = () => {
                let puntuacion = 0;
                if (adherenciaData.olvido === 'si') puntuacion++;
                if (adherenciaData.tomarMedicamento === 'si') puntuacion++;
                if (adherenciaData.dejarMedicacion === 'si') puntuacion++;
                if (adherenciaData.sientaMal === 'si') puntuacion++;
                return puntuacion;
            };

            const file = await fileHandle.getFile();
        const arrayBuffer = await file.arrayBuffer();
        const existingWb = XLSX.read(arrayBuffer, { type: "array" });
        const wsName = existingWb.SheetNames[0];
        const ws = existingWb.Sheets[wsName];

        const existingData: string[][] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            defval: ""
        });

        let lastRowIndex = existingData.length - 1;
        while (lastRowIndex > 0 && existingData[lastRowIndex].every(cell => cell === "")) {
            lastRowIndex--;
        }

        if (lastRowIndex < 0 || (lastRowIndex === 0 && existingData[0].every(cell => cell === ""))) {
            existingData.push([]);
            lastRowIndex = existingData.length - 1;
        }

        while (existingData[lastRowIndex].length < 25) {
            existingData[lastRowIndex].push("");
        }

        existingData[lastRowIndex][21] = puntajeDepresion.toString();
        existingData[lastRowIndex][22] = puntajeSensorial.toString();
        existingData[lastRowIndex][23] = puntajeBristol.toString();
        existingData[lastRowIndex][24] = puntajeMoriski().toString();

        const newWs = XLSX.utils.aoa_to_sheet(existingData);
        const updatedWb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(updatedWb, newWs, wsName);

        const writable = await fileHandle.createWritable();
        await writable.write(XLSX.write(updatedWb, {
            bookType: "xlsx",
            type: "buffer",
            bookSST: true
        }));
        await writable.close();

        message.success("Datos guardados correctamente");
    } catch (error) {
        console.error("Error al guardar datos:", error);
        message.error("Error al guardar los datos");
    } finally {
        setLoading(false);
    }
    };

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="DEPRESIÓN (Geriatric Depression Scale 4 - UPCH)">
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text>¿Está satisfecho con su vida?</Text><br />
                                <Radio.Group onChange={e => handleDepresionChange('vidaSatisfecha', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Se siente impotente o indefenso?</Text><br />
                                <Radio.Group onChange={e => handleDepresionChange('impotente', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Tiene problemas de memoria?</Text><br />
                                <Radio.Group onChange={e => handleDepresionChange('problemasMemoria', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Se encuentra a menudo aburrido?</Text><br />
                                <Radio.Group onChange={e => handleDepresionChange('aburrido', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            {depresionResult && (
                                <Card style={{ marginTop: 16, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                                    <Text strong>{depresionResult}</Text>
                                </Card>
                            )}
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="DETERIORO SENSORIAL (Geriatric Depression Scale 4 - UPCH)">
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text>¿Tiene dificultad para ver la televisión, leer o para ejecutar cualquier actividad de la vida diaria a causa de su vista?</Text><br />
                                <Radio.Group onChange={e => handleSensoryChange('dificultadVista', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Usa anteojos?</Text><br />
                                <Radio.Group onChange={e => handleSensoryChange('usaAnteojos', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Tiene usted problemas para escuchar o tiene dificultad para entender la conversación?</Text><br />
                                <Radio.Group onChange={e => handleSensoryChange('dificultadEscucha', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Usa audífonos?</Text><br />
                                <Radio.Group onChange={e => handleSensoryChange('usaAudifonos', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            {sensoryResult && (
                                <Card style={{ marginTop: 16, backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
                                    <Text strong>{sensoryResult}</Text>
                                </Card>
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card title="Test de Heces de Bristol">
                        <div className='flex'>

                            <Space direction="vertical" size="large" style={{ width: '80%' }}>
                                <div>
                                    <Text>Tipo de heces según la escala de Bristol (1 al 7)</Text>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={7}
                                        placeholder="Ingrese número del 1 al 7"
                                        onChange={e => handleBristolChange('bristolType', e.target.value)}
                                        style={{ marginTop: 8 }}
                                    />
                                    <Text type="secondary">Referencia: 1-2 (estreñimiento), 3-4 (normal), 5-7 (diarrea)</Text>
                                </div>

                                <Checkbox onChange={e => handleBristolChange('effort', e.target.checked)}>
                                    ¿Esfuerzo para defecar?
                                </Checkbox>

                                <Checkbox onChange={e => handleBristolChange('hardStool', e.target.checked)}>
                                    ¿Heces duras?
                                </Checkbox>

                                <Checkbox onChange={e => handleBristolChange('incomplete', e.target.checked)}>
                                    ¿Sensación de evacuación incompleta tras la deposición?
                                </Checkbox>

                                <Checkbox onChange={e => handleBristolChange('obstruction', e.target.checked)}>
                                    ¿Sensación de obstrucción al defecar?
                                </Checkbox>

                                <Checkbox onChange={e => handleBristolChange('manualAid', e.target.checked)}>
                                    ¿Necesita ayuda manual o farmacológica para defecar?
                                </Checkbox>

                                <Checkbox onChange={e => handleBristolChange('lessThanThree', e.target.checked)}>
                                    ¿Menos de 3 deposiciones completas a la semana?
                                </Checkbox>

                                {bristolResult && (
                                    <Card style={{ marginTop: 16, backgroundColor: '#fff2e8', borderColor: '#ffbb96' }}>
                                        <Text strong>{bristolResult}</Text>
                                    </Card>
                                )}
                            </Space>
                            <div className="w-1/2">
                                <Image src="/heces.jpg" alt="Escala de Bristol" />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12}>
                    <Card title="ADHERENCIA A TRATAMIENTO FARMACOLÓGICO (Moriski Green)">
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text>¿Olvida alguna vez tomar los medicamentos para tratar su enfermedad?</Text><br />
                                <Radio.Group onChange={e => handleAdherenciaChange('olvido', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>¿Toma sus medicamentos a las horas indicadas?</Text><br />
                                <Radio.Group onChange={e => handleAdherenciaChange('tomarMedicamento', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>Cuando se encuentra bien, ¿deja de tomar la medicación?</Text><br />
                                <Radio.Group onChange={e => handleAdherenciaChange('dejarMedicacion', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Text>Si alguna vez le sienta mal, ¿deja usted de tomarla?</Text><br />
                                <Radio.Group onChange={e => handleAdherenciaChange('sientaMal', e.target.value)}>
                                    <Radio value="si">Sí</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </div>

                            {adherenciaResult && (
                                <Card style={{ marginTop: 16, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                                    <Text strong>{adherenciaResult}</Text>
                                </Card>
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={guardarDatos}
                        loading={loading}
                        disabled={
                            !depresionResult ||
                            !sensoryResult ||
                            !bristolResult ||
                            !adherenciaResult
                        }
                    >
                        Guardar Todos los Resultados
                    </Button>
                </Col>
            </Row>
        </div>
    );
}