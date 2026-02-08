'use client';
import { useState, useMemo } from 'react';
import { Typography, Row, Col, Button, notification, Progress, Tag } from 'antd';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined, DashboardOutlined } from "@ant-design/icons";
import { actualizarResultado } from '../lib/pacienteService';

const { Title, Text } = Typography;

type Respuesta = 'si' | 'no';
type Respuestas = { [key: number]: Respuesta };

const preguntas: { texto: string; sumaSiEs: Respuesta }[] = [
  { texto: "¿Está satisfecho/a con su vida?", sumaSiEs: 'no' },
  { texto: "¿Ha abandonado tareas habituales?", sumaSiEs: 'si' },
  { texto: "¿Siente que su vida está vacía?", sumaSiEs: 'si' },
  { texto: "¿Se siente frecuentemente aburrido?", sumaSiEs: 'si' },
  { texto: "¿Está de buen humor mayormente?", sumaSiEs: 'no' },
  { texto: "¿Teme que algo malo ocurra?", sumaSiEs: 'si' },
  { texto: "¿Se siente feliz mayormente?", sumaSiEs: 'no' },
  { texto: "¿Se siente desamparado/a?", sumaSiEs: 'si' },
  { texto: "¿Prefiere quedarse en casa?", sumaSiEs: 'si' },
  { texto: "¿Tiene problemas de memoria?", sumaSiEs: 'si' },
  { texto: "¿Piensa que es estupendo vivir?", sumaSiEs: 'no' },
  { texto: "¿Se siente inútil actualmente?", sumaSiEs: 'si' },
  { texto: "¿Se siente lleno/a de energía?", sumaSiEs: 'no' },
  { texto: "¿Se siente sin esperanza?", sumaSiEs: 'si' },
  { texto: "¿Cree que otros están mejor?", sumaSiEs: 'si' },
];

export default function Cuestionario() {
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const { currentPatient, currentResultId } = useGlobalContext();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: Respuesta) => {
    setRespuestas(prev => ({ ...prev, [index]: value }));
  };

  const puntajeActual = useMemo(() =>
    preguntas.reduce((acum, { sumaSiEs }, index) => {
      return respuestas[index] === sumaSiEs ? acum + 1 : acum;
    }, 0), [respuestas]);

  const interpretacion = useMemo(() => {
    if (puntajeActual <= 4) return { texto: "Normal", color: "green" };
    if (puntajeActual <= 8) return { texto: "Depresión leve", color: "gold" };
    if (puntajeActual <= 11) return { texto: "Depresión moderada", color: "orange" };
    return { texto: "Depresión severa", color: "red" };
  }, [puntajeActual]);

  const handleSaveData = async () => {
    try {
      setLoading(true);
      if (!currentPatient?.dni) throw new Error("Seleccione un paciente");
      await actualizarResultado(currentPatient!.dni, currentResultId || "", 'afectiva', puntajeActual);
      api.success({ message: 'Guardado', description: 'GDS-15 registrado.', placement: 'topRight' });
      router.push('/nutritional');
    } catch (err: any) {
      api.error({ message: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const respondidasCount = Object.keys(respuestas).length;
  const progreso = Math.round((respondidasCount / preguntas.length) * 100);
  const isComplete = respondidasCount === 15;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col items-center">
      {contextHolder}

      <div className="w-full max-w-5xl text-center mb-6 pt-2">
        <Title level={4} className="!text-slate-700 !m-0 !font-bold">Escala GDS-15</Title>
        <div className="flex justify-center items-center gap-2 mt-1">
          <Progress percent={progreso} strokeColor="#3b82f6" trailColor="#cbd5e1" showInfo={false} size="small" className="w-24 !m-0 h-1" />
          <Text type="secondary" className="text-[10px] font-bold">{respondidasCount}/15</Text>
        </div>
      </div>
      <div className="w-full max-w-7xl px-6">
        <Row gutter={[10, 10]}>
          {preguntas.map((pregunta, index) => {
            const resp = respuestas[index];
            const isAnswered = resp !== undefined;

            return (
              <Col key={index} xs={24} sm={12} md={8}>
                <div
                  className={`
                    p-3 rounded-lg border transition-all duration-200 flex flex-col justify-between h-full bg-white
                    ${isAnswered ? 'border-blue-300 shadow-sm' : 'border-slate-200 hover:border-blue-300'}
                  `}
                >
                  <div className="flex gap-2 mb-3">
                    <span className="text-blue-500 font-bold text-xs mt-[1px]">{index + 1}.</span>
                    <Text className="text-slate-600 font-medium text-xs leading-tight">
                      {pregunta.texto}
                    </Text>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {(['si', 'no'] as const).map((opcion) => {
                      const isSelected = resp === opcion;
                      return (
                        <button
                          key={opcion}
                          onClick={() => handleChange(index, opcion)}
                          className={`
                                    flex-1 h-7 rounded text-[10px] font-bold uppercase tracking-wide border transition-all
                                    ${isSelected
                              ? 'bg-blue-500 border-blue-500 !text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 !text-slate-400 hover:bg-white hover:text-blue-500 hover:border-blue-200'
                            }
                                `}
                        >
                          {opcion}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        <div className="mt-8 mb-12 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <DashboardOutlined style={{ fontSize: '20px' }} />
              </div>
              <div>
                <Text className="text-[10px] text-slate-400 uppercase font-bold block">Diagnóstico Actual</Text>
                <div className="flex items-center gap-3">
                  <Text strong className="text-lg text-slate-700">{puntajeActual} <span className="text-xs font-normal text-slate-400">/ 15</span></Text>
                  <Tag color={interpretacion.color} className="font-bold border-none px-2 py-0.5 text-xs">
                    {interpretacion.texto}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto justify-end">
              <Link href="/moca" passHref>
                <Button icon={<ArrowLeftOutlined />}>
                  Atrás
                </Button>
              </Link>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveData}
                loading={loading}
                disabled={!currentPatient || !isComplete}
                className="bg-blue-600 hover:bg-blue-500 shadow-sm min-w-[120px]"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}