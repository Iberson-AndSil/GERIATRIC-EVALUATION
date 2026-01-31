"use client";
import { Form, Typography, Button, notification, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { NotificationPlacement } from "antd/es/notification/interface";
import { usePatientForm } from "../utils/family/usePatientForm";
import { BasicInfoSection } from "./BasicInfoSection";
// import { GijonScaleSection } from "./GijonScaleSection";
import axios from "axios";
import { actualizarResultado, crearRegistroResultados } from "../lib/pacienteService";
import { useGlobalContext } from "../context/GlobalContext";

const { Title } = Typography;

const PatientForm = () => {
  const [form] = Form.useForm();
  const date = new Date();
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
      console.log("datoos:  ",formData);
      // const score = obtenerPuntajeTotal();
      const fechaNacimiento = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1,
        parseInt(formData.day)
      );

      const patientData = {
        id: formData.dni,
        birth_day:formData.birth_day,
        birth_month:formData.birth_month,
        birth_year:formData.birth_year,
        dateEvaluation:formData.dateEvaluation,
        economic_activity:formData.economic_activity,
        email:formData.email,
        ipress:formData.ipress,
        nameDoctor:formData.nameDoctor,
        nameLicensed:formData.nameLicensed,
        phone:formData.telefono,
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
      openNotification("success", "Éxito", "Datos del paciente y resultados guardados correctamente", "topRight");
      // let resultadoId = currentResultId;

      // if (!resultadoId) {
      //   setCurrentPatient(patientData);
      //   if (!formData.dni || typeof formData.dni !== "string") {
      //     throw new Error("El DNI es requerido y debe ser un string válido.");
      //   }
      //   resultadoId = await crearRegistroResultados(formData.dni, score);
      //   setCurrentResultId(resultadoId);
      //   openNotification("success", "Éxito", "Datos del paciente y resultados guardados correctamente", "topRight");
      //   router.push('/funtional/');
      // }
      // else {
      //   await actualizarResultado(
      //     formData.dni,
      //     resultadoId,
      //     'gijon',
      //     score
      //   );
      //   openNotification("success", "Éxito", "Datos del paciente y resultados guardados correctamente", "topRight");
      //   router.push('/funtional/');
      // }
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
            marginBottom: '10px',
            color: '#1890ff',
            fontWeight: 500
          }}
        >
          INFORMACION SOCIOECONÓMICA 
        </Title>

        <div className="flex">
          <Col xs={24} md={24}>
            <BasicInfoSection
              form={form}
              // date={date}
              // handleDayChange={handleDayChange}
              // handleMonthChange={handleMonthChange}
              // handleYearChange={handleYearChange}
            />
          </Col>
          {/* <Col xs={24} md={8}>
            <GijonScaleSection
              categories={gijonCategories}
              handleChange={handleScoreChange}
              puntajes={puntajes}
              obtenerPuntajeTotal={obtenerPuntajeTotal}
            />
          </Col> */}
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