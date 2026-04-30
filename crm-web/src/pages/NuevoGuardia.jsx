import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function NuevoGuardia() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', lat: '', lng: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/guardia', {
        nombre: form.nombre,
        estado: 'activo',
        ubicacion: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) }
      });
      navigate('/'); // Volver al mapa tras guardar
    } catch (error) {
      alert("Error al guardar guardia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Registrar Nueva Unidad</h2>
        <Link title='Cerrar' to="/" className="text-slate-500 hover:text-slate-800">✕</Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Guardia / Patrulla</label>
          <input
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            type="text"
            placeholder="Ej: Unidad 04 - Centro"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
          <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Latitud</label>
            <input
              required
              className="w-full p-2 border rounded-lg"
              type="number" step="any" placeholder="10.48..."
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Longitud</label>
            <input
              required
              className="w-full p-2 border rounded-lg"
              type="number" step="any" placeholder="-66.8..."
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-slate-400' : 'bg-sky-600 hover:bg-sky-700'}`}
        >
          {loading ? 'Guardando...' : 'DAR DE ALTA UNIDAD'}
        </button>
      </form>
    </div>
  );
}

export default NuevoGuardia;