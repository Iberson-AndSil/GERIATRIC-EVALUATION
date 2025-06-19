import { SmileOutlined} from '@ant-design/icons';
import { DimensionsConfig } from '../../type';

export const dimensionsConfig: DimensionsConfig = {
  PHYSICAL: {
    name: "DIMENSIÓN FÍSICA",
    description: "Evalúa el estado de salud física y limitaciones funcionales",
    questionIndexes: [0, 1, 2, 3, 4, 7],
    maxScore: 20,
    icon: <SmileOutlined />
  },
  MENTAL: {
    name: "DIMENSIÓN MENTAL",
    description: "Evalúa el estado emocional y bienestar psicológico",
    questionIndexes: [5, 6, 8, 9, 10, 11],
    maxScore: 27,
    icon: <SmileOutlined />
  }
};
