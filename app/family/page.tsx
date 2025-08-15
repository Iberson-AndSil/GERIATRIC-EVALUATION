"use client";
import { Form, Typography, Button, notification, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { NotificationPlacement } from "antd/es/notification/interface";
import { usePatientForm } from "../utils/family/usePatientForm";
import { BasicInfoSection } from "./BasicInfoSection";
import { GijonScaleSection } from "./GijonScaleSection";
import axios from "axios";
import { actualizarResultado, crearRegistroResultados } from "../lib/pacienteService";
import { useGlobalContext } from "../context/GlobalContext";

const { Title } = Typography;

const PatientForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { setCurrentResultId, currentResultId, setCurrentPatient } = useGlobalContext();

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

  const savePatientToFirebase = async () => {
    try {
      setLoading(true);
      const formData = await form.validateFields();
      const score = obtenerPuntajeTotal();
      
      const fechaNacimiento = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1,
        parseInt(formData.day)
      );

      const patientData = {
        id: formData.dni,
        nombre: formData.nombre,
        dni: formData.dni,
        fecha_nacimiento: fechaNacimiento,
        sexo: formData.sexo,
        edad: formData.edad,
        zona_residencia: formData.zona_residencia,
        domicilio: formData.domicilio,
        nivel_educativo: formData.nivel_educativo,
        ocupacion: formData.ocupacion,
        sistema_pension: formData.sistema_pension,
        ingreso_economico: formData.ingreso_economico,
        con_quien_vive: formData.con_quien_vive,
        relacion: formData.relacion,
      };

      await axios.post("/api/pacientes", patientData);

      let resultadoId = currentResultId;
      
      if (!resultadoId) {
        setCurrentPatient(patientData);
        resultadoId = await crearRegistroResultados(formData.dni);
        setCurrentResultId(resultadoId);
      }
      else{
        await actualizarResultado(
          formData.dni,
          resultadoId,
          'gijon',
          score
        );
      }

      openNotification("success", "Éxito", "Datos del paciente y resultados guardados correctamente", "topRight");
      router.push('/funtional/');

    } catch (err: unknown) {
      console.error("Error al guardar:", err);
      openNotification(
        "error",
        "Error",
        "No se pudo guardar la información. Por favor intente nuevamente.",
        "topRight"
      );
    } finally {
      setLoading(false);
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
              onClick={savePatientToFirebase}
              style={{ minWidth: '120px' }}
              loading={loading}
              icon={<SaveOutlined />}
            >
              Guardar Paciente
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default PatientForm;