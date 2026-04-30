import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GestionUsuarios() {
  const [form, setForm] = useState({ email: '', password: '', rol: 'usuario' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usamos la ruta de registro que creamos anteriormente
      await axios.post('http://localhost:3000/api/auth/register', form);
      alert("Usuario creado con éxito");
      navigate('/'); // Volver al inicio
    } catch (error) {
      alert("Error al crear usuario: " + error.response.data.error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Crear Nuevo Usuario</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input
            required
            type="email"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="correo@seguridad.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña Temporal</label>
          <input
            required
            type="password"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Asignar Rol</label>
          <select
            className="w-full p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-sky-500"
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
          >
            <option value="operador">Operador (Solo Lectura/Alarmas)</option>
            <option value="admin">Administrador (Control Total)</option>
          </select>
        </div>

        <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold hover:bg-slate-800 transition">
          REGISTRAR USUARIO
        </button>
      </form>
    </div>
  );
}

export default GestionUsuarios;