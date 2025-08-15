'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Table, Typography, Spin, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Column, Pie, Bar, Scatter } from '@ant-design/charts';
import { Paciente } from '../interfaces';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { obtenerPacientesConResultadosRecientes } from '../lib/pacienteService';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type MetricOption = {
  value: string;
  label: string;
};

const DashboardPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('abvdScore');

  const metricOptions: MetricOption[] = [
    { value: 'gijon', label: 'Gijón' },
    { value: 'abvdScore', label: 'ABVD Score' },
    { value: 'aivdScore', label: 'AIVD Score' },
    { value: 'sarcopenia', label: 'Sarcopenia' },
    { value: 'caida', label: 'Caída' },
    { value: 'deterioro', label: 'Deterioro' },
    { value: 'incontinencia', label: 'Incontinencia' },
    { value: 'depresion', label: 'Depresión' },
    { value: 'sensorial', label: 'Sensorial' },
    { value: 'bristol', label: 'Bristol' },
    { value: 'adherencia', label: 'Adherencia' },
    { value: 'dynamometry', label: 'Dynamometry' },
    { value: 'balance', label: 'Balance' },
    { value: 'dimension_fisica', label: 'Dimensión Física' },
    { value: 'dimension_mental', label: 'Dimensión Mental' },
    { value: 'puntaje_total', label: 'Puntaje Total' },
    { value: 'cognitivo_total', label: 'Cognitivo Total' },
    { value: 'mmse30', label: 'MMSE30' },
    { value: 'moca', label: 'MOCA' },
    { value: 'afectiva', label: 'Afectiva' },
    { value: 'nutricional', label: 'Nutricional' },
  ];

  useEffect(() => {
    const cargarPacientes = async () => {
      setLoading(true);
      try {
        const datos = await obtenerPacientesConResultadosRecientes();

        const datosFormateados = datos.map(item => {
          const sexo = typeof item.sexo === 'string' ?
            (item.sexo.trim().toUpperCase() === 'M' ? 'M' :
              item.sexo.trim().toUpperCase() === 'F' ? 'F' : item.sexo) :
            item.sexo;
          return {
            ...item,
            edad: Number(item.edad) || 0,
            sexo: sexo,
            abvdScore: Number(item.abvdScore) || 0,
            gijon: Number(item.gijon) || 0,
            aivdScore: Number(item.aivdScore) || 0,
            sarcopenia: Number(item.sarcopenia) || 0,
            caida: Number(item.caida) || 0,
            deterioro: Number(item.deterioro) || 0,
            incontinencia: Number(item.incontinencia) || 0,
            depresion: Number(item.depresion) || 0,
            sensorial: Number(item.sensorial) || 0,
            bristol: Number(item.bristol) || 0,
            adherencia: Number(item.adherencia) || 0,
            dynamometry: Number(item.dynamometry) || 0,
            balance: Number(item.balance) || 0,
            dimension_fisica: Number(item.dimension_fisica) || 0,
            dimension_mental: Number(item.dimension_mental) || 0,
            puntaje_total: Number(item.puntaje_total) || 0,
            cognitivo_total: Number(item.cognitivo_total) || 0,
            mmse30: Number(item.mmse30) || 0,
            moca: Number(item.moca) || 0,
            afectiva: Number(item.afectiva) || 0,
          } as Paciente;
        });

        setPacientes(datosFormateados);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPacientes();
  }, []);

  const pacientesFiltrados = busqueda
    ? pacientes.filter(p =>
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.dni?.includes(busqueda)
    )
    : pacientes;

  const configSexoPie = {
    data: [
      { tipo: 'Masculino', value: pacientes.filter(p => p.sexo === 'M').length },
      { tipo: 'Femenino', value: pacientes.filter(p => p.sexo === 'F').length },
    ],
    angleField: 'value',
    colorField: 'tipo',
    label: {
      type: 'inner',
      content: '{percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom',
    },
  };

  const configEdadRangos = {
    data: pacientes.length > 0 ? [
      {
        rango: '60-69',
        value: pacientes.filter(p => p.edad >= 60 && p.edad <= 69).length,
      },
      {
        rango: '70-79',
        value: pacientes.filter(p => p.edad >= 70 && p.edad <= 79).length,
      },
      {
        rango: '80+',
        value: pacientes.filter(p => p.edad >= 80).length,
      },
    ] : [],
    xField: 'rango',
    yField: 'value',
    columnWidthRatio: 0.4,
    marginRatio: 0.5,
    xAxis: {
      tickCount: 3,
      label: {
        style: {
          fontSize: 14,
          fill: '#333',
        },
        offset: 10,
      },
      line: {
        style: {
          lineWidth: 1,
          stroke: '#ddd',
        },
      },
      tickLine: {
        style: {
          lineWidth: 1,
          stroke: '#ddd',
        },
        length: 5,
      },
    },
    yAxis: {
      title: {
        text: 'Número de Pacientes',
        style: {
          fontSize: 14,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
          },
        },
      },
    },
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 12,
        fontWeight: 'bold',
      },
      formatter: (value: number, item: any) => {
        if (!item || typeof value !== 'number') return '0\n(0%)';

        const total = pacientes.length || 1;
        const porcentaje = (value / total) * 100;
        return `${value}\n(${porcentaje.toFixed(1)}%)`;
      },
    },
    color: ({ rango }: { rango: string }) => {
      switch (rango) {
        case '60-69': return '#1890ff';
        case '70-79': return '#52c41a';
        case '80+': return '#faad14';
        default: return '#d9d9d9';
      }
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const configEdadPuntuacionScatter = {
    data: pacientes
      .filter(p => !isNaN(Number(p[selectedMetric as keyof Paciente])))
      .map(p => ({
        edad: Number(p.edad) || 0,
        puntuacion: Number(p[selectedMetric as keyof Paciente]) || 0,
        nombre: p.nombre || 'Sin nombre',
      })),
    xField: 'edad',
    yField: 'puntuacion',
    colorField: 'puntuacion',
    size: 5,
    tooltip: {
      fields: ['edad', 'puntuacion', 'nombre'],
      formatter: (datum: any) => ({
        name: datum.nombre,
        value: `Edad: ${datum.edad}\nPuntuación ${metricOptions.find(m => m.value === selectedMetric)?.label}: ${datum.puntuacion}`,
      }),
      showTitle: true,
    },
    interactions: [{ type: 'tooltip' }, { type: 'element-active' }],
    pointStyle: {
      fillOpacity: 0.8,
      stroke: '#fff',
      lineWidth: 1,
    },
  };

  const calcularPromedioPorSexo = () => {
    const masculinos = pacientes.filter(p => p.sexo === 'M');
    const femeninos = pacientes.filter(p => p.sexo === 'F');

    return [
      {
        sexo: 'Masculino',
        promedio: masculinos.length > 0 ?
          masculinos.reduce((sum, p) => sum + (Number(p[selectedMetric as keyof Paciente]) || 0), 0) / masculinos.length : 0,
        count: masculinos.length,
      },
      {
        sexo: 'Femenino',
        promedio: femeninos.length > 0 ?
          femeninos.reduce((sum, p) => sum + (Number(p[selectedMetric as keyof Paciente]) || 0), 0) / femeninos.length : 0,
        count: femeninos.length,
      },
    ];
  };

  const configPromedioSexoBar = {
    data: calcularPromedioPorSexo(),
    xField: 'sexo',
    yField: 'promedio',
    seriesField: 'sexo',
    label: {
      position: 'right',
      content: (item: any) => `Promedio: ${item.promedio.toFixed(2)}\nPacientes: ${item.count}`,
    },
    tooltip: {
      fields: ['sexo', 'promedio', 'count'],
      formatter: (item: any) => {
        return {
          name: item.sexo,
          value: `Promedio ${metricOptions.find(m => m.value === selectedMetric)?.label}: ${item.promedio.toFixed(2)}\nPacientes: ${item.count}`,
        };
      },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!pacientes || pacientes.length === 0) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', textAlign: 'center' }}>
          <Title level={4}>No hay datos de pacientes disponibles</Title>
          <Text>Por favor, carga un archivo Excel con los datos de los pacientes.</Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <Title level={3} style={{ padding: '16px 24px', margin: 0 }}>
          Dashboard de Pacientes
        </Title>
      </Header>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input
              size="large"
              placeholder="Buscar paciente por nombre o DNI"
              prefix={<SearchOutlined />}
              onChange={e => setBusqueda(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        {pacienteSeleccionado ? (
          <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Title level={4}>Detalles del Paciente</Title>
              <Text
                strong
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => setPacienteSeleccionado(null)}
              >
                Volver al resumen
              </Text>
            </Row>

            <Card title={`Paciente: ${pacienteSeleccionado.nombre}`} loading={loading}>
              {/* Detalles del paciente */}
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text strong>DNI: </Text>
                  <Text>{pacienteSeleccionado.dni}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Edad: </Text>
                  <Text>{pacienteSeleccionado.edad}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Sexo: </Text>
                  <Text>{pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino'}</Text>
                </Col>
                {/* Agrega más campos según sea necesario */}
              </Row>
            </Card>
          </>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="Distribución por Sexo (Gráfico de torta)" loading={loading}>
                  <Pie {...configSexoPie} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Distribución por Rango de Edad" loading={loading}>
                  <Column {...configEdadRangos} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Seleccionar Métrica" loading={loading}>
                  <Select
                    style={{ width: '100%' }}
                    value={selectedMetric}
                    onChange={(value) => setSelectedMetric(value)}
                  >
                    {metricOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title={`Edad vs. Puntuación ${metricOptions.find(m => m.value === selectedMetric)?.label}`} loading={loading}>
                  <Scatter {...configEdadPuntuacionScatter} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title={`Promedio de ${metricOptions.find(m => m.value === selectedMetric)?.label} por Sexo`} loading={loading}>
                  <Bar {...configPromedioSexoBar} />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Lista de Pacientes" loading={loading}>
                  <Table
                    dataSource={pacientesFiltrados}
                    columns={[
                      { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
                      { title: 'DNI', dataIndex: 'dni', key: 'dni' },
                      { title: 'Edad', dataIndex: 'edad', key: 'edad' },
                      {
                        title: 'Sexo',
                        dataIndex: 'sexo',
                        key: 'sexo',
                        render: (sexo) => sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : 'No especificado'
                      },
                      {
                        title: metricOptions.find(m => m.value === selectedMetric)?.label,
                        dataIndex: selectedMetric,
                        key: selectedMetric
                      },
                      {
                        title: 'Acciones',
                        key: 'acciones',
                        render: (_, record) => (
                          <a onClick={() => setPacienteSeleccionado(record)}>Ver detalles</a>
                        )
                      }
                    ]}
                    rowKey="dni"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default DashboardPacientes;