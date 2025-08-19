'use client'
import { useEffect, useState } from 'react'
import { Card, Spin, Empty, Popconfirm, Button } from 'antd'
import { obtenerResultadosPaciente } from '@/app/lib/pacienteService'
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

    useEffect(() => {
        Promise.resolve(params).then(resolved => {
            setResolvedParams(resolved)
        })
    }, [params])

    useEffect(() => {
        if (!resolvedParams?.dni) return

        const fetchResultados = async () => {
            try {
                const data = await obtenerResultadosPaciente(resolvedParams.dni)
                setResultados(data as Resultado[])
            } catch (error) {
                console.error('Error al obtener resultados:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchResultados()
    }, [resolvedParams])

    function handleEliminar(id: string): void {
        console.log(id);
        throw new Error('Function not implemented.')
        
    }

    if (!resolvedParams) {
        return <Spin size="large" />
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Resultados del Paciente: {resolvedParams.dni}</h1>

            {loading ? (
                <Spin size="large" />
            ) : resultados.length === 0 ? (
                <Empty description="No hay resultados" />
            ) : (
                resultados.map((resultado) => (
                    <Card
                        key={resultado.id}
                        title={`Resultado: ${resultado.id}`}
                        style={{ marginBottom: '1rem' }}
                        extra={
                            <Popconfirm
                                title="¿Estás seguro de eliminar este resultado?"
                                onConfirm={() => handleEliminar(resultado.id)}
                                okText="Sí"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        }
                    >
                        <p><strong>Fecha:</strong> {resultado.fecha?.toDate?.().toLocaleString() || 'No disponible'}</p>
                        <p><strong>Gijón:</strong> {resultado.gijon ?? 'No registrado'}</p>
                        <p><strong>Completado:</strong> {resultado.completado ? 'Sí' : 'No'}</p>
                    </Card>
                ))
            )}
        </div>
    )
}

export default RecordPage