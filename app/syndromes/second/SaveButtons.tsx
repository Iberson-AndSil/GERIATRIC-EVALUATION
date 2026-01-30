import { Button } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

interface SaveButtonsProps {
  loading: boolean;
  allResultsReady: boolean;
  onSave: () => void;
}

export const SaveButtons = ({ loading, allResultsReady, onSave }: SaveButtonsProps) => (
  <div className="flex justify-center gap-6 mt-8">
    <Link href="/">
      <Button size="large" icon={<ArrowLeftOutlined />} className="rounded-lg px-8">
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
      className="bg-blue-600 hover:bg-blue-500 rounded-lg px-8 shadow-lg shadow-blue-200"
    >
      Guardar Evaluación
    </Button>
  </div>
);