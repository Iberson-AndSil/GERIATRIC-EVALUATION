'use client'
import { useEffect, useState, useCallback } from 'react'
import { Card, Spin, Empty, Popconfirm, Button, Col, Row, message, Progress, Tag, Collapse, Divider } from 'antd'
import { deleteResult, getPatientResults } from '@/app/lib/pacienteService'
import { DeleteOutlined, CaretRightOutlined } from "@ant-design/icons"
import { Result } from '@/app/interfaces'

const { Panel } = Collapse

const MAX_VALUES: Record<string, number> = {
  gijon: 25,
  abvdScore: 100,
  aivdScore: 21,
  sarcopenia: 10,
  falls: 3,
  deterioration: 3,
  incontinence: 25,
  depression: 4,
  sensory: 4,
  bristol: 6,
  adherence: 4,
  balance: 12,
  physicalDimension: 20,
  mentalDimension: 27,
  totalScore: 47,
  totalCognitive: 31,
  mmse30: 30,
  moca: 30,
  affective: 15,
  nutritional: 30
}

const getScoreColor = (key: string, value: number) => {
  const max = MAX_VALUES[key] || 100
  const percentage = (value / max) * 100
  
  switch(key) {
    case 'gijon':
    case 'abvdScore':
    case 'aivdScore':
    case 'falls':
    case 'deterioration':
    case 'incontinence':
    case 'depression':
    case 'sensory':
    case 'bristol':
      if (percentage <= 33) return '#52c41a'
      if (percentage <= 66) return '#faad14'
      return '#f5222d'
    
    case 'adherence':
    case 'dynamometry':
    case 'balance':
    case 'physicalDimension':
    case 'mentalDimension':
    case 'totalScore':
    case 'totalCognitive':
    case 'mmse30':
    case 'moca':
    case 'affective':
    case 'nutritional':
      if (percentage <= 33) return '#f5222d'
      if (percentage <= 66) return '#faad14'
      return '#52c41a'
    
    case 'sarcopenia':
      if (value <= 3) return '#52c41a'
      if (value <= 6) return '#faad14'
      return '#f5222d'
      
    default:
      if (percentage <= 33) return '#f5222d'
      if (percentage <= 66) return '#faad14'
      return '#52c41a'
  }
}

const formatLabel = (key: string) => {
  const labels: Record<string, string> = {
    gijon: 'Escala de Gijón',
    abvdScore: 'ABVD',
    aivdScore: 'AIVD',
    sarcopenia: 'Sarcopenia',
    falls: 'Caídas',
    deterioration: 'Deterioro cognitivo',
    incontinence: 'Incontinencia urinaria',
    depression: 'Depresión',
    sensory: 'Deterioro sensorial',
    bristol: 'Escala Bristol',
    adherence: 'Adherencia tratamiento',
    dynamometry: 'Dinamometría',
    balance: 'Balance',
    physicalDimension: 'Dimensión física',
    mentalDimension: 'Dimensión mental',
    totalScore: 'Calidad de vida total',
    totalCognitive: 'Cognitivo total',
    mmse30: 'MMSE',
    moca: 'MoCA',
    affective: 'Afectiva',
    nutritional: 'Valoración nutricional'
  }
  
  return labels[key] || key
}

const ScoreDisplay = ({ value, metricKey }: { 
  value?: number, 
  metricKey: string
}) => {
  if (value === undefined || value === null) return null
  
  const max = MAX_VALUES[metricKey] || 100
  const label = formatLabel(metricKey)
  
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>{label}:</span>
        <span style={{ fontWeight: 'bold', color: getScoreColor(metricKey, value) }}>
          {value}/{max}
        </span>
      </div>
      <Progress 
        percent={(value / max) * 100} 
        showInfo={false} 
        strokeColor={getScoreColor(metricKey, value)}
        size="small"
      />
    </div>
  )
}

const SyndromeScoreDisplay = ({ value, metricKey }: { 
  value?: number, 
  metricKey: string
}) => {
  if (value === undefined || value === null) return null
  
  const max = MAX_VALUES[metricKey] || 100
  const label = formatLabel(metricKey)
  
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>{label}:</span>
        <span style={{ fontWeight: 'bold', color: getScoreColor(metricKey, value) }}>
          {value}/{max}
        </span>
      </div>
      <Progress 
        percent={(value / max) * 100} 
        showInfo={false} 
        strokeColor={getScoreColor(metricKey, value)}
        size="small"
      />
    </div>
  )
}

const ResultCard = ({ resultado, onEliminar }: { 
  resultado: Result, 
  onEliminar: (id: string) => void 
}) => {
  const [activePanels, setActivePanels] = useState<string | string[]>(['gijon'])

  const handlePanelChange = (keys: string | string[]) => {
    setActivePanels(keys)
  }

  return (
    <Card
      title={`Evaluación: ${new Date(resultado.date?.toDate?.() || resultado.date).toLocaleDateString() || "Fecha no disponible"}`}
      extra={
        <Popconfirm
          title="¿Estás seguro de eliminar este resultado?"
          onConfirm={() => onEliminar(resultado.id)}
          okText="Sí"
          cancelText="No"
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      }
      style={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <Tag color={resultado.completed ? 'green' : 'orange'}>
          {resultado.completed ? 'COMPLETADO' : 'PENDIENTE'}
        </Tag>
        <Tag color="blue">ID: {resultado.id.substring(0, 8)}...</Tag>
      </div>
      
      <Collapse 
        activeKey={activePanels}
        onChange={handlePanelChange}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        ghost
      >
        <Panel header="Escala de Gijón" key="gijon">
          <ScoreDisplay value={resultado.gijon} metricKey="gijon" />
          <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
            <strong>Interpretación:</strong> Mayor puntuación indica mayor riesgo social
          </div>
        </Panel>
        
        <Panel header="Valoración Funcional" key="funcional">
          <ScoreDisplay value={resultado.abvdScore} metricKey="abvdScore" />
          <Divider style={{ margin: '12px 0' }} />
          <ScoreDisplay value={resultado.aivdScore} metricKey="aivdScore" />
        </Panel>
        
        <Panel header="Síndromes Geriátricos" key="sindromes">
          <SyndromeScoreDisplay value={resultado.sarcopenia} metricKey="sarcopenia" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.falls} metricKey="falls" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.deterioration} metricKey="deterioration" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.incontinence} metricKey="incontinence" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.depression} metricKey="depression" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.sensory} metricKey="sensory" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.bristol} metricKey="bristol" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.adherence} metricKey="adherence" />
        </Panel>
        
        <Panel header="Valoración Física" key="fisica">
          {resultado.dynamometry !== undefined && resultado.dynamometry !== null ? (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Dinamometría:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {resultado.dynamometry} kg
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                <strong>Nota:</strong> No existe valor máximo de referencia
              </div>
            </div>
          ) : null}
          <ScoreDisplay value={resultado.balance} metricKey="balance" />
        </Panel>
        
        <Panel header="Valoración Mental y Calidad de Vida" key="mental">
          <ScoreDisplay value={resultado.physicalDimension} metricKey="physicalDimension" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.mentalDimension} metricKey="mentalDimension" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.totalScore} metricKey="totalScore" />
        </Panel>
        
        <Panel header="Evaluación Cognitiva" key="cognitivo">
          <ScoreDisplay value={resultado.totalCognitive} metricKey="totalCognitive" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.mmse30} metricKey="mmse30" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.moca} metricKey="moca" />
        </Panel>
        
        <Panel header="Evaluación Afectiva" key="afectiva">
          <ScoreDisplay value={resultado.affective} metricKey="affective" />
        </Panel>
        
        <Panel header="Valoración Nutricional" key="nutricional">
          <ScoreDisplay value={resultado.nutritional} metricKey="nutritional" />
        </Panel>
      </Collapse>
    </Card>
  )
}

const RecordPage = ({ params }: { params: Promise<{ dni: string }> }) => {
  const [resolvedParams, setResolvedParams] = useState<{ dni: string } | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResultados = useCallback(async (dni: string) => {
    setLoading(true)
    try {
      const data = await getPatientResults(dni)
      setResults(data)
    } catch (error) {
      console.error('Error getting results:', error)
      message.error("No se pudieron cargar los resultados")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve(params).then(resolved => {
      setResolvedParams(resolved)
    })
  }, [params])

  useEffect(() => {
    if (!resolvedParams?.dni) return
    fetchResultados(resolvedParams.dni)
  }, [resolvedParams, fetchResultados])

  async function handleEliminar(id: string): Promise<void> {
    if (!resolvedParams?.dni) return
    try {
      await deleteResult(resolvedParams.dni, id)
      message.success("Resultado eliminado correctamente")
      await fetchResultados(resolvedParams.dni)
    } catch (error) {
      console.error("Error deleting result:", error)
      message.error("No se pudo eliminar el resultado")
    }
  }

  if (!resolvedParams) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Resultados del Paciente: {resolvedParams.dni}</h1>

      {loading ? (
        <div className='w-full h-full flex items-center justify-center'>
          <Spin size="large" />
        </div>
      ) : results.length === 0 ? (
        <Empty description="No hay resultados" />
      ) : (
        <Row gutter={[16, 16]}>
          {results.map((resultado) => (
            <Col key={resultado.id} xs={24} sm={24} md={12} lg={8} xl={8}>
              <ResultCard resultado={resultado} onEliminar={handleEliminar} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default RecordPage