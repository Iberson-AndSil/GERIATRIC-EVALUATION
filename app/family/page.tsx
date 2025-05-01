"use client";
import { Form, Input, InputNumber, Radio, Row, Col, Typography, Button, Select, notification, Card } from "antd";
import { RiseOutlined, HeartOutlined, HomeOutlined, IdcardOutlined, ManOutlined, TeamOutlined, UserOutlined, WomanOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Paciente } from "@/app/interfaces";
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { NotificationPlacement } from "antd/es/notification/interface";
const { Option } = Select;

const { Title, Text } = Typography;

declare global {
  interface Window {
    showSaveFilePicker: (options?: {
      suggestedName?: string;
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
  }
}

interface FilePickerOptions {
  multiple?: boolean;
  excludeAcceptAllOption?: boolean;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
  startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
  id?: string;
}

declare global {
  interface Window {
    showOpenFilePicker: (options?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
  }
}

const PatientForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { excelData, fileHandle } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();

  const updateBirthDate = () => {
    const day = form.getFieldValue('birth_day');
    const month = form.getFieldValue('birth_month');
    const year = form.getFieldValue('birth_year');

    if (day && month && year) {
      try {
        const formattedDate = `${day.toString().padStart(2, '0')}/${month}/${year}`;
        const birthDate = dayjs(formattedDate, 'DD/MM/YYYY');
        const today = dayjs();
        const calculatedAge = today.diff(birthDate, 'year');
        form.setFieldsValue({
          fecha_nacimiento: formattedDate,
          edad: calculatedAge
        });
      } catch (error) {
        console.error("Fecha inválida", error);
      }
    }
  };
  const handleDayChange = () => updateBirthDate();
  const handleMonthChange = () => updateBirthDate();
  const handleYearChange = () => updateBirthDate();

  const generarCodigoUnico = (dni: string, existingCodes: Set<string>): string => {
    const baseCodigo = `PAC-${dni}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    let codigo = baseCodigo;
    let counter = 1;

    while (existingCodes.has(codigo)) {
      codigo = `${baseCodigo}-${counter.toString().padStart(2, '0')}`;
      counter++;
    }

    return codigo;
  };

  const [puntajes, setPuntajes] = useState({
    familiar: 0,
    economica: 0,
    vivienda: 0,
    sociales: 0,
    apoyo: 0,
  });

  const handleChange = (categoria: keyof typeof puntajes, valor: number) => {
    setPuntajes((prev) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce((acc, curr) => acc + curr, 0);
  };

  const categories = [
    {
      key: "familiar",
      title: "Situación Familiar",
      options: [
        "1 - Vive con familia, sin conflicto familiar",
        "2 - Vive con familia y presenta algún tipo de dependencia física/psíquica",
        "3 - Vive con cónyuge de similar edad",
        "4 - Vive solo y tiene hijos próximos",
        "5 - Vive solo y carece de hijos o viven alejados",
      ],
    },
    {
      key: "economica",
      title: "Situación Económica",
      options: [
        "1 - Dos veces el salario mínimo vital",
        "2 - 1 + 1/2 veces el salario mínimo vital",
        "3 - Un salario mínimo vital",
        "4 - Sin pensión",
        "5 - Sin otros ingresos"
      ],
    },
    {
      key: "vivienda",
      title: "Vivienda",
      options: [
        "1 - Adecuada a necesidades",
        "2 - Barreras arquitectónicas: peldaños, puertas estrechas, daños",
        "3 - Mala higiene, baño incompleto, ausencia de agua caliente, calefacción",
        "4 - Ausencia de ascensor, teléfono",
        "5 - Vivienda inadecuada (esteras, ruinas, no equipos mínimos)"
      ],
    },
    {
      key: "sociales",
      title: "Relaciones Sociales",
      options: [
        "1 - Buenas relaciones sociales",
        "2 - Relación social solo con familia y vecinos",
        "3 - Relación social solo con familia",
        "4 - No sale del domicilio, recibe familia",
        "5 - No sale y no recibe visitas"
      ],
    },
    {
      key: "apoyo",
      title: "Apoyo a la Red Social",
      options: [
        "1 - No necesita apoyo",
        "2 - Con apoyo familiar o vecinal",
        "3 - Voluntariado social, ayuda domiciliaria",
        "4 - Pendiente de ingreso a residencia geriátrica",
        "5 - Necesita cuidados permanentes"
      ],
    },
  ];

  const saveFile = async () => {
    try {
      if (!fileHandle) {
        openNotification("warning", "Selecciona el excel", "Por favor seleccione un archivo primero.", "topRight");
        return;
      }

      const formData = await form.validateFields();
      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const existingWb = XLSX.read(arrayBuffer, { type: "array" });
      const wsName = existingWb.SheetNames[0];
      const ws = existingWb.Sheets[wsName];

      const existingData: Paciente[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: ""
      });

      const existingCodes = new Set(
        existingData.slice(1).map(row => row[0]?.toString().trim())
      );
      const score = obtenerPuntajeTotal();
      const nuevoCodigo = generarCodigoUnico(formData.dni, existingCodes);
      const nuevoPaciente: Paciente = {
        codigo: nuevoCodigo,
        nombre: formData.nombre.trim(),
        dni: formData.dni,
        fecha_nacimiento: formData.fecha_nacimiento,
        edad: formData.edad,
        sexo: formData.sexo,
        zona_residencia: formData.zona_residencia,
        domicilio: formData.domicilio.trim(),
        nivel_educativo: Array.isArray(formData.nivel_educativo)
          ? formData.nivel_educativo.join(', ')
          : formData.nivel_educativo,
        ocupacion: formData.ocupacion.trim(),
        sistema_pension: Array.isArray(formData.sistema_pension)
          ? formData.sistema_pension.join(', ')
          : formData.sistema_pension,
        ingreso_economico: formData.ingreso_economico,
        con_quien_vive: formData.con_quien_vive.trim(),
        relacion: formData.relacion.trim(),
        gijon: score,
        abvdScore: 0,
        aivdScore: 0,
        sarcopenia: 0,
        caida: 0,
        deterioro: 0,
        incontinencia: 0,
        depresion: 0,
        sensorial: 0,
        bristol: 0,
        adherencia: 0,
      };

      const nuevosDatos = [
        Object.values(nuevoPaciente)
      ];

      if (existingData.length === 0) {
        const headers = Object.keys(nuevoPaciente);
        nuevosDatos.unshift(headers);
      }

      const writable = await fileHandle.createWritable();
      const updatedWs = existingData.length === 0
        ? XLSX.utils.aoa_to_sheet(nuevosDatos)
        : XLSX.utils.sheet_add_aoa(ws, nuevosDatos, { origin: -1 });

      const updatedWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(updatedWb, updatedWs, wsName);

      await writable.write(XLSX.write(updatedWb, {
        bookType: "xlsx",
        type: "buffer",
        bookSST: true
      }));

      await writable.close();

      form.resetFields();
      openNotification("success", "Éxito", `Datos del paciente ${formData} guardados.`, "topRight");
      router.push('/funtional/');

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


  useEffect(() => {
    if (excelData.length > 0) {
      console.log("Pacientes cargados:", excelData);
    }
  }, [excelData]);

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
      >
        <Title
          level={3}
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: '#1890ff',
            fontWeight: 500
          }}
        >
          VALORACIÓN SOCIO FAMILIAR
        </Title>

        <div className="flex">

          <Col xs={24} md={16}>
            <Card title="INFORMACIÓN BÁSICA" 
            className="!mb-4 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                  <Form.Item
                    label={<Text strong>Apellidos y Nombres</Text>}
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor ingrese su nombre completo' }]}
                  >
                    <Input
                      placeholder="Ingrese su nombre completo"
                      size="large"
                      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text strong>DNI</Text>}
                    name="dni"
                    rules={[
                      { required: true, message: 'Por favor ingrese su DNI' },
                      { pattern: /^\d{8}$/, message: 'El DNI debe tener 8 dígitos' }
                    ]}
                  >
                    <Input
                      placeholder="Ingrese su DNI"
                      size="large"
                      prefix={<IdcardOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Form.Item name="fecha_nacimiento" hidden>
                  <Input />
                </Form.Item>

                <Col xs={24} sm={8} md={2}>
                  <Form.Item
                    label={<Text strong className="!truncate">Día</Text>}
                    name="birth_day"
                    rules={[
                      { required: true, message: 'Requerido' },
                      { type: 'number', min: 1, max: 31, message: 'Día inválido' }
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={31}
                      style={{ width: "100%" }}
                      size="large"
                      onChange={handleDayChange}
                      placeholder="Día"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8} md={3}>
                  <Form.Item
                    label={<Text strong className="!truncate">Mes</Text>}
                    name="birth_month"
                    rules={[{ required: true, message: 'Requerido' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Mes"
                      onChange={handleMonthChange}
                      options={[
                        { value: '01', label: 'Enero' },
                        { value: '02', label: 'Febrero' },
                        { value: '03', label: 'Marzo' },
                        { value: '04', label: 'Abril' },
                        { value: '05', label: 'Mayo' },
                        { value: '06', label: 'Junio' },
                        { value: '07', label: 'Julio' },
                        { value: '08', label: 'Agosto' },
                        { value: '09', label: 'Setiembre' },
                        { value: '10', label: 'Octubre' },
                        { value: '11', label: 'Noviembre' },
                        { value: '12', label: 'Diciembre' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8} md={3}>
                  <Form.Item
                    label={<Text strong className="!truncate">Año</Text>}
                    name="birth_year"
                    rules={[
                      { required: true, message: 'Requerido' },
                      { type: 'number', min: 1900, max: new Date().getFullYear(), message: 'Año inválido' }
                    ]}
                  >
                    <InputNumber
                      min={1900}
                      max={new Date().getFullYear()}
                      style={{ width: "100%" }}
                      size="large"
                      onChange={handleYearChange}
                      placeholder="Año"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={2}>
                  <Form.Item
                    label={<Text strong className="!truncate">Edad</Text>}
                    name="edad"
                  >
                    <InputNumber className="!truncate"
                      style={{ width: "100%" }}
                      size="large"
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    label={<Text strong className="!truncate">Sexo</Text>}
                    name="sexo"
                    rules={[{ required: true, message: 'Por favor seleccione su sexo' }]}
                  >
                    <Radio.Group size="large">
                      <Radio.Button value="F" className="!truncate">
                        <WomanOutlined /> F
                      </Radio.Button>
                      <Radio.Button value="M" className="!truncate">
                        <ManOutlined /> M
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={<Text strong>Zona Residencia</Text>}
                    name="zona_residencia"
                    rules={[{ required: true, message: 'Por favor seleccione su zona de residencia' }]}
                  >
                    <Select
                      placeholder="Seleccione zona"
                      size="large"
                      options={[
                        { value: 'rural', label: 'Rural' },
                        { value: 'urbano', label: 'Urbano' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="INFORMACIÓN ADICIONAL"
            className="!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    label={<Text strong>Domicilio</Text>}
                    name="domicilio"
                    rules={[{ required: true, message: 'Por favor ingrese su domicilio' }]}
                  >
                    <Input
                      placeholder="Ingrese su domicilio completo"
                      size="large"
                      prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong>Nivel Educativo</Text>}
                    name="nivel_educativo"
                    rules={[{ required: true, message: 'Por favor seleccione su nivel educativo' }]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Seleccione su nivel educativo"
                      style={{ width: '100%' }}
                      options={[
                        { value: 'sin_np', label: 'Sin Nivel/Incial' },
                        { value: 'p', label: 'Primaria' },
                        { value: 's', label: 'Secundaria' },
                        { value: 'tecnica', label: 'Técnica (SNU)' },
                        { value: 'universitaria', label: 'Universitaria' }
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item
                    label={<Text strong>Sistema de Pensión</Text>}
                    name="sistema_pension"
                    rules={[{ required: true, message: 'Por favor seleccione su sistema de pensión' }]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Seleccione sistema de pensión"
                      style={{ width: '100%' }}
                      options={[
                        { value: 'onp', label: 'ONP' },
                        { value: 'afp', label: 'AFP' },
                        { value: 'cedula_viva', label: 'Cédula Viva (20530)' },
                        { value: 'reja', label: 'REJA (30425)' },
                        { value: 'dependiente', label: 'Dependiente' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>Ocupación Actual</Text>}
                    name="ocupacion"
                    rules={[{ required: true, message: 'Por favor ingrese su ocupación' }]}
                  >
                    <Input
                      placeholder="Ingrese su ocupación actual"
                      size="large"
                      prefix={<RiseOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>Ingreso Económico (S/.)</Text>}
                    name="ingreso_economico"
                    rules={[{ required: true, message: 'Por favor ingrese su ingreso económico' }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12}>
                  <Form.Item
                    label={<Text strong>Con quién vive</Text>}
                    name="con_quien_vive"
                    rules={[{ required: true, message: 'Por favor ingrese con quién vive' }]}
                  >
                    <Input
                      placeholder="Ej: Familia, solo, etc."
                      size="large"
                      prefix={<TeamOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12}>
                  <Form.Item
                    label={<Text strong>Relación</Text>}
                    name="relacion"
                    rules={[{ required: true, message: 'Por favor ingrese la relación' }]}
                  >
                    <Input
                      placeholder="Ej: Hijos, cónyuge, etc."
                      size="large"
                      prefix={<HeartOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="ESCALA DE GIJON" 
            className="!ml-4 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300 h-full">
              <div className="grid gap-4">
                {categories.map((category: any) => (
                  <div key={category.key} className="mb-2">
                    <Text strong className="block mb-1">
                      {category.title}
                    </Text>
                    <Select
                      style={{ width: '100%' }}
                      placeholder={`Seleccione ${category.title.toLowerCase()}`}
                      onChange={(value) => handleChange(category.key as keyof typeof puntajes, parseInt(value))}
                      value={puntajes[category.key as keyof typeof puntajes] ? puntajes[category.key as keyof typeof puntajes].toString() : undefined}
                    >
                      {category.options.map((option: any, index: any) => (
                        <Option key={`${category.key}-${index}`} value={(index + 1).toString()}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong className="text-lg">Puntaje Total:</Text>
                    </Col>
                    <Col>
                      <Text className="text-xl font-bold">{obtenerPuntajeTotal()}</Text>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>
        </div>

        <Row className="flex justify-center mt-12 gap-4">
          <Col>
            <Link href="/" passHref>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                size="large"
                style={{ minWidth: '120px' }}
              >
                Atrás
              </Button>
            </Link>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              onClick={saveFile}
              style={{ minWidth: '120px' }}
              disabled={!fileHandle}
            >
              {fileHandle ? (
                <>
                  Guardar Paciente
                  <SaveOutlined style={{ marginLeft: 8 }} />
                </>
              ) : (
                "Seleccione archivo primero"
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default PatientForm;
