'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, Row, Col, Input, Table, Typography, Spin, Select, Space, Button, Statistic, Tag, Divider, ConfigProvider } from 'antd';
import { SearchOutlined, UserOutlined, ClockCircleOutlined, MedicineBoxOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Column, Pie, Bar, Scatter } from '@ant-design/charts';
import { Paciente } from '../interfaces';
import { obtenerPacientesConResultadosRecientes } from '../lib/pacienteService';
import { useRouter } from 'next/navigation';
import Highlighter from 'react-highlight-words';
import { FilterDropdownProps } from 'antd/es/table/interface';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type MetricOption = {
  value: string;
  label: string;
};

const DashboardPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('abvdScore');
  const router = useRouter();
  const searchInput = useRef<any>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<keyof Paciente | "">("");

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

  // --- KPIs Calculations ---
  const totalPacientes = pacientes.length;
  const promedioEdad = pacientes.length > 0 
    ? (pacientes.reduce((sum, p) => sum + (Number(p.edad) || 0), 0) / pacientes.length).toFixed(1) 
    : '0';
  const totalMasculinos = pacientes.filter(p => p.sexo === 'M').length;
  const totalFemeninos = pacientes.filter(p => p.sexo === 'F').length;

  // --- Chart Configurations ---
  const configSexoPie = {
    data: [
      { tipo: 'Masculino', value: totalMasculinos },
      { tipo: 'Femenino', value: totalFemeninos },
    ],
    angleField: 'value',
    colorField: 'tipo',
    color: ['#1890ff', '#eb2f96'], // Modern blue and pink
    radius: 0.8,
    innerRadius: 0.6,
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        },
        content: 'Total\n' + totalPacientes,
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'bottom' as const,
      flipPage: false,
    },
    pieStyle: {
      lineWidth: 2,
      stroke: '#fff',
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
        case '60-69': return '#5B8FF9';
        case '70-79': return '#5AD8A6';
        case '80+': return '#F6BD16';
        default: return '#E8E8E8';
      }
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof Paciente,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

    const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };


  const getColumnSearchProps = (dataIndex: keyof Paciente) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        ?.includes((value as string).toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

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
    shape: 'circle',
    pointStyle: {
      fillOpacity: 0.85,
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
    color: ({ sexo }: { sexo: string }) => sexo === 'Masculino' ? '#1890ff' : '#eb2f96',
    barStyle: {
      radius: [0, 4, 4, 0], // Rounded corners for horizontal bar
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

  const patientRecordRedirect = (patient: Paciente) => {
    // setCurrentPatient(patient);
    router.push(`/record/${patient.dni}`)
  }

  return (
    <ConfigProvider theme={{
      token: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        borderRadius: 8,
        colorBgContainer: '#ffffff',
      },
      components: {
        Card: {
          headerBg: 'transparent',
        }
      }
    }}>
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Header style={{ 
          background: '#ffffff', 
          padding: '0 32px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: '72px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 8, 
              background: '#1890ff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: 20
            }}>
              <MedicineBoxOutlined />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
                Portal de Análisis Geriátrico
              </Title>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '-4px', display: 'block' }}>
                Resumen Ejecutivo y Métricas
              </Text>
            </div>
          </div>
        </Header>

        <Content style={{ margin: '24px auto', padding: '0 24px', maxWidth: 1400, width: '100%' }}>
          
          {/* Top KPI row */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<Text type="secondary" strong>Total Pacientes</Text>}
                  value={totalPacientes}
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '28px' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<Text type="secondary" strong>Edad Promedio</Text>}
                  value={promedioEdad}
                  suffix="años"
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '28px' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<Text type="secondary" strong>Hombres</Text>}
                  value={totalMasculinos}
                  suffix={`(${((totalMasculinos/totalPacientes)*100).toFixed(0)}%)`}
                  valueStyle={{ color: '#1890ff', fontWeight: 600, fontSize: '28px' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<Text type="secondary" strong>Mujeres</Text>}
                  value={totalFemeninos}
                  suffix={`(${((totalFemeninos/totalPacientes)*100).toFixed(0)}%)`}
                  valueStyle={{ color: '#eb2f96', fontWeight: 600, fontSize: '28px' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Configuration Banner */}
          <Card bordered={false} className="shadow-sm mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Row align="middle" justify="space-between" gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>Seleccionar Métrica de Análisis:</Text>
                  <Select
                    style={{ width: 220 }}
                    size="large"
                    value={selectedMetric}
                    onChange={(value) => setSelectedMetric(value)}
                    options={metricOptions}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Input
                  size="large"
                  placeholder="Buscar paciente por nombre o DNI..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  onChange={e => setBusqueda(e.target.value)}
                  allowClear
                  style={{ borderRadius: '8px' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Charts Row */}
          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={8}>
              <Card 
                title={<span style={{ fontWeight: 600 }}>Distribución por Sexo</span>} 
                bordered={false} 
                className="shadow-sm h-full"
                loading={loading}
              >
                <div style={{ height: 300 }}>
                  <Pie {...configSexoPie} />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card 
                title={<span style={{ fontWeight: 600 }}>Distribución por Rango de Edad</span>} 
                bordered={false} 
                className="shadow-sm h-full"
                loading={loading}
              >
                <div style={{ height: 300 }}>
                  <Column {...configEdadRangos} />
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontWeight: 600 }}>Edad vs. Puntuación: {metricOptions.find(m => m.value === selectedMetric)?.label}</span>} 
                bordered={false} 
                className="shadow-sm h-full"
                loading={loading}
              >
                <div style={{ height: 350 }}>
                  <Scatter {...configEdadPuntuacionScatter} />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontWeight: 600 }}>Promedio de {metricOptions.find(m => m.value === selectedMetric)?.label} por Sexo</span>} 
                bordered={false} 
                className="shadow-sm h-full"
                loading={loading}
              >
                <div style={{ height: 350, display: 'flex', alignItems: 'center' }}>
                  <Bar {...configPromedioSexoBar} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Data Table */}
          <Card 
            title={<span style={{ fontWeight: 600, fontSize: '18px' }}>Directorio de Pacientes</span>} 
            bordered={false} 
            className="shadow-sm"
            loading={loading}
            bodyStyle={{ padding: 0 }}
          >
            <Table
              dataSource={pacientesFiltrados}
              columns={[
                { 
                  title: 'Nombre Completo', 
                  dataIndex: 'nombre', 
                  key: 'nombre',
                  render: (text: string) => <Text strong>{text || 'Desconocido'}</Text>
                },
                {
                  title: 'DNI',
                  dataIndex: 'dni',
                  key: 'dni',
                  ...getColumnSearchProps('dni'),
                  render: (text: string) => <Text code>{text}</Text>
                },
                { 
                  title: 'Edad', 
                  dataIndex: 'edad', 
                  key: 'edad',
                  align: 'center',
                  sorter: (a, b) => a.edad - b.edad
                },
                {
                  title: 'Sexo',
                  dataIndex: 'sexo',
                  key: 'sexo',
                  align: 'center',
                  render: (sexo) => (
                    <Tag color={sexo === 'M' ? 'blue' : sexo === 'F' ? 'magenta' : 'default'} style={{ margin: 0 }}>
                      {sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Femenino' : 'No especificado'}
                    </Tag>
                  )
                },
                {
                  title: metricOptions.find(m => m.value === selectedMetric)?.label || 'Score',
                  dataIndex: selectedMetric,
                  key: selectedMetric,
                  align: 'center',
                  render: (score) => (
                    <Tag color="purple">
                      {typeof score === 'number' ? score.toFixed(1) : score}
                    </Tag>
                  ),
                  sorter: (a: any, b: any) => (Number(a[selectedMetric]) || 0) - (Number(b[selectedMetric]) || 0)
                },
                {
                  title: 'Acciones',
                  key: 'acciones',
                  align: 'center',
                  render: (_, record) => (
                    <Button 
                      type="link" 
                      onClick={() => patientRecordRedirect(record)}
                      icon={<ArrowRightOutlined />}
                    >
                      Ver Perfil
                    </Button>
                  )
                }
              ]}
              rowKey="dni"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} pacientes`
              }}
              className="px-4 pb-4 pt-2"
            />
          </Card>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardPacientes;