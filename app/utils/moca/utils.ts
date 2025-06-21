import { MOCAScores, EducationLevel, Section, SectionKey } from '../../type';

export const initialScores: MOCAScores = {
  visuospatial: [false, false, false, false, false],
  naming: [false, false, false],
  memoryAttempt: [false, false],
  attention1: [false, false],
  attention2: [false],
  attention3: [false, false, false, false, false],
  language1: [false, false],
  language2: [false],
  abstraction: [false, false],
  delayedRecall: [false, false, false, false, false],
  orientation: [false, false, false, false, false, false],
};

export const sections: Section[] = [
  { key: 'info', title: 'Información' },
  { key: 'visuospatial', title: 'Visuoespacial' },
  { key: 'naming', title: 'Identificación' },
  { key: 'memory', title: 'Memoria' },
  { key: 'attention', title: 'Atención' },
  { key: 'language', title: 'Lenguaje' },
  { key: 'abstraction', title: 'Abstracción' },
  { key: 'delayedRecall', title: 'Recuerdo' },
  { key: 'orientation', title: 'Orientación' },
  { key: 'results', title: 'Resultados' },
];

export const sectionTitles = {
  info: 'Información',
  visuospatial: 'Visuoespacial',
  naming: 'Identificación',
  memory: 'Memoria',
  attention: 'Atención',
  language: 'Lenguaje',
  abstraction: 'Abstracción',
  delayedRecall: 'Recuerdo',
  orientation: 'Orientación',
  results: 'Resultados'
};

export const calculateScore = (scores: MOCAScores, educationLevel: EducationLevel): number => {
  let total = 0;
  
  total += scores.visuospatial.filter(Boolean).length;
  total += scores.naming.filter(Boolean).length;
  total += scores.attention1.filter(Boolean).length;
  total += scores.attention2.filter(Boolean).length;
  
  const correctSubtractions = scores.attention3.filter(Boolean).length;
  
  if (correctSubtractions >= 4) total += 3;
  else if (correctSubtractions >= 2) total += 2;
  else if (correctSubtractions >= 1) total += 1;
  total += scores.language1.filter(Boolean).length;
  total += scores.language2.filter(Boolean).length;
  total += scores.abstraction.filter(Boolean).length;
  total += scores.delayedRecall.filter(Boolean).length;
  total += scores.orientation.filter(Boolean).length;

  if (educationLevel === 'none') total += 1;
  
  return total;
};

export const calculateSectionProgress = (section: SectionKey, scores: MOCAScores): number => {
  switch(section) {
    case 'visuospatial':
      return (scores.visuospatial.filter(Boolean).length / 5) * 100;
    case 'naming':
      return (scores.naming.filter(Boolean).length / 3) * 100;
    case 'attention':
      const attention1 = scores.attention1.filter(Boolean).length;
      const attention2 = scores.attention2.filter(Boolean).length;
      const correctSubtractions = scores.attention3.filter(Boolean).length;
      let attention3 = 0;
      if (correctSubtractions >= 4) attention3 = 3;
      else if (correctSubtractions >= 2) attention3 = 2;
      else if (correctSubtractions >= 1) attention3 = 1;
      return ((attention1 + attention2 + attention3) / 6) * 100;
    case 'language':
      const language1 = scores.language1.filter(Boolean).length;
      const language2 = scores.language2.filter(Boolean).length;
      return ((language1 + language2) / 3) * 100;
    case 'abstraction':
      return (scores.abstraction.filter(Boolean).length / 2) * 100;
    case 'delayedRecall':
      return (scores.delayedRecall.filter(Boolean).length / 5) * 100;
    case 'orientation':
      return (scores.orientation.filter(Boolean).length / 6) * 100;
    default:
      return 0;
  }
};