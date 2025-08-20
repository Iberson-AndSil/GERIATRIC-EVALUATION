'use client'
import { useEffect, useState, useCallback } from 'react'
import { Card, Spin, Empty, Popconfirm, Button, Col, Row, message } from 'antd'
import { eliminarResultado, obtenerResultadosPaciente } from '@/app/lib/pacienteService'
import { DeleteOutlined } from "@ant-design/icons";

interface Resultado {
  id: string
  fecha: any
  gijon?: number
  completado?: boolean
  [key: string]: any
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
            <Col key={resultado.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={`Resultado: ${resultado.id}`}
                extra={
                  <Popconfirm
                    title="¿Estás seguro de eliminar este resultado?"
                    onConfirm={() => handleEliminar(resultado.id)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button danger type="text" icon={<DeleteOutlined />} />
                  </Popconfirm>
                }
              >
                <p>
                  <strong>Fecha:</strong>{" "}
                  {resultado.fecha?.toDate?.().toLocaleString() || "No disponible"}
                </p>
                <p>
                  <strong>Gijón:</strong> {resultado.gijon ?? "No registrado"}
                </p>
                <p>
                  <strong>Completado:</strong>{" "}
                  {resultado.completado ? "Sí" : "No"}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default RecordPage
