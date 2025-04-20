"use client";
import { Form, Input, DatePicker, InputNumber, Radio, Row, Col, Typography, Button, Divider, Select } from "antd";
import { RiseOutlined, HeartOutlined, HomeOutlined, IdcardOutlined, ManOutlined, TeamOutlined, UserOutlined, WomanOutlined, ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import Link from "next/link";
import * as XLSX from "xlsx";
import { Paciente } from "@/app/interfaces";

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

  const { excelData, fileHandle } = useGlobalContext();

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

  const saveFile = async () => {
    try {
      if (!fileHandle) {
        alert("Por favor seleccione un archivo primero");
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

      const nuevoCodigo = generarCodigoUnico(formData.dni, existingCodes);
      const nuevoPaciente: Paciente = {
        codigo: nuevoCodigo,
        nombre: formData.nombre.trim(),
        dni: formData.dni,
        edad: formData.edad,
        sexo: formData.sexo,
        fecha_nacimiento: formData.fecha_nacimiento.format("DD/MM/YYYY"),
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
        gijon:0,
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
      alert("Paciente guardado exitosamente con código: " + nuevoCodigo);

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


  useEffect(() => {
    if (excelData.length > 0) {
      console.log("Pacientes cargados:", excelData);
    }
  }, [excelData]);

  return (
    <>
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
          DATOS PERSONALES
        </Title>

        <Divider orientation="left" orientationMargin={0} style={{ color: '#1890ff' }}>
          Información Básica
        </Divider>

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
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label={<Text strong>Fecha de Nacimiento</Text>}
              name="fecha_nacimiento"
              rules={[{ required: true, message: 'Por favor seleccione su fecha de nacimiento' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Form.Item
              label={<Text strong>Edad</Text>}
              name="edad"
              rules={[{ required: true, message: 'Por favor ingrese su edad' }]}
            >
              <InputNumber
                min={0}
                max={120}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label={<Text strong>Sexo</Text>}
              name="sexo"
              rules={[{ required: true, message: 'Por favor seleccione su sexo' }]}
            >
              <Radio.Group size="large">
                <Radio.Button value="F">
                  <WomanOutlined /> Femenino
                </Radio.Button>
                <Radio.Button value="M">
                  <ManOutlined /> Masculino
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

        <Divider orientation="left" orientationMargin={0} style={{ color: '#1890ff' }}>
          Información Adicional
        </Divider>

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

        <Row className="flex justify-end gap-4">
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
