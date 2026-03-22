// src/pages/AdminPanel.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
 
const API = import.meta.env.VITE_API_URL;
 
// ── Componente de tabla genérico ──────────────────────────────────────
// Este componente muestra los datos en una tabla y botones de editar/eliminar
function TablaGenerica({ datos, campos, onEditar, onEliminar }) {
  if (!datos.length) return <p style={{ color: '#666' }}>No hay datos aún.</p>;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ background: '#2E75B6', color: 'white' }}>
          {campos.map(c => <th key={c} style={{ padding: '0.5rem 1rem', textAlign: 'left' }}>{c}</th>)}
          <th style={{ padding: '0.5rem 1rem' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {datos.map((item, i) => (
          <tr key={item.id} style={{ background: i%2===0 ? '#f9f9f9' : 'white' }}>
            {campos.map(c => <td key={c} style={{ padding: '0.5rem 1rem', border: '1px solid #eee' }}>{item[c.toLowerCase()]}</td>)}
            <td style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onEditar(item)}
                      style={{ background: '#1F4E79', color: 'white', border: 'none',
                               padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                ✏️ Editar
              </button>
              <button onClick={() => onEliminar(item.id)}
                      style={{ background: '#C55A11', color: 'white', border: 'none',
                               padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                🗑️ Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 
// ── Panel Principal ───────────────────────────────────────────────────
export default function AdminPanel() {
  const [seccion,   setSeccion]   = useState('hero');
  const [datos,     setDatos]     = useState([]);
  const [editando,  setEditando]  = useState(null);  // null = formulario de crear
  const [form,      setForm]      = useState({});
  const [mensajeOk, setMensajeOk] = useState('');
 
  // Configura qué campos mostrar y qué ruta usar según la sección
  const config = {
    hero:      { ruta: 'hero',      campos: ['Titulo', 'Subtitulo', 'Descripcion'] },
    servicios: { ruta: 'servicios', campos: ['Titulo', 'Descripcion', 'Orden'] },
    productos: { ruta: 'productos', campos: ['Nombre', 'Descripcion', 'Precio'] },
    contacto:  { ruta: 'contacto',  campos: ['Nombre', 'Email', 'Mensaje'] },
  };
 
  // Cargar datos cuando cambia la sección activa
  useEffect(() => {
    cargarDatos();
    setForm({});
    setEditando(null);
  }, [seccion]);
 
  const cargarDatos = async () => {
    const ruta = seccion === 'productos' ? 'productos/todos' : config[seccion].ruta;
    const r = await axios.get(`${API}/api/${ruta}`);
    setDatos(r.data);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        // Si estamos editando, usamos PUT
        await axios.put(`${API}/api/${config[seccion].ruta}/${editando}`, form);
        setMensajeOk('✅ Actualizado correctamente');
      } else {
        // Si es nuevo, usamos POST
        await axios.post(`${API}/api/${config[seccion].ruta}`, form);
        setMensajeOk('✅ Creado correctamente');
      }
      setForm({});
      setEditando(null);
      cargarDatos();
    } catch { setMensajeOk('❌ Error al guardar'); }
    setTimeout(() => setMensajeOk(''), 3000);
  };
 
  const eliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    await axios.delete(`${API}/api/${config[seccion].ruta}/${id}`);
    setMensajeOk('✅ Eliminado correctamente');
    cargarDatos();
    setTimeout(() => setMensajeOk(''), 3000);
  };
 
  const iniciarEdicion = (item) => {
    setEditando(item.id);
    setForm(item); // Pre-carga el formulario con los datos actuales
  };
 
  const secciones = ['hero', 'servicios', 'productos', 'contacto'];
 
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial' }}>
 
      {/* Navbar del admin */}
      <nav style={{ background: '#1F4E79', padding: '1rem 2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold' }}>⚙️ Panel Admin</span>
        <a href='/' style={{ color: 'white' }}>Ver Landing →</a>
      </nav>
 
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
 
        {/* Sidebar con las secciones */}
        <aside style={{ width: '200px', background: '#2E75B6', padding: '1rem' }}>
          {secciones.map(s => (
            <button key={s} onClick={() => setSeccion(s)}
                    style={{ display: 'block', width: '100%', padding: '0.7rem',
                             marginBottom: '0.5rem', border: 'none', borderRadius: '5px',
                             background: seccion === s ? 'white' : 'transparent',
                             color: seccion === s ? '#1F4E79' : 'white',
                             fontWeight: 'bold', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </aside>
 
        {/* Contenido principal */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <h2 style={{ color: '#1F4E79', marginBottom: '1rem' }}>
            {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
          </h2>
 
          {mensajeOk && (
            <p style={{ background: '#e8f5e9', border: '1px solid #4caf50',
                        padding: '0.5rem 1rem', borderRadius: '5px', marginBottom: '1rem' }}>
              {mensajeOk}
            </p>
          )}
 
          {/* Formulario de crear/editar — solo para secciones editables */}
          {seccion !== 'contacto' && (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h3 style={{ color: '#2E75B6', marginBottom: '1rem' }}>
                {editando ? '✏️ Editando registro' : '➕ Agregar nuevo'}
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {config[seccion].campos.map(campo => (
                  <input key={campo}
                         placeholder={campo}
                         value={form[campo.toLowerCase()] || ''}
                         onChange={e => setForm({...form, [campo.toLowerCase()]: e.target.value})}
                         style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '5px' }} />
                ))}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type='submit'
                          style={{ background: '#2E75B6', color: 'white', border: 'none',
                                   padding: '0.6rem 1.5rem', borderRadius: '5px', cursor: 'pointer' }}>
                    {editando ? 'Actualizar' : 'Guardar'}
                  </button>
                  {editando && (
                    <button type='button' onClick={() => { setEditando(null); setForm({}); }}
                            style={{ background: '#666', color: 'white', border: 'none',
                                     padding: '0.6rem 1.5rem', borderRadius: '5px', cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
 
          {/* Tabla de datos */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <TablaGenerica
              datos={datos}
              campos={config[seccion].campos}
              onEditar={seccion !== 'contacto' ? iniciarEdicion : () => {}}
              onEliminar={eliminar}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
