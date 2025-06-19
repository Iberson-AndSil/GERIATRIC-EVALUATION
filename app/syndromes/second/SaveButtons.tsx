import { Button } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

interface SaveButtonsProps {
  loading: boolean;
  allResultsReady: any;
  onSave: () => void;
}

export const SaveButtons = ({ 
  loading, 
  allResultsReady, 
  onSave 
}: SaveButtonsProps) => (
  <div className="flex justify-center gap-4 mt-8">
    <Link href="/">
      <Button type="default" icon={<ArrowLeftOutlined />} size="large">
        Volver
      </Button>
    </Link>

    <Button
      type="primary"
      icon={<SaveOutlined />}
      size="large"
      onClick={onSave}
      loading={loading}
      disabled={!allResultsReady}
    >
      Guardar Todos los Resultados
    </Button>
  </div>
);