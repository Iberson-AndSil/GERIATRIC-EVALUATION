"use client";
import { Form, Space, Input, DatePicker, InputNumber, Radio, Checkbox, Row, Col, Typography, Button, message, Upload, NotificationArgsProps, notification } from "antd";
import { useEffect, useState } from "react";
import { utils, writeFileXLSX } from 'xlsx';
import * as XLSX from "xlsx";
import {
  UploadOutlined
} from "@ant-design/icons";
import React from "react";
import { useGlobalContext } from "@/app/context/GlobalContext";

const { Title } = Typography;
type NotificationPlacement = NotificationArgsProps['placement'];
const Context = React.createContext({ name: 'Default' });

const form = () => {

  const [active, setActive] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const { setFilePath } = useGlobalContext();

  const handleExportExcel = async () => {
    try {
      const values = await form.validateFields();

      values.nivel_educativo = values.nivel_educativo?.join(', ') || '';
      values.sistema_pension = values.sistema_pension?.join(', ') || '';
      values.fecha_nacimiento = values.fecha_nacimiento?.format('DD/MM/YYYY') || '';
      values.zona_residencia = values.zona_residencia?.join(', ') || '';

      const existingData = JSON.parse(localStorage.getItem('clientes') || '[]');

      const newData = [...existingData, values];
      console.log(newData);

      localStorage.setItem('clientes', JSON.stringify(newData));

      const worksheet = utils.json_to_sheet(newData, {
        header: [
          'nombre',
          'dni',
          'fecha_nacimiento',
          'edad',
          'sexo',
          'zona_residencia',
          'domicilio',
          'nivel_educativo',
          'ocupacion',
          'sistema_pension',
          'ingreso_economico',
          'con_quien_vive',
          'relacion'
        ]
      });

      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Clientes');

      writeFileXLSX(workbook, 'clientes.xlsx', {
        compression: true,
        bookType: 'xlsx',
        type: 'buffer'
      });

      setActive(true);
      form.resetFields();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const requiredColumns = [
    'nombre',
    'dni',
    'fecha_nacimiento',
    'edad',
    'sexo',
    'zona_residencia',
    'domicilio',
    'nivel_educativo',
    'ocupacion',
    'sistema_pension',
    'ingreso_economico',
    'con_quien_vive',
    'relacion'
  ];

  useEffect(() => {
    console.log("📂 Archivo seleccionado:", setFilePath);
  }, [setFilePath]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[];
      const isValidFile = requiredColumns.every((col) => headers.includes(col));
      if (isValidFile) {
        setFilePath(file.name);
        openNotification("success", "Operación exitosa", "El archivo se ha validado correctamente.", "topRight");
      } else {
        openNotification("error", "Error en la validación", "Las columnas del archivo no coinciden.", "topRight");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const openNotification = (type: "success" | "error", message: string, description: string, placement: NotificationPlacement) => {
    api[type]({
      message,
      description,
      placement,
    });
  };

  return (
    <>

      <Form form={form} layout="vertical">
        <Title level={3} className="text-center font-bold mb-6">
          DATOS PERSONALES
        </Title>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="Apellidos y Nombres" name="nombre">
              <Input placeholder="Ingrese su nombre completo" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="DNI" name="dni">
              <Input placeholder="Ingrese su DNI" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Fecha de Nacimiento" name="fecha_nacimiento">
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Edad" name="edad">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Sexo" name="sexo">
              <Radio.Group>
                <Radio value="F">F</Radio>
                <Radio value="M">M</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Zona Residencia" name="zona_residencia">
              <Checkbox.Group>
                <Checkbox value="rural">Rural</Checkbox>
                <Checkbox value="urbano">Urbano</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Domicilio" name="domicilio">
              <Input placeholder="Ingrese su domicilio" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Nivel Educativo" name="nivel_educativo">
              <Checkbox.Group style={{ width: '100%' }}>
                <Row className="w-full flex justify-between px-4 py-2">
                  <Col className="flex-1 text-start">
                    <Checkbox value="sin_np" className="whitespace-nowrap">Sin N/P</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start">
                    <Checkbox value="p" className="whitespace-nowrap">P</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start">
                    <Checkbox value="s" className="whitespace-nowrap">S</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start">
                    <Checkbox value="tecnica" className="whitespace-nowrap">Técnica</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start">
                    <Checkbox value="universitaria" className="whitespace-nowrap">Universitaria</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Ocupación Actual" name="ocupacion">
              <Input placeholder="Ingrese su ocupación" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Sistema de Pensión" name="sistema_pension">
              <Checkbox.Group style={{ width: '100%' }}>
                <Row className="w-full flex justify-between px-4 py-2">
                  <Col className="flex-1 text-start justify-start">
                    <Checkbox value="onp" className="whitespace-nowrap">ONP</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start justify-start">
                    <Checkbox value="afp" className="whitespace-nowrap">AFP</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start justify-start">
                    <Checkbox value="cedula_viva" className="whitespace-nowrap">Cédula Viva</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start justify-start">
                    <Checkbox value="reja" className="whitespace-nowrap">REJA</Checkbox>
                  </Col>
                  <Col className="flex-1 text-start justify-start">
                    <Checkbox value="dependiente" className="whitespace-nowrap">Dependiente</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Ingreso Económico" name="ingreso_economico">
              <Input placeholder="Ingrese su ingreso económico" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Con quién vive" name="con_quien_vive">
              <Input placeholder="Ingrese con quién vive" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Relación" name="relacion">
              <Input placeholder="Ingrese la relación" />
            </Form.Item>
          </Col>
        </Row>
        <Row className="flex justify-between items-center">
          <Col>
            <Upload beforeUpload={handleFileUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />} type="primary">
                Seleccionar Archivo Excel
              </Button>
            </Upload>
          </Col>
          <Col>
            {!active ?
              <Button
                color="cyan" variant="solid"
                onClick={handleExportExcel}
              >
                Guardar en Excel
              </Button>
              :
              <Button
                type="primary"
                onClick={() => setActive(false)}
              >
                Siguiente
              </Button>
            }
          </Col>
        </Row>
      </Form>
      <Space>
        {contextHolder}
      </Space>
    </>
  );
};

export default form;
