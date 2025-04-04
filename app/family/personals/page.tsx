"use client";
import { Form, Input, DatePicker, InputNumber, Radio, Row, Col, Typography, Button, Divider, Select } from "antd";
import { DollarOutlined, RiseOutlined, HeartOutlined, HomeOutlined, IdcardOutlined, ManOutlined, TeamOutlined, UserOutlined, WomanOutlined, ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import Link from "next/link";

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
  
  const { excelData } = useGlobalContext(); // Asumiendo que excelData es el contenido del archivo Excel

  const saveFile = async () => {
    try {
      // Mostrar cuadro de diálogo para guardar el archivo
      const handle = await window.showSaveFilePicker({
        suggestedName: "data.xlsx", // Sugerir un nombre para el archivo
        types: [
          {
            description: "Excel Files",
            accept: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            },
          },
        ],
      });

      // Crear un archivo escribible
      const writable = await handle.createWritable();

      // Escribir el contenido de excelData en el archivo
      // await writable.write(excelData);
      
      // Cerrar el archivo
      await writable.close();

      alert("El archivo ha sido guardado exitosamente.");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };
  

  return (
    <>
      <Form
        // form={form}
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
                formatter={value => `S/. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value!.replace(/S\/\.\s?|(,*)/g, '')}
                prefix={<DollarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
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
            <Link href="family/personals" passHref>
              <Button
                type="primary"
                size="large"
                onClick={saveFile}
                style={{
                  minWidth: '120px',
                  display: 'flex',
                  // alignItems: 'center',
                  // justifyContent: 'space-between'
                }}
              >
                Continuar
                <ArrowRightOutlined style={{ marginLeft: 8 }} />
              </Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default PatientForm;
