'use client';
import React from 'react';
import { Button, Typography, Divider, Tag } from 'antd';
import {
  NumberOutlined,
  SoundOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  MinusCircleOutlined,
  AlertOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

const DigitBlock = ({ title, numbers, checked, onChange }: any) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex flex-col justify-between h-full">
    <div>
      <Text type="secondary" className="text-xs uppercase font-bold mb-1 block">{title}</Text>
      <div className="text-base font-bold text-gray-800 tracking-widest mb-3">
        {numbers}
      </div>
    </div>
    <Button
      block
      size="small"
      type={checked ? 'primary' : 'default'}
      icon={checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
      onClick={(e) => onChange({ target: { checked: !checked } })}
      className={checked ? 'bg-green-600 border-green-600' : 'text-gray-500'}
    >
      {checked ? 'Correcto' : 'Marcar'}
    </Button>
  </div>
);

const AttentionSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {

  const subtractionTargets = [93, 86, 79, 72, 65];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <NumberOutlined className="text-blue-500" />
            <Text strong className="text-gray-700">Repetición de Dígitos</Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DigitBlock
              size="small"
              title="Orden Directo"
              numbers="2 - 1 - 8 - 5 - 4"
              checked={scores.attention1[0]}
              onChange={onCheckboxChange('attention1', 0)}
            />
            <DigitBlock
              size="small"
              title="Orden Inverso"

              numbers="7 - 4 - 2"
              checked={scores.attention1[1]}
              onChange={onCheckboxChange('attention1', 1)}
            />
          </div>
        </div>

        <Divider dashed className="!mt-0 my-3 border-gray-200" />

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <SoundOutlined className="text-blue-500" />
              <Text strong className="text-gray-700">Detección de "A"</Text>
            </div>
            <Button
              size="small"
              type={scores.attention2[0] ? 'primary' : 'default'}
              onClick={(e) => onCheckboxChange('attention2', 0)({ target: { checked: !scores.attention2[0] } })}
              className={scores.attention2[0] ? 'bg-green-600 border-green-600' : ''}
            >
              {scores.attention2[0] ? 'Prueba Superada' : 'Marcar como Superada'}
            </Button>
          </div>

          <div className="bg-slate-100 p-3 rounded-md border border-slate-200 font-mono text-base tracking-[0.2em] text-center text-slate-700 break-words leading-loose">
            F B <span className="text-blue-600 font-bold">A</span> C M N <span className="text-blue-600 font-bold">A</span> <span className="text-blue-600 font-bold">A</span> I K L B <span className="text-blue-600 font-bold">A</span> F <span className="text-blue-600 font-bold">A</span> K D E <span className="text-blue-600 font-bold">A</span> <span className="text-blue-600 font-bold">A</span> <span className="text-blue-600 font-bold">A</span> J <span className="text-blue-600 font-bold">A</span> M O F <span className="text-blue-600 font-bold">A</span> <span className="text-blue-600 font-bold">A</span> B
          </div>
          <Text type="secondary" className="text-xs mt-1 block text-right">
            * Dar un golpe en cada 'A'. No puntúa si ≥ 2 errores.
          </Text>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MinusCircleOutlined className="text-blue-500" />
            <Text strong className="text-gray-700">Resta de 7 en 7 (desde 100)</Text>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-between bg-white p-2">
            {subtractionTargets.map((num, index) => {
              const isChecked = scores.attention3[index];
              return (
                <Button
                  key={num}
                  shape="round"
                  size="middle"
                  type={isChecked ? 'primary' : 'default'}
                  onClick={(e) => onCheckboxChange('attention3', index)({ target: { checked: !isChecked } })}
                  className={`
                                min-w-[60px] font-bold transition-all
                                ${isChecked ? 'bg-green-600 border-green-600' : 'text-gray-500 border-gray-300'}
                            `}
                >
                  {num}
                </Button>
              );
            })}
          </div>

          <div className="mt-2 bg-yellow-50 p-2 rounded text-xs text-yellow-700 flex items-start gap-2 border border-yellow-100">
            <AlertOutlined />
            <span>
              <strong>Puntaje:</strong> 4-5 aciertos (3 pts) | 2-3 aciertos (2 pts) | 1 acierto (1 pt).
            </span>
          </div>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <Button 
          onClick={() => onSectionChange('memory')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button
          onClick={() => onSectionChange('language')}
          type="primary"
          size="large"
          className="bg-blue-600 shadow-sm"
        >
          Siguiente Sección
        </Button>
      </div>
    </div>
  );
};

export default AttentionSection;