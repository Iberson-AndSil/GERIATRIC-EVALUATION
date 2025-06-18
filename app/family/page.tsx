"use client";
import { Form, Typography, Button, notification, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import React from "react";
import { useGlobalContext } from "@/app/context/GlobalContext";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { NotificationPlacement } from "antd/es/notification/interface";
import { usePatientForm } from "../utils/family/usePatientForm";
import { BasicInfoSection } from "./BasicInfoSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { GijonScaleSection } from "./GijonScaleSection";
import { savePatientToExcel, formatPatientData } from "../utils/family/family";

const { Title } = Typography;

const PatientForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { fileHandle } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();
  
  const {
    puntajes,
    handleScoreChange,
    obtenerPuntajeTotal,
    updateBirthDate,
    gijonCategories,
  } = usePatientForm();

  const handleDayChange = () => updateBirthDate(form);
  const handleMonthChange = () => updateBirthDate(form);
  const handleYearChange = () => updateBirthDate(form);

  const saveFile = async () => {
    try {
      if (!fileHandle) {
        openNotification("warning", "Selecciona el excel", "Por favor seleccione un archivo primero.", "topRight");
        return;
      }

      const formData = await form.validateFields();
      const score = obtenerPuntajeTotal();
      const patientData = formatPatientData(formData, score, new Set());
      
      await savePatientToExcel(fileHandle, patientData, form);
      
      openNotification("success", "Éxito", `Datos del paciente guardados.`, "topRight");
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

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical">
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
            <BasicInfoSection 
              form={form}
              handleDayChange={handleDayChange}
              handleMonthChange={handleMonthChange}
              handleYearChange={handleYearChange}
            />
            <AdditionalInfoSection />
          </Col>
          <Col xs={24} md={8}>
            <GijonScaleSection
              categories={gijonCategories}
              handleChange={handleScoreChange}
              puntajes={puntajes}
              obtenerPuntajeTotal={obtenerPuntajeTotal}
            />
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