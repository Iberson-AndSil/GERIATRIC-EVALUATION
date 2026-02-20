"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Form, Radio, Card, Row, Col, Typography, Space, Button, notification, Statistic, Divider, Tag } from "antd";
import { SaveOutlined, HeartOutlined, CheckCircleOutlined, SyncOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { actualizarResultado, obtenerResultadoPorId } from "../lib/pacienteService";
import Link from "next/link";

const { Title, Text } = Typography;

interface FragilidadValues {
  exhausto: "SI" | "NO";
  apetito: "DISMINUYO" | "IGUAL" | "AUMENTO";
  caminar: "SI" | "NO";
  escaleras: "SI" | "NO";
  actividad: "MAS_UNA" | "UNA_VEZ" | "MES" | "CASI_NUNCA";
  dinamometria?: number;
}

interface ResultadoClinico {
  id: string;
  inexistente?: boolean;
  dynamometry?: number;
  evaluacion_fragilidad?: {
    exhausto: string;
    apetito: string;
    caminar: string;
    escaleras: string;
    actividad: string;
    score_fragilidad: number;
    categoria: string;
  };
}

const SCORE_MAP: Record<string, number> = {
  SI: 1,
  DISMINUYO: 1,
  CASI_NUNCA: 1,
};

const FragilidadForm: React.FC = () => {
  const [form] = Form.useForm<FragilidadValues>();
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [score, setScore] = useState<number>(0);

  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { currentPatient, currentResultId } = useGlobalContext();

  const categoria = useMemo(() => {
    if (score >= 3) return { label: "FRÁGIL", color: "red", icon: <CheckCircleOutlined /> };
    if (score >= 1) return { label: "PRE-FRÁGIL", color: "orange", icon: <SyncOutlined spin /> };
    return { label: "NO FRÁGIL", color: "green", icon: <CheckCircleOutlined /> };
  }, [score]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!currentPatient?.dni || !currentResultId) {
        setIsSyncing(false);
        return;
      }
      try {
        setIsSyncing(true);
        const resultado = (await obtenerResultadoPorId(currentPatient.dni, currentResultId)) as ResultadoClinico;
        if (resultado && !resultado.inexistente) {
          const { evaluacion_fragilidad: frag, dynamometry } = resultado;
          const initialValues = {
            dinamometria: dynamometry || 0,
            ...(frag || {}),
          } as FragilidadValues;
          form.setFieldsValue(initialValues);
          if (frag?.score_fragilidad) setScore(frag.score_fragilidad);
        }
      } catch (error) {
        api.error({ message: "Error al sincronizar datos previos" });
      } finally {
        setIsSyncing(false);
      }
    };
    cargarDatos();
  }, [currentPatient?.dni, currentResultId, form, api]);

  const saveToFirebase = async () => {
    if (!currentPatient?.dni || !currentResultId) {
      api.warning({ message: "Atención", description: "No hay paciente seleccionado." });
      return;
    }
    try {
      setLoading(true);
      const values = await form.validateFields();
      await actualizarResultado(currentPatient.dni, currentResultId, "evaluacion_fragilidad", {
        ...values,
        score_fragilidad: score,
        categoria: categoria.label,
        // fecha: new Date().toISOString(),
      });
      api.success({ message: "Éxito", description: "Evaluación guardada correctamente." });
      router.push("/physical");
    } catch (error: any) {
      if (!error.errorFields) api.error({ message: "Error al guardar" });
    } finally {
      setLoading(false);
    }
  };

  const handleValuesChange = (_: any, allValues: FragilidadValues) => {
    let puntos = 0;
    const keys: (keyof FragilidadValues)[] = ["exhausto", "apetito", "caminar", "escaleras", "actividad"];
    keys.forEach((key) => {
      if (SCORE_MAP[allValues[key] as string]) puntos++;
    });
    setScore(puntos);
  };

  return (
    <div className="min-h-screen p-4">
      {contextHolder}
      <div className="text-center mb-8">
        <Title level={3} style={{ color: "#0050b3", margin: 0 }}>
          <HeartOutlined className="mr-2" />
          REGISTRO DE RESULTADOS: FRAGILIDAD
        </Title>
        <Text type="secondary" className="text-lg italic">
          SHARE-FI (Fried Phenotype)
        </Text>
      </div>

      <Card className="mx-auto shadow-md border-0 rounded-2xl max-w-6xl">
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange} requiredMark={false}>
          <Row gutter={48}>
            <Col xs={24} lg={15}>
              <Space direction="vertical" size={32} className="w-full">
                <div className="flex">
                  <div className="flex w-1/2 !mx-2">
                    <FormQuestion
                      name="exhausto"
                      label="SENTIRSE EXHAUSTO"
                      description="En el último mes, ¿ha sentido que no tenía suficiente energía/fuerza/ánimo/ganas para hacer las cosas que quería hacer?"
                      options={[
                        { l: "SÍ", v: "SI" },
                        { l: "NO", v: "NO" },
                      ]}
                    />
                  </div>
                  <div className="flex w-1/2">
                    <Form.Item
                      name="apetito"
                      label={
                        <Text strong className="text-base uppercase">
                          Pérdida de Apetito
                        </Text>
                      }
                      extra={<Text type="secondary">¿Cómo ha estado su apetito?</Text>}
                    >
                      <Radio.Group className="w-full">
                        <Space direction="vertical" className="bg-slate-50 p-4 rounded-lg">
                          <Radio value="DISMINUYO">Disminuyó / he estado comiendo menos de lo habitual</Radio>
                          <Radio value="IGUAL">Igual / he estado comiendo más ni menos de lo habitual</Radio>
                          <Radio value="AUMENTO">Aumentó / he estado comiendo más de lo habitual</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <Row gutter={24}>
                    <Col span={12}>
                      <FormQuestion
                        name="caminar"
                        label="Caminar 100 metros"
                        description="¿Tiene problemas para realizar esta actividad?"
                        options={[
                          { l: "SÍ", v: "SI" },
                          { l: "NO", v: "NO" },
                        ]}
                      />
                    </Col>
                    <Col span={12}>
                      <FormQuestion
                        name="escaleras"
                        label="Subir escaleras"
                        description="¿Puede subir un tramo sin descansar?"
                        options={[
                          { l: "SÍ", v: "SI" },
                          { l: "NO", v: "NO" },
                        ]}
                      />
                    </Col>
                  </Row>
                </div>

                <Form.Item
                  name="actividad"
                  label={
                    <Text strong className="text-base uppercase">
                      Actividad Física
                    </Text>
                  }
                  extra={<Text type="secondary">¿Con qué frecuencia realiza ejercicios físicos (huerta, animales, etc.)?</Text>}
                >
                  <Radio.Group className="w-full mt-2">
                    <Row gutter={[16, 16]}>
                      {[
                        { label: "Más de una vez a la semana", value: "MAS_UNA" },
                        { label: "Una vez a la semana", value: "UNA_VEZ" },
                        { label: "De una a tres veces al mes", value: "MES" },
                        { label: "Casi nunca, o nunca", value: "CASI_NUNCA" },
                      ].map((opt) => (
                        <Col span={12} key={opt.value}>
                          <Radio.Button
                            value={opt.value}
                            className="w-full text-center h-12 flex items-center justify-center rounded-md border-2 before:hidden font-semibold"
                          >
                            {opt.label}
                          </Radio.Button>
                        </Col>
                      ))}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Space>
            </Col>

            <Col xs={24} lg={9}>
              <Card className="sticky top-6 border-0 bg-slate-100 rounded-3xl overflow-hidden shadow-sm p-3">
                <div className={`p-8 text-center transition-all`}>
                  <Statistic
                    title={<span className="uppercase tracking-widest text-xs font-bold text-slate-900 opacity-90">Puntuación Total</span>}
                    value={score}
                    valueStyle={{
                      color: "#0f172a",
                      fontSize: "4.5rem",
                      fontWeight: "900",
                      lineHeight: 1,
                    }}
                    suffix={<span className="text-slate-800 text-2xl font-bold opacity-60">/ 5</span>}
                  />
                </div>

                <div className="p-8 text-center">
                  <Text type="secondary" className="block mb-4 text-xs uppercase font-bold tracking-widest">
                    Categoría de Fragilidad
                  </Text>
                  <Tag color={categoria.color} className="text-xl px-8 py-3 rounded-xl font-black border-0 shadow-md">
                    {categoria.label}
                  </Tag>

                  <Divider className="my-8" />

                  <Form.Item
                    name="dinamometria"
                    label={
                      <Text type="secondary" className="uppercase text-xs font-bold">
                        Dinamometría (Fuerza Manual)
                      </Text>
                    }
                  >
                    <div className="bg-white py-6 rounded-2xl border-2 border-dashed border-slate-200">
                      <Statistic
                        value={form.getFieldValue("dinamometria") || 0}
                        precision={1}
                        suffix="Kg"
                        valueStyle={{ color: "#1e293b", fontWeight: "bold" }}
                      />
                    </div>
                  </Form.Item>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row justify="center" className="mt-12 mb-12" gutter={16}>
        <Col>
          <Link href="/comorbidity" passHref>
            <Button type="default" icon={<ArrowLeftOutlined />} size="large" className="rounded-xl px-10 h-14 font-semibold">
              Atrás
            </Button>
          </Link>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={saveToFirebase}
            disabled={!currentPatient}
            loading={loading}
            icon={<SaveOutlined />}
            className="rounded-xl px-10 h-14 font-semibold shadow-lg shadow-blue-200"
          >
            {currentPatient?.dni ? "Guardar Resultados" : "Seleccione un paciente"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const FormQuestion = ({
  name,
  label,
  description,
  options,
}: {
  name: string;
  label: string;
  description: string;
  options: { l: string; v: string }[];
}) => (
  <Form.Item
    name={name}
    label={
      <Text strong className="text-base uppercase">
        {label}
      </Text>
    }
    extra={
      <Text type="secondary" className="text-xs">
        {description}
      </Text>
    }
    className="m-0"
  >
    <Radio.Group className="w-full mt-2">
      <div className="flex justify-center my-2 !w-auto">
        {options.map((opt) => (
          <Radio.Button key={opt.v} value={opt.v}>
            {opt.l}
          </Radio.Button>
        ))}
      </div>
    </Radio.Group>
  </Form.Item>
);

export default FragilidadForm;
