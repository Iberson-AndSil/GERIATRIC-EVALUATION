'use client';
import React from 'react';
import { Result, Button, Row, Col, Statistic, Divider, Typography } from 'antd';
import { SmileOutlined, RedoOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ResultsSummary = ({ results, onReset }: { results: any, onReset: () => void }) => {
    return (
        <div className="animate-fadeIn h-full flex flex-col">
            <Result
                status="success"
                title="Evaluación SF-12 Completada"
                subTitle="Los datos han sido procesados. Puede ver el detalle a la derecha."
                className="py-4"
                extra={[
                    <Button type="dashed" key="reset" onClick={onReset} icon={<RedoOutlined />}>
                        Nueva Evaluación
                    </Button>
                ]}
            />
            
            <Divider dashed plain>Resumen de Dimensiones</Divider>

            <Row gutter={[16, 16]} justify="center">
                {Object.keys(results.dimensions).map((key) => {
                    const dim = results.dimensions[key];
                    return (
                        <Col span={10} key={key}>
                            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                                <div className="text-2xl mb-1">{dim.icon}</div>
                                <Text strong className="block text-gray-600">{dim.name}</Text>
                                <div className="text-xl font-bold text-blue-600 mt-2">
                                    {dim.rawScore} <span className="text-xs text-gray-400 font-normal">/ {dim.maxPossible}</span>
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default ResultsSummary;