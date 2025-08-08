'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Input, Table, Typography, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Column, Pie, Bar, Scatter } from '@ant-design/charts';
import { Paciente } from '../interfaces';
import { useGlobalContext } from '@/app/context/GlobalContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const DashboardPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const { excelData } = useGlobalContext();

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      const datosFormateados = excelData.map((item: any) => ({
        ...item,
        edad: Number(item.edad) || 0,
        sexo: String(item.sexo) || '',
        abvdScore: Number(item.abvdScore) || 0,
      }));

      setPacientes(datosFormateados);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [excelData]);

  const pacientesFiltrados = busqueda
    ? pacientes.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.dni?.includes(busqueda) ||
      p.codigo?.includes(busqueda)
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
      .filter(p => !isNaN(Number(p.abvdScore)))
      .map(p => ({
        edad: Number(p.edad) || 0,
        puntuacion: Number(p.abvdScore) || 0,
      })),
    xField: 'edad',
    yField: 'puntuacion',
    colorField: 'puntuacion',
    size: 5,
    tooltip: {
      fields: ['edad', 'puntuacion'],
      formatter: (datum: any) => ({
        name: datum.nombre || 'Sin nombre',
        value: `Edad: ${datum.edad}\nPuntuación ABVD: ${datum.puntuacion}`,
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
        promedio: masculinos.length > 0 ? masculinos.reduce((sum, p) => sum + p.abvdScore, 0) / masculinos.length : 0,
        count: masculinos.length,
      },
      {
        sexo: 'Femenino',
        promedio: femeninos.length > 0 ? femeninos.reduce((sum, p) => sum + p.abvdScore, 0) / femeninos.length : 0,
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
          value: `Promedio: ${item.promedio.toFixed(2)}\nPacientes: ${item.count}`,
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
              placeholder="Buscar paciente por nombre, DNI o código"
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
              {/* Detalles del paciente existentes... */}
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
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="Edad vs. Puntuación ABVD" loading={loading}>
                  <Scatter {...configEdadPuntuacionScatter} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Promedio de Puntuación ABVD por Sexo" loading={loading}>
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
                      { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
                      { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
                      { title: 'DNI', dataIndex: 'dni', key: 'dni' },
                      { title: 'Edad', dataIndex: 'edad', key: 'edad' },
                      { title: 'Sexo', dataIndex: 'sexo', key: 'sexo', render: (sexo) => sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : 'No especificado' },
                      { title: 'Puntuación ABVD', dataIndex: 'abvdScore', key: 'abvdScore' },
                      {
                        title: 'Acciones',
                        key: 'acciones',
                        render: (_, record) => (
                          <a onClick={() => setPacienteSeleccionado(record)}>Ver detalles</a>
                        )
                      }
                    ]}
                    rowKey="codigo"
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