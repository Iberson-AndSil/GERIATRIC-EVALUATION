"use client";
import { Form, Typography, Button, notification, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { NotificationPlacement } from "antd/es/notification/interface";
import { BasicInfoSection } from "./BasicInfoSection";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { Patient } from "../interfaces";

const { Title } = Typography;

const PatientFormContent = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setCurrentPatient } = useGlobalContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const newDni = urlParams.get("newDni");
      if (newDni) {
        form.setFieldsValue({ dni: newDni });
      }
    }
  }, [form]);

  const savePatientToFirebase = async () => {
    try {
      setLoading(true);
      const formData = await form.validateFields();
      const birthDate = new Date(
        parseInt(formData.birthYear),
        parseInt(formData.birthMonth) - 1,
        parseInt(formData.birthDay)
      );

      const patientData: Patient = {
        id: formData.dni,
        birthDay: formData.birthDay,
        birthMonth: formData.birthMonth,
        birthYear: formData.birthYear,
        evaluationDate: formData.evaluationDate,
        economicActivity: formData.economicActivity,
        email: formData.email,
        ipress: formData.ipress,
        doctorName: formData.doctorName,
        licensedName: formData.licensedName,
        phone: formData.phone,
        name: formData.name,
        dni: formData.dni,
        birthDate: birthDate,
        gender: formData.gender,
        age: formData.age,
        residenceZone: formData.residenceZone,
        address: formData.address,
        department: formData.department,
        province: formData.province,
        district: formData.district,
        educationLevel: formData.educationLevel,
        occupation: formData.occupation,
        pensionSystem: formData.pensionSystem,
        economicIncome: formData.economicIncome,
        livesWith: formData.livesWith,
        relationship: formData.relationship || '',
      };
      
      await axios.post("/api/pacientes", patientData);
      setCurrentPatient(patientData);
      openNotification("success", "Éxito", "Datos del paciente y resultados guardados correctamente", "topRight");
      router.push('/syndromes/first');
    } catch (err: unknown) {
      console.error("Error saving patient:", err);
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
          translate="no"
        >
          INFORMACION SOCIOECONÓMICA
        </Title>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <BasicInfoSection form={form}/>
          </Col>
        </Row>
        <Row className="flex justify-center mt-12 gap-4">
          <Col>
            <Link href="/" passHref>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                size="large"
                style={{ minWidth: '120px' }}
              >
                <span translate="no">Atrás</span>
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
              <span translate="no">Guardar Paciente</span>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const PatientForm = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PatientFormContent />
  </Suspense>
);

export default PatientForm;