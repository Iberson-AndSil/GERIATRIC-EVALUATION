'use client';
import React from 'react';
import { Card, Tag, Typography, Progress, Statistic } from 'antd';
import { ThunderboltOutlined, DashboardOutlined, HeartOutlined, SmileOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface RealTimeResultsProps {
    currentValues: any;
    currentQuestion: number;
    totalQuestions: number;
    results: any | null;
    submitted: boolean;
    progressPercent: number;
}

const RealTimeResults = ({ 
    currentValues, 
    currentQuestion, 
    totalQuestions, 
    results, 
    submitted,
    progressPercent 
}: RealTimeResultsProps) => {

    return (
        <Card
            title={
                <span className="text-purple-600 font-bold text-base">
                    <ThunderboltOutlined className="mr-2" /> 
                    Monitor en Tiempo Real
                </span>
            }
            className="shadow-sm rounded-xl border-t-4 border-t-purple-500 h-full flex flex-col"
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}
            size="small"
        >
            <div className="flex-1 flex flex-col space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
                    <Text type="secondary" className="text-xs uppercase font-bold block mb-2 text-purple-800">
                        Estado de la Evaluación
                    </Text>
                    {submitted ? (
                        <Tag color="success" className="text-sm px-3 py-1">COMPLETADO</Tag>
                    ) : (
                        <Tag color="processing" className="text-sm px-3 py-1 animate-pulse">EN PROGRESO</Tag>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    <Progress 
                        type="dashboard" 
                        percent={submitted ? 100 : progressPercent} 
                        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                        width={70}
                    />
                    <Text type="secondary" className="mt-2 text-xs">Progreso General</Text>
                </div>

                <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HeartOutlined className="text-red-500" />
                            <span className="text-sm font-medium text-gray-600">Salud Física</span>
                        </div>
                        {submitted && results ? (
                             <span className="font-bold text-gray-800">{results.dimensions.PHYSICAL.rawScore} pts</span>
                        ) : (
                             <span className="text-xs text-gray-400">Calculando...</span>
                        )}
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SmileOutlined className="text-orange-500" />
                            <span className="text-sm font-medium text-gray-600">Salud Mental</span>
                        </div>
                        {submitted && results ? (
                             <span className="font-bold text-gray-800">{results.dimensions.MENTAL.rawScore} pts</span>
                        ) : (
                             <span className="text-xs text-gray-400">Calculando...</span>
                        )}
                    </div>
                </div>

                {/* Resultado Total Promedio (Visible solo al final o placeholder) */}
                <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                    <Text type="secondary" className="text-xs uppercase font-bold">Puntaje Total</Text>
                    <div className="text-4xl font-bold text-purple-700 mt-1">
                        {submitted && results ? results.totalScore : "--"}
                    </div>
                    <Text type="secondary" className="text-xs">
                        {submitted ? "Puntos Totales" : "Pendiente"}
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default RealTimeResults;