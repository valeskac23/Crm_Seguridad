import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NuevoGuardia from './pages/NuevoGuardia';
import GestionUsuarios from './pages/GestionUsuarios';
import Login from './pages/Login';

function App() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  const isAuthenticated = !!token;

  // 1. Si NO está autenticado, solo mostramos el Login
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Cualquier otra ruta redirige a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // 2. Si ESTÁ autenticado, mostramos toda la estructura del Dashboard
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 text-white p-5 hidden md:flex flex-col">
          <h1 className="text-2xl font-bold text-sky-400 mb-2">SeguridadPro</h1>
          <p className="text-[10px] text-slate-500 mb-8 uppercase tracking-widest">
            Panel: {rol === 'admin' ? 'Administrador' : 'Operador'}
          </p>

          <nav className="flex-1 space-y-2">
            <a href="/" className="flex items-center gap-2 p-3 hover:bg-slate-800 rounded-lg">🛰️ Monitor</a>

            {rol === 'admin' && (
              <div className="pt-6">
                <p className="text-[10px] text-slate-500 mb-2 px-3 uppercase text-sky-500/50">Administración</p>
                <a href="/nuevo" className="flex items-center gap-2 p-3 hover:bg-slate-800 rounded-lg text-sm">➕ Registrar Guardia</a>
                <a href="/usuarios" className="flex items-center gap-2 p-3 hover:bg-slate-800 rounded-lg text-sm">👥 Crear Usuarios</a>
              </div>
            )}
          </nav>

          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="mt-auto p-3 bg-slate-800 hover:bg-red-900 text-red-400 rounded-lg text-sm font-bold transition"
          >
            🚪 Cerrar Sesión
          </button>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {/* Solo se registran estas rutas si es admin */}
            {rol === 'admin' && (
              <>
                <Route path="/nuevo" element={<NuevoGuardia />} />
                <Route path="/usuarios" element={<GestionUsuarios />} />
              </>
            )}

            {/* Si intenta entrar a una ruta admin siendo usuario, vuelve al dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;