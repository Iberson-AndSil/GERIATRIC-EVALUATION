"use client";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
export default function MedicalSpinner() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center">
            <Spin className="text-blue-600" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            <p className="mt-6 text-base text-blue-600 font-medium animate-pulse">
                Cargando...
            </p>
        </div>
    );
}