"use client";
import { Form, Input, DatePicker, InputNumber, Radio, Checkbox, Row, Col } from "antd";

const form = () => {
  return (
    <Form layout="vertical">
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
    </Form>
  );
};

export default form;
