import { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Componente auxiliar para mover la cámara del mapa
function CentrarMapa({ posicion }) {
  const map = useMap();
  useEffect(() => {
    if (posicion) {
      map.flyTo(posicion, 16, { animate: true });
    }
  }, [posicion, map]);
  return null;
}

function Dashboard() {
  const [estadoServer, setEstadoServer] = useState("Conectando...")
  const [guardias, setGuardias] = useState([])
  const [objetivoMapa, setObjetivoMapa] = useState([10.48801, -66.87919]) // Oficina por defecto
  const posicionOficina = [10.48801, -66.87919]

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/guardias')
        const listaGuardias = res.data
        setGuardias(listaGuardias)
        setEstadoServer("Sistema en línea")

        // LÓGICA DE AUTO-ENFOQUE:
        // Si hay algún guardia en alerta, obtenemos su posición para mover el mapa
        const guardiaEnAlerta = listaGuardias.find(g => g.estado === 'alerta')
        if (guardiaEnAlerta) {
          setObjetivoMapa([guardiaEnAlerta.ubicacion.lat, guardiaEnAlerta.ubicacion.lng])
        }
      } catch (error) {
        setEstadoServer("Error de conexión")
      }
    }

    cargarDatos()
    const intervalo = setInterval(cargarDatos, 5000) // Consultar cada 5 seg
    return () => clearInterval(intervalo)
  }, [])

  const hayEmergencia = guardias.some(g => g.estado === 'alerta')

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className={`p-4 shadow-md flex justify-between items-center ${hayEmergencia ? 'bg-red-600 text-white' : 'bg-white'}`}>
        <h2 className="font-bold text-xl">
          {hayEmergencia ? '⚠️ EMERGENCIA EN CURSO' : 'Monitor de Unidades'}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono">{estadoServer}</span>
          <div className={`w-3 h-3 rounded-full ${hayEmergencia ? 'bg-white animate-ping' : 'bg-green-500'}`}></div>
        </div>
      </header>

      {/* CONTENEDOR DEL MAPA ÚNICO */}
      <div className="flex-1 relative">
        <MapContainer center={posicionOficina} zoom={15} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Componente que mueve la cámara */}
          <CentrarMapa posicion={objetivoMapa} />

          {/* Marcador de la Oficina */}
          <Marker position={posicionOficina}>
            <Popup>Oficina Central</Popup>
          </Marker>

          {/* Marcadores de Guardias */}
          {guardias.map((g) => (
            <Marker
              key={g._id}
              position={[g.ubicacion.lat, g.ubicacion.lng]}
            >
              <Popup>
                <div className="text-center p-1">
                  <p className={`font-bold ${g.estado === 'alerta' ? 'text-red-600' : 'text-slate-800'}`}>
                    {g.nombre}
                  </p>
                  <p className="text-xs">Estado: {g.estado.toUpperCase()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Overlay de alerta (Solo aparece si hay pánico) */}
        {hayEmergencia && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-2xl border-2 border-white animate-bounce">
            LOCALIZANDO UNIDAD EN PELIGRO...
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard