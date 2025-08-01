import React from 'react';
import { Card, Typography, Divider, Space, Progress, Row, Col, Button } from 'antd';
import { MOCATestProps, SectionKey } from '../type';
import { useGlobalContext } from '../context/GlobalContext';
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ResultsSectionProps extends MOCATestProps {
  totalScore: number;
  isNormal: boolean;
  calculateSectionProgress: (section: SectionKey, scores: any) => number;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  scores,
  educationLevel,
  totalScore,
  isNormal,
  calculateSectionProgress,
}) => {

  const { fileHandle } = useGlobalContext();
  const router = useRouter();

  const handleSaveData = async () => {
    try {
      if (!fileHandle) {
        alert("Por favor seleccione un archivo primero");
        return;
      }

      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const existingWb = XLSX.read(arrayBuffer, { type: "array" });
      const wsName = existingWb.SheetNames[0];
      const ws = existingWb.Sheets[wsName];

      const existingData: number[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: ""
      });
      const lastRowIndex = existingData.length - 1;

      if (lastRowIndex >= 0) {
        while (existingData[lastRowIndex].length < 31) {
          existingData[lastRowIndex].push(0);
        }

        existingData[lastRowIndex][32] = totalScore;
      }

      const updatedWs = XLSX.utils.aoa_to_sheet(existingData);
      const updatedWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(updatedWb, updatedWs, wsName);

      const writable = await fileHandle.createWritable();
      await writable.write(XLSX.write(updatedWb, {
        bookType: "xlsx",
        type: "buffer",
        bookSST: true
      }));
      await writable.close();

      alert("Resultados guardados exitosamente");
      router.push('/affective');

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

  return (
    <>
      <Card title="Resultado">
        <Title level={3}>
          Puntuación total: {totalScore}/30
          {totalScore > 0 && (
            <span style={{
              color: isNormal ? '#389e0d' : '#cf1322',
              marginLeft: '20px',
              fontSize: '24px'
            }}>
              {isNormal ? 'Normal (≥26 puntos)' : 'Anormal (<26 puntos)'}
            </span>
          )}
        </Title>
        {educationLevel === 'none' && (
          <Text type="secondary">
            * Se ha añadido 1 punto adicional por nivel de estudios: Ninguno de estos
          </Text>
        )}

        <Divider />

        <Title level={4}>Desglose por sección:</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>Visuoespacial/Ejecutiva</Text>
            <Progress percent={calculateSectionProgress('visuospatial', scores)} status="active" />
          </div>
          <div>
            <Text>Identificación</Text>
            <Progress percent={calculateSectionProgress('naming', scores)} status="active" />
          </div>
          <div>
            <Text>Atención</Text>
            <Progress percent={calculateSectionProgress('attention', scores)} status="active" />
          </div>
          <div>
            <Text>Lenguaje</Text>
            <Progress percent={calculateSectionProgress('language', scores)} status="active" />
          </div>
          <div>
            <Text>Abstracción</Text>
            <Progress percent={calculateSectionProgress('abstraction', scores)} status="active" />
          </div>
          <div>
            <Text>Recuerdo diferido</Text>
            <Progress percent={calculateSectionProgress('delayedRecall', scores)} status="active" />
          </div>
          <div>
            <Text>Orientación</Text>
            <Progress percent={calculateSectionProgress('orientation', scores)} status="active" />
          </div>
        </Space>
      </Card>

      <Row key="actions" className="m-12 flex justify-center">
        <Col>
          <Link href="/mmse30" passHref>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              style={{ minWidth: '120px' }}
            >
              Volver a MMSE30
            </Button>
          </Link>
        </Col>
        <Col>
          <Button className="!ml-3"
            type="primary"
            size="large"
            onClick={handleSaveData}
            style={{ minWidth: '120px' }}
            disabled={!fileHandle}
            icon={<SaveOutlined />}
          >
            {fileHandle ? "Guardar Paciente" : "Seleccione archivo primero"}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ResultsSection;