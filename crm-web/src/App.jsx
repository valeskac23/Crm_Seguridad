import { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Corrección para el icono del marcador por defecto de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


function App() {
  const [estadoServer, setEstadoServer] = useState("Buscando central...")

  // Coordenadas de prueba para la "Oficina Central" (puedes cambiarlas)
  // Ejemplo: Caracas, Venezuela
  const posicionOficina = [10.48801, -66.87919]

  useEffect(() => {
    axios.get('http://localhost:3000/')
      .then(respuesta => setEstadoServer(respuesta.data.mensaje))
      .catch(() => setEstadoServer("Error de conexión"))
  }, [])

  return (
    // Contenedor Principal con Flexbox (Tailwind clases)
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* 1. BARRA LATERAL (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-5">
        <h1 className="text-2xl font-bold text-sky-400 mb-10">SeguridadPro</h1>
        <nav className="space-y-4">
          <a href="#" className="block p-3 bg-sky-600 rounded-lg font-semibold">Dashboard</a>
          <a href="#" className="block p-3 hover:bg-slate-700 rounded-lg">Guardias</a>
          <a href="#" className="block p-3 hover:bg-slate-700 rounded-lg">Incidentes</a>
          <a href="#" className="block p-3 hover:bg-slate-700 rounded-lg">Reportes</a>
        </nav>
      </aside>

      {/* 2. ÁREA DE CONTENIDO (Header + Main) */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Monitor Operativo</h2>

          {/* Indicador de Estado (Estilizado con Tailwind) */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${estadoServer?.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
            <div className={`w-2 h-2 rounded-full ${estadoServer?.includes("Error") ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
            {estadoServer}
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL (Donde va el mapa) */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Tarjeta contenedora del mapa */}
          <div className="bg-white p-4 rounded-xl shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Ubicación de Oficina Central</h3>

            {/* EL MAPA (react-leaflet) */}
            {/* Importante: el contenedor del mapa debe tener una altura definida */}
            <div className="flex-1 rounded-lg overflow-hidden border border-gray-200" style={{ height: '100%' }}>
              <MapContainer
                center={posicionOficina}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full" /* Tailwind clases para ocupar todo el div */
              >
                {/* Capa base del mapa (OpenStreetMap) */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marcador de la Oficina */}
                <Marker position={posicionOficina}>
                  <Popup>
                    <div className='font-sans'>
                      <strong className='text-sky-700'>Oficina Central</strong><br />
                      Sede Operativa SeguridadPro
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default App