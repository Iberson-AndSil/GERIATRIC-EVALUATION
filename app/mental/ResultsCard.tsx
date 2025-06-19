import { Button, Card, Divider, Row, Col, Statistic, Typography, Progress } from 'antd';
import { CheckOutlined, SmileOutlined } from '@ant-design/icons';
import { DimensionKey, SurveyResults } from '../type';

const { Title, Text } = Typography;

interface ResultsCardProps {
    results: SurveyResults;
    onReset: () => void;
    onSave: () => void;
}

const ResultsCard = ({ results, onReset, onSave }: ResultsCardProps) => {
    const totalMaxPossible = (Object.keys(results.dimensions) as DimensionKey[]).reduce(
        (sum, dimKey) => sum + results.dimensions[dimKey].maxPossible, 0
    );
    return (
        <div>
            <Title
                level={3}
                style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#1890ff',
                    fontWeight: 500
                }}
            >
                VALORACIÓN MENTAL
            </Title>
            <Card>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <CheckOutlined style={{ fontSize: 48, color: "#52c41a" }} />
                    <Title level={3}>¡Evaluación completada!</Title>
                    <Text type="secondary">A continuación se muestran sus resultados</Text>
                </div>

                <Divider orientation="left">RESULTADOS</Divider>

                <Row gutter={16} style={{ marginBottom: 24 }}>
                    {(Object.keys(results.dimensions) as DimensionKey[]).map((dimKey) => {
                        const dimension = results.dimensions[dimKey];

                        return (
                            <Col span={12} key={dimKey} style={{ marginBottom: 16 }}>
                                <Card>
                                    <Statistic
                                        title={dimension.name}
                                        value={dimension.rawScore}
                                        suffix={`/ ${dimension.maxPossible}`}
                                        prefix={dimension.icon}
                                    />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {dimension.description}
                                    </Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Progress
                                            percent={Math.round((dimension.rawScore / dimension.maxPossible) * 100)}
                                            status="active"
                                            showInfo={false}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                    <Statistic
                        title="PUNTAJE TOTAL"
                        value={results.totalScore}
                        suffix={`/ ${totalMaxPossible}`}
                        // prefix={<FrownOutlined />}
                        prefix={<SmileOutlined />}
                        style={{ marginBottom: 8 }}
                    />
                    <Progress
                        percent={Math.round((results.totalScore / totalMaxPossible) * 100)}
                        status="active"
                        style={{ maxWidth: 400, margin: '0 auto' }}
                    />
                    <Text type="secondary">Puntaje máximo posible: {totalMaxPossible}</Text>
                </div>

                <Divider />

                <div className='w-full flex justify-end items-center'>
                    <Button onClick={onReset}>
                        Realizar nueva evaluación
                    </Button>
                    <Button type="primary" className='!ml-2' onClick={onSave}>
                        Guardar Datos
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ResultsCard;