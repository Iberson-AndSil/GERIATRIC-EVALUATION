"use client";
import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { Button, Table, notification, Card, Space, Row, Col, Typography, Divider, Tag } from 'antd';
import { UploadOutlined, DownloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { NotificationPlacement } from 'antd/es/notification/interface';
import Link from 'next/link';

const { Title, Text } = Typography;

interface PacienteWithStatus extends Paciente {
  isNew?: boolean;
  requiresCompletion: boolean;
}

const Home = () => {
  const { excelData, setExcelData, filePath, setFilePath, setFileHandle } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    console.log(excelData);
  }, [excelData]);

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
    'codigo', 'nombre', 'dni', 'fecha_nacimiento', 'edad', 'sexo',
    'zona_residencia', 'domicilio', 'nivel_educativo',
    'ocupacion', 'sistema_pension', 'ingreso_economico',
    'con_quien_vive', 'relacion', 'gijon'
  ];

  const generateTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{}], { header: requiredColumns });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
    XLSX.writeFile(wb, 'plantilla_valoracion_geriatrica.xlsx');
  };

  const handleFileUpload = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: "Excel Files",
          accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }
        }],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        openNotification("error", "Error", "El archivo está vacío.", "topRight");
        return;
      }

      const headers = (jsonData[0] as string[]).map(h => String(h).trim());
      const normalizedHeaders = headers.map(h => h.toLowerCase());

      const missingColumns = requiredColumns.filter(
        col => !normalizedHeaders.includes(col.toLowerCase())
      );

      if (missingColumns.length > 0) {
        openNotification(
          "error",
          "Error",
          `Faltan columnas requeridas: ${missingColumns.join(", ")}`,
          "topRight"
        );
        return;
      }

      const columnIndexMap: Record<string, number> = {};
      headers.forEach((header, index) => {
        columnIndexMap[header.toLowerCase()] = index;
      });

      const formattedData = jsonData.slice(1)
        .map((row: unknown, index) => {
          if (!Array.isArray(row)) return null;

          const getValue = (col: string) =>
            row[columnIndexMap[col.toLowerCase()]] !== undefined
              ? row[columnIndexMap[col.toLowerCase()]]
              : null;

          const codigo = String(getValue('codigo') || `P${(index + 1).toString().padStart(4, '0')}`).trim();
          const nombre = String(getValue('nombre') || '').trim();
          const dni = String(getValue('dni') || '').trim();
          const edad = Number(getValue('edad')) || 0;
          const sexo = getValue('sexo') === 'M' ? 'M' : 'F';
          const fecha_nacimiento = String(getValue('fecha_nacimiento') || '').trim();
          const zona_residencia = String(getValue('zona_residencia') || '').trim();
          const domicilio = String(getValue('domicilio') || '').trim();
          const nivel_educativo = String(getValue('nivel_educativo') || '').trim();
          const ocupacion = String(getValue('ocupacion') || '').trim();
          const sistema_pension = String(getValue('sistema_pension') || '').trim();
          const ingreso_economico = Number(getValue('ingreso_economico')) || 0;
          const con_quien_vive = String(getValue('con_quien_vive') || '').trim();
          const relacion = String(getValue('relacion') || '').trim();
          const gijon = Number(getValue('valor_gijon')) || 0;

          const isEmptyRow = !codigo && !nombre && !dni && isNaN(edad);
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
            requiresCompletion: !codigo || !nombre || !dni || isNaN(edad)
          };
        })
        .filter((item): item is PacienteWithStatus => item !== null);

      setExcelData(formattedData);
      setFilePath(file.name);
      setFileHandle(fileHandle);
      openNotification("success", "Éxito", `Datos cargados: ${formattedData.length} pacientes`, "topRight");
    } catch (err) {
      console.error("Error al cargar el archivo:", err);
      openNotification("error", "Error", "Hubo un problema al cargar el archivo.", "topRight");
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
              Sistema de carga y validación de datos de pacientes
            </Text>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0">
          <Text strong>Instrucciones</Text>
        </Divider>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card style={{ backgroundColor: '#fafafa' }}>
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
            <Button icon={<DownloadOutlined />} onClick={generateTemplate} type="dashed">
              Descargar Plantilla
            </Button>
          </Col>
          <Col>
            <Button icon={<UploadOutlined />} type="primary" onClick={handleFileUpload}>
              Cargar Archivo Excel
            </Button>
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
              href={(excelData as PacienteWithStatus[]).some(p => p.requiresCompletion) ? 'family/personals' : 'family/personals'}
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