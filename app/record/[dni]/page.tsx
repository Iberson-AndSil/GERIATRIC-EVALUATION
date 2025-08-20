'use client'
import { useEffect, useState, useCallback } from 'react'
import { Card, Spin, Empty, Popconfirm, Button, Col, Row, message, Progress, Tag, Collapse, Divider } from 'antd'
import { eliminarResultado, obtenerResultadosPaciente } from '@/app/lib/pacienteService'
import { DeleteOutlined, CaretRightOutlined } from "@ant-design/icons"

const { Panel } = Collapse

interface Resultado {
  id: string
  fecha: any
  gijon?: number
  completado?: boolean
  abvdScore?: number
  aivdScore?: number
  sarcopenia?: number
  caida?: number
  deterioro?: number
  incontinencia?: number
  depresion?: number
  sensorial?: number
  bristol?: number
  adherencia?: number
  dynamometry?: number
  balance?: number
  dimension_fisica?: number
  dimension_mental?: number
  puntaje_total?: number
  cognitivo_total?: number
  mmse30?: number
  moca?: number
  afectiva?: number
  nutricional?: number
  [key: string]: any
}

const MAX_VALUES: Record<string, number> = {
  gijon: 25,
  abvdScore: 100,
  aivdScore: 21,
  sarcopenia: 10,
  caida: 3,
  deterioro: 3,
  incontinencia: 25,
  depresion: 4,
  sensorial: 4,
  bristol: 6,
  adherencia: 4,
  balance: 12,
  dimension_fisica: 20,
  dimension_mental: 27,
  puntaje_total: 47,
  cognitivo_total: 31,
  mmse30: 30,
  moca: 30,
  afectiva: 15,
  nutricional: 30
}

const getScoreColor = (key: string, value: number) => {
  const max = MAX_VALUES[key] || 100
  const percentage = (value / max) * 100
  
  switch(key) {
    case 'gijon':
    case 'abvdScore':
    case 'aivdScore':
    case 'caida':
    case 'deterioro':
    case 'incontinencia':
    case 'depresion':
    case 'sensorial':
    case 'bristol':
      if (percentage <= 33) return '#52c41a'
      if (percentage <= 66) return '#faad14'
      return '#f5222d'
    
    case 'adherencia':
    case 'dynamometry':
    case 'balance':
    case 'dimension_fisica':
    case 'dimension_mental':
    case 'puntaje_total':
    case 'cognitivo_total':
    case 'mmse30':
    case 'moca':
    case 'afectiva':
    case 'nutricional':
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
    caida: 'Caídas',
    deterioro: 'Deterioro cognitivo',
    incontinencia: 'Incontinencia urinaria',
    depresion: 'Depresión',
    sensorial: 'Deterioro sensorial',
    bristol: 'Escala Bristol',
    adherencia: 'Adherencia tratamiento',
    dynamometry: 'Dinamometría',
    balance: 'Balance',
    dimension_fisica: 'Dimensión física',
    dimension_mental: 'Dimensión mental',
    puntaje_total: 'Calidad de vida total',
    cognitivo_total: 'Cognitivo total',
    mmse30: 'MMSE',
    moca: 'MoCA',
    afectiva: 'Afectiva',
    nutricional: 'Valoración nutricional'
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
  resultado: Resultado, 
  onEliminar: (id: string) => void 
}) => {
  const [activePanels, setActivePanels] = useState<string | string[]>(['gijon'])

  const handlePanelChange = (keys: string | string[]) => {
    setActivePanels(keys)
  }

  return (
    <Card
      title={`Evaluación: ${new Date(resultado.fecha?.toDate?.()).toLocaleDateString() || "Fecha no disponible"}`}
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
        <Tag color={resultado.completado ? 'green' : 'orange'}>
          {resultado.completado ? 'COMPLETADO' : 'PENDIENTE'}
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
          <SyndromeScoreDisplay value={resultado.caida} metricKey="caida" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.deterioro} metricKey="deterioro" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.incontinencia} metricKey="incontinencia" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.depresion} metricKey="depresion" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.sensorial} metricKey="sensorial" />
          <Divider style={{ margin: '8px 0' }} />
          <SyndromeScoreDisplay value={resultado.bristol} metricKey="bristol" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.adherencia} metricKey="adherencia" />
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
          <ScoreDisplay value={resultado.dimension_fisica} metricKey="dimension_fisica" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.dimension_mental} metricKey="dimension_mental" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.puntaje_total} metricKey="puntaje_total" />
        </Panel>
        
        <Panel header="Evaluación Cognitiva" key="cognitivo">
          <ScoreDisplay value={resultado.cognitivo_total} metricKey="cognitivo_total" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.mmse30} metricKey="mmse30" />
          <Divider style={{ margin: '8px 0' }} />
          <ScoreDisplay value={resultado.moca} metricKey="moca" />
        </Panel>
        
        <Panel header="Evaluación Afectiva" key="afectiva">
          <ScoreDisplay value={resultado.afectiva} metricKey="afectiva" />
        </Panel>
        
        <Panel header="Valoración Nutricional" key="nutricional">
          <ScoreDisplay value={resultado.nutricional} metricKey="nutricional" />
        </Panel>
      </Collapse>
    </Card>
  )
}

const RecordPage = ({ params }: { params: Promise<{ dni: string }> }) => {
  const [resolvedParams, setResolvedParams] = useState<{ dni: string } | null>(null)
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResultados = useCallback(async (dni: string) => {
    setLoading(true)
    try {
      const data = await obtenerResultadosPaciente(dni)
      setResultados(data as Resultado[])
    } catch (error) {
      console.error('Error al obtener resultados:', error)
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
      await eliminarResultado(resolvedParams.dni, id)
      message.success("Resultado eliminado correctamente")
      await fetchResultados(resolvedParams.dni)
    } catch (error) {
      console.error("Error eliminando resultado:", error)
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
      ) : resultados.length === 0 ? (
        <Empty description="No hay resultados" />
      ) : (
        <Row gutter={[16, 16]}>
          {resultados.map((resultado) => (
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