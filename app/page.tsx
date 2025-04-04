"use client";
import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { Button, Table, Upload, notification, Card, Space, Row, Col, Typography, Divider, Tag } from 'antd';
import { UploadOutlined, DownloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { NotificationPlacement } from 'antd/es/notification/interface';
import Link from 'next/link';

const { Title, Text } = Typography;

interface Paciente {
  codigo: string;
  nombre: string;
  dni: string;
  edad: number;
  sexo: 'M' | 'F';
  fecha_nacimiento: string;
  zona_residencia: string;
  domicilio: string;
  nivel_educativo: string;
  ocupacion: string;
  sistema_pension: string;
  ingreso_economico: number;
  con_quien_vive: string;
  relacion: string;
}

interface PacienteWithStatus extends Paciente {
  isNew?: boolean;
  requiresCompletion?: boolean;
}

const Home = () => {
  const { excelData, setExcelData, filePath, setFilePath } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'DNI',
      dataIndex: 'dni',
      key: 'dni',
      render: (text: string) => <Text code>{text}</Text>
    },
    {
      title: 'Edad',
      dataIndex: 'edad',
      key: 'edad',
      align: 'center' as const
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
      align: 'center' as const,
      render: (text: string) => (
        <Tag color={text === 'M' ? 'blue' : 'pink'}>
          {text === 'M' ? 'Masculino' : 'Femenino'}
        </Tag>
      )
    },
  ];

  const requiredColumns = [
    'nombre', 'dni', 'fecha_nacimiento', 'edad', 'sexo',
    'zona_residencia', 'domicilio', 'nivel_educativo',
    'ocupacion', 'sistema_pension', 'ingreso_economico',
    'con_quien_vive', 'relacion'
  ];

  const generateTemplate = () => {
    const headers = ['codigo', ...requiredColumns]; // Añade campo código primero
    const ws = XLSX.utils.json_to_sheet([
    ], { header: headers });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
    XLSX.writeFile(wb, 'plantilla_valoracion_geriatrica.xlsx');
  };

  const handleFileUpload = (file: File) => {
    setFilePath(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0] as string[];
      const requiredColumnsWithCode = ['codigo', ...requiredColumns];
      const isValidFile = requiredColumnsWithCode.every((col, index) => headers[index] === col);

      if (!isValidFile) {
        openNotification("error", "Error", "Las columnas no coinciden con la plantilla requerida. Asegúrese de incluir el campo 'codigo'.", "topRight");
        return;
      }

      // Procesamiento de datos
      const formattedData = jsonData.slice(1)
        .map((row: unknown, index) => {
          if (!Array.isArray(row)) return null;

          // Extraer datos
          const codigo = String(row[headers.indexOf('codigo')] || `P${(index + 1).toString().padStart(4, '0')}`).trim();
          const nombre = String(row[headers.indexOf('nombre')] || '').trim();
          const dni = String(row[headers.indexOf('dni')] || '').trim();
          const edad = Number(row[headers.indexOf('edad')]) || 0; // Con valor por defecto 0 si no existe
          const sexo = row[headers.indexOf('sexo')] === 'M' ? 'M' : 'F'; // Default 'F' si no es 'M'
          const fecha_nacimiento = String(row[headers.indexOf('fecha_nacimiento')] || '').trim();
          const zona_residencia = String(row[headers.indexOf('zona_residencia')] || '').trim();
          const domicilio = String(row[headers.indexOf('domicilio')] || '').trim();
          const nivel_educativo = String(row[headers.indexOf('nivel_educativo')] || '').trim();
          const ocupacion = String(row[headers.indexOf('ocupacion')] || '').trim();
          const sistema_pension = String(row[headers.indexOf('sistema_pension')] || '').trim();
          const ingreso_economico = Number(row[headers.indexOf('ingreso_economico')]) || 0; // Default 0
          const con_quien_vive = String(row[headers.indexOf('con_quien_vive')] || '').trim();
          const relacion = String(row[headers.indexOf('relacion')] || '').trim();

          // Validar si es la última fila
          const isLastRow = index === jsonData.length - 2;
          const isEmptyRow = !codigo && !nombre && !dni && isNaN(edad);
          const isIncomplete = isLastRow && !isEmptyRow && (!codigo || !nombre || !dni || isNaN(edad));

          // Omitir filas vacías
          if (isEmptyRow) return null;

          return {
            codigo,
            nombre,
            dni,
            edad,
            sexo,
            fecha_nacimiento,
            zona_residencia,
            domicilio,
            nivel_educativo,
            ocupacion,
            sistema_pension,
            ingreso_economico,
            con_quien_vive,
            relacion,
            ...(isIncomplete ? { requiresCompletion: true } : {})
          } as PacienteWithStatus;
        })
        .filter((item): item is PacienteWithStatus => item !== null);

      // Verificar última fila incompleta
      const lastRow = formattedData[formattedData.length - 1];
      if (lastRow?.requiresCompletion) {
        openNotification("warning", "Atención", "Complete los datos de la última fila antes de continuar.", "topRight");
        setExcelData(formattedData);
      } else {
        setExcelData(formattedData);
        openNotification("success", "Éxito",
          `Datos cargados: ${formattedData.length} pacientes`,
          "topRight");
      }
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const openNotification = (type: "success" | "error" | "warning", message: string, description: string, placement: NotificationPlacement) => {
    api[type]({
      message,
      description,
      placement,
    });
  };

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        hashed: false,
      }}
    >
      <div style={{ padding: '24px' }}>
        {contextHolder}

        <Row justify="center" style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Title
              level={2}
              style={{
                textAlign: 'center',
                color: '#1890ff',
                marginBottom: '8px'
              }}
            >
              VALORACIÓN GERIÁTRICA INTEGRAL
            </Title>
            <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
              Sistema de carga y validación de datos de pacientes
            </Text>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0">
          <Text strong>Instrucciones</Text>
        </Divider>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card bordered={false} style={{ backgroundColor: '#fafafa' }}>
              <Space direction="vertical">
                <Text>
                  <Text strong>1.</Text> Descarga la plantilla si no cuentas con un archivo Excel con el formato requerido.
                </Text>
                <Text>
                  <Text strong>2.</Text> Carga el archivo Excel para validar los datos.
                </Text>
                <Text>
                  <Text strong>3.</Text> Revisa que los datos se muestren correctamente y continúa con el proceso.
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0">
          <Text strong>Acciones</Text>
        </Divider>

        <Row gutter={16} style={{ marginBottom: '24px' }} className='flex justify-start'>
          <Col>
            <Button
              icon={<DownloadOutlined />}
              onClick={generateTemplate}
              // size="large"
              type="dashed"
            >
              Descargar Plantilla
            </Button>
          </Col>
          <Col>
            <Upload beforeUpload={handleFileUpload} showUploadList={false}>
              <Button
                icon={<UploadOutlined />}
                type="primary"
              // size="large"
              >
                Cargar Archivo Excel
              </Button>
            </Upload>
          </Col>
        </Row>

        {excelData.length > 0 && (
          <>
            <Divider orientation="left" orientationMargin="0">
              <Text strong>Pacientes Cargados</Text>
            </Divider>
            <Table
              dataSource={excelData}
              columns={columns}
              rowKey="dni"
              bordered
              style={{ marginBottom: '24px' }}
              pagination={{ pageSize: 5 }}
            />
          </>
        )}

        <Row justify="end">
          <Col>
            <Link
              href={(excelData as PacienteWithStatus[]).some(p => p.requiresCompletion) ? '#' : 'family/personals'}
              passHref
            >
              <Button
                type="primary"
                style={{ minWidth: '120px' }}
                disabled={!filePath}
                icon={<ArrowRightOutlined />}
              >
                Continuar
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Home;