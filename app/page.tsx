"use client";
import React, { useEffect, useState, useRef } from 'react';
import { ConfigProvider, Dropdown, Menu, Popconfirm, Modal, Form, Input, InputNumber, Select, Radio, DatePicker } from 'antd';
import { Button, Table, notification, Card, Space, Row, Col, Typography, Divider, Tag } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, DollarOutlined, EditOutlined, HomeOutlined, IdcardOutlined, ManOutlined, MoreOutlined, PlusOutlined, SearchOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { NotificationPlacement } from 'antd/es/notification/interface';
import Link from 'next/link';
import { Paciente } from './interfaces';
import type { ColumnType } from 'antd/es/table/interface';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from './lib/firebaseConfig';
import { crearRegistroResultados } from './lib/pacienteService';

const { Title, Text } = Typography;
const { Option } = Select;

interface PacienteWithStatus extends Paciente {
  isNew?: boolean;
  requiresCompletion: boolean;
}

const Home = () => {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<PacienteWithStatus[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const { setCurrentPatient, currentPatient, setCurrentResultId } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);
  const [form] = Form.useForm();

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/pacientes");
      const pacientesData = res.data.map((paciente: any) => ({
        ...paciente,
        requiresCompletion: !paciente.codigo || !paciente.nombre || !paciente.dni || !paciente.edad
      }));
      setPacientes(pacientesData);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      openNotification("error", "Error", "No se pudo obtener la lista de pacientes", "topRight");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleDelete = async (dni: string) => {
    try {
      const response = await fetch(`/api/pacientes/${dni}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      openNotification("success", "Éxito", "Paciente eliminado correctamente", "topRight");
      fetchPacientes();
    } catch (error) {
      console.error("Error completo:", error);
      openNotification("error", "Error", "No se pudo eliminar el paciente", "topRight");
    }
  };

  const handleSelectPatient = async (paciente: Paciente) => {
    try {
      setCurrentPatient(paciente);
      const resultadosRef = collection(db, "pacientes", paciente.dni, "resultados");
      const q = query(resultadosRef, orderBy("fecha", "desc"), limit(1));
      const resultadosSnap = await getDocs(q);
      if (!resultadosSnap.empty) {
        const ultimoResultadoDoc = resultadosSnap.docs[0];
        const ultimoResultado = { id: ultimoResultadoDoc.id, ...ultimoResultadoDoc.data() } as { id: string; completado: boolean };
        if (ultimoResultado.completado === false) {
          setCurrentResultId(ultimoResultado.id);          
        }
      } else {
        console.log("No hay resultados para este paciente");
      }
      openNotification(
        "success",
        "Paciente seleccionado",
        `Has seleccionado a ${paciente.nombre}`,
        "topRight"
      );
    } catch (error) {
      console.error("Error al obtener último resultado:", error);
    }
  };

const handleNewEvaluation = async (paciente: Paciente) => {
  try {
    setCurrentPatient(paciente);
    const nuevoResultadoId = await crearRegistroResultados(paciente.dni);
    setCurrentResultId(nuevoResultadoId);
    router.push('/family');
  } catch (error) {
    console.error("Error al crear registro de resultados:", error);
  }
};

  const showEditModal = (paciente: Paciente) => {
    setEditingPatient(paciente);
    const pacienteWithMoment = {
      ...paciente,
      fecha_nacimiento: paciente.fecha_nacimiento ? moment(paciente.fecha_nacimiento) : null
    };
    form.setFieldsValue(pacienteWithMoment);
    setIsModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();

      if (!editingPatient?.dni) {
        throw new Error('No se ha seleccionado un paciente válido para editar');
      }

      const fechaNacimiento = new Date(
        parseInt(values.year),
        parseInt(values.month) - 1,
        parseInt(values.day)
      );

      const payload = {
        ...values,
        fecha_nacimiento: fechaNacimiento,
        ingreso_economico: Number(values.ingreso_economico)
      };

      const response = await axios.put(`/api/pacientes/${editingPatient.dni}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        openNotification("success", "Éxito", "Paciente actualizado correctamente", "topRight");
        await fetchPacientes();
        setIsModalVisible(false);
        form.resetFields();
      } else {
        throw new Error(`Respuesta inesperada: ${response.status}`);
      }
    } catch (error) {
      console.error("Error completo:", error);

      let errorMessage = "No se pudo actualizar el paciente";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message;
        console.error("Detalles del error:", error.response?.data);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      openNotification("error", "Error", errorMessage, "topRight");
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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

  const columns: ColumnType<Paciente>[] = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      ...getColumnSearchProps('nombre'),
      render: (text: string) => <Text strong>{text}</Text>
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
      align: 'center' as const,
      sorter: (a: Paciente, b: Paciente) => (a.edad || 0) - (b.edad || 0),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
      align: 'center' as const,
      render: (text: string) => (
        <Tag color={text === 'M' ? 'blue' : 'pink'}>
          {text}
        </Tag>
      ),
      filters: [
        { text: 'Masculino', value: 'M' },
        { text: 'Femenino', value: 'F' },
      ],
      onFilter: (value: any, record: Paciente) => record.sexo === value,
    },
    {
      title: 'Acciones',
      key: 'action',
      align: 'center' as const,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handleSelectPatient(record)}
          >
            Seleccionar
          </Button>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  icon: <EditOutlined />,
                  label: 'Editar',
                  onClick: () => showEditModal(record)
                },
                {
                  key: 'new-evaluation',
                  icon: <PlusOutlined />,
                  label: 'Nueva Evaluación',
                  onClick: () => handleNewEvaluation(record)
                },
                {
                  key: 'view',
                  icon: <SearchOutlined />,
                  label: <Link href={`/pacientes/${record.dni}`}>Ver Detalles</Link>
                },
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  danger: true,
                  icon: <DeleteOutlined />,
                  label: (
                    <Popconfirm
                      title="¿Estás seguro de eliminar este paciente?"
                      onConfirm={() => handleDelete(record.dni)}
                      okText="Sí"
                      cancelText="No"
                    >
                      Eliminar
                    </Popconfirm>
                  )
                }
              ]
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const openNotification = (
    type: "success" | "error" | "warning",
    message: string,
    description: string,
    placement: NotificationPlacement
  ) => {
    api[type]({
      message,
      description,
      placement,
    });
  };

  const newPatient = () => {
    setCurrentPatient(null);
    router.push('/family/');
  }

  return (
    <ConfigProvider theme={{ cssVar: true, hashed: false }}>
      <div style={{ padding: '24px' }}>
        {contextHolder}

        <Row justify="center" style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: '8px' }}>
              VALORACIÓN GERIÁTRICA INTEGRAL
            </Title>
            <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
              Sistema de gestión de pacientes
            </Text>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0">
          <Text strong>Acciones</Text>
        </Divider>

        <Row gutter={16} style={{ marginBottom: '24px' }} className='flex justify-start'>
          <Col>
            <Button onClick={newPatient} type="primary" icon={<PlusOutlined />}>
              Nuevo Paciente
            </Button>
          </Col>
          <Col>
            <Button
              icon={<SearchOutlined />}
              onClick={fetchPacientes}
              loading={loading}
            >
              Actualizar lista
            </Button>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0">
          <Text strong>Pacientes Registrados</Text>
        </Divider>

        <Table
          dataSource={pacientes}
          columns={columns}
          rowKey="dni"
          bordered
          loading={loading}
          style={{ marginBottom: '24px' }}
          pagination={{ pageSize: 5 }}
        />

        <Row key="actions" justify="end">
          <Col>
            <Link href="/family" passHref>
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                size="large"
                disabled={!currentPatient}
                style={{
                  minWidth: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                Siguiente
              </Button>
            </Link>
          </Col>
        </Row>

        <Modal
          title={`Editar Paciente: ${editingPatient?.nombre}`}
          open={isModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          okText="Guardar"
          cancelText="Cancelar"
          width={700}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="nombre"
                  label="Apellidos y Nombres"
                  rules={[{ required: true, message: 'Ingrese nombre completo' }]}
                >
                  <Input placeholder="Nombre completo" prefix={<UserOutlined />} size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="dni"
                  label="DNI"
                  rules={[
                    { required: true, message: 'Ingrese DNI' },
                    { pattern: /^\d{8}$/, message: 'DNI debe tener 8 dígitos' }
                  ]}
                >
                  <Input disabled={true} placeholder="DNI" prefix={<IdcardOutlined />} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fecha_nacimiento"
                  label="Fecha de Nacimiento"
                  rules={[{ required: true, message: 'Ingrese fecha de nacimiento' }]}
                >
                  <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="sexo"
                  label="Sexo"
                  rules={[{ required: true, message: 'Seleccione sexo' }]}
                >
                  <Radio.Group size="large" className="w-full">
                    <Radio.Button value="F"><WomanOutlined /> F</Radio.Button>
                    <Radio.Button value="M"><ManOutlined /> M</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="zona_residencia"
                  label="Zona Residencia"
                  rules={[{ required: true, message: 'Seleccione zona' }]}
                >
                  <Select
                    placeholder="Zona"
                    size="large"
                    options={[
                      { value: 'rural', label: 'Rural' },
                      { value: 'urbano', label: 'Urbano' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="domicilio"
              label="Domicilio"
              rules={[{ required: true, message: 'Ingrese domicilio' }]}
            >
              <Input placeholder="Domicilio" prefix={<HomeOutlined />} size="large" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="ocupacion"
                  label="Ocupación"
                  rules={[{ required: true, message: 'Ingrese ocupación' }]}
                >
                  <Input placeholder="Ocupación" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ingreso_economico"
                  label="Ingreso Económico"
                  rules={[{ required: true, message: 'Ingrese ingreso' }]}
                >
                  <InputNumber
                    placeholder="Ingreso"
                    prefix={<DollarOutlined />}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Home;