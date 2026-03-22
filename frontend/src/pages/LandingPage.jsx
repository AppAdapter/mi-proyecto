// src/pages/LandingPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
 
// La URL del backend viene del archivo .env
const API = import.meta.env.VITE_API_URL;
 
export default function LandingPage() {
  // Estados para guardar los datos que vendrán de la BD
  const [hero,      setHero]      = useState([]);
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [sobre,     setSobre]     = useState([]);
 
  // Estados para el formulario de contacto
  const [contactoForm, setContactoForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviando,     setEnviando]     = useState(false);
  const [mensajeOk,    setMensajeOk]    = useState('');
 
  // useEffect se ejecuta al cargar la página
  // Aquí llamamos al backend para obtener todos los datos
  useEffect(() => {
    axios.get(`${API}/api/hero`).then(r => setHero(r.data));
    axios.get(`${API}/api/servicios`).then(r => setServicios(r.data));
    axios.get(`${API}/api/productos`).then(r => setProductos(r.data));
  }, []); // El [] significa que solo se ejecuta UNA vez al cargar
 
  // Función para enviar el formulario de contacto
  const enviarContacto = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar
    setEnviando(true);
    try {
      await axios.post(`${API}/api/contacto`, contactoForm);
      setMensajeOk('¡Mensaje enviado con éxito!');
      setContactoForm({ nombre: '', email: '', mensaje: '' });
    } catch { setMensajeOk('Error al enviar. Intenta de nuevo.'); }
    setEnviando(false);
  };
 
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0 }}>
 
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{ background: '#1F4E79', padding: '1rem 2rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>Mi Empresa</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['#hero','#servicios','#productos','#contacto'].map(href => (
            <a key={href} href={href} style={{ color: 'white', textDecoration: 'none' }}>
              {href.replace('#','').charAt(0).toUpperCase() + href.slice(2)}
            </a>
          ))}
        </div>
      </nav>
 
      {/* ── HERO ──────────────────────────────────────────── */}
      <section id='hero' style={{ background: '#2E75B6', color: 'white',
                                   padding: '5rem 2rem', textAlign: 'center' }}>
        {hero[0] ? (
          <>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{hero[0].titulo}</h1>
            <p  style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{hero[0].subtitulo}</p>
            <p  style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>{hero[0].descripcion}</p>
            {hero[0].boton_texto && (
              <a href={hero[0].boton_link}
                 style={{ background: 'white', color: '#2E75B6', padding: '0.8rem 2rem',
                          borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
                {hero[0].boton_texto}
              </a>
            )}
          </>
        ) : <p>Cargando...</p>}
      </section>
 
      {/* ── SERVICIOS ─────────────────────────────────────── */}
      <section id='servicios' style={{ padding: '4rem 2rem', background: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', color: '#1F4E79', marginBottom: '3rem' }}>Nuestros Servicios</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {servicios.map(s => (
            <div key={s.id} style={{ background: 'white', borderRadius: '10px',
                                      padding: '2rem', maxWidth: '280px',
                                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2E75B6' }}>{s.titulo}</h3>
              <p>{s.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── PRODUCTOS ─────────────────────────────────────── */}
      <section id='productos' style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#1F4E79', marginBottom: '3rem' }}>Nuestros Productos</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {productos.map(p => (
            <div key={p.id} style={{ border: '2px solid #2E75B6', borderRadius: '10px',
                                      padding: '2rem', maxWidth: '250px', textAlign: 'center' }}>
              <h3 style={{ color: '#1F4E79' }}>{p.nombre}</h3>
              <p style={{ fontSize: '1.5rem', color: '#2E75B6', fontWeight: 'bold' }}>
                ${p.precio}
              </p>
              <p>{p.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── CONTACTO ──────────────────────────────────────── */}
      <section id='contacto' style={{ padding: '4rem 2rem', background: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center', color: '#1F4E79', marginBottom: '2rem' }}>Contáctanos</h2>
        <form onSubmit={enviarContacto}
              style={{ maxWidth: '500px', margin: '0 auto', display: 'flex',
                       flexDirection: 'column', gap: '1rem' }}>
          <input  required value={contactoForm.nombre}
                  onChange={e => setContactoForm({...contactoForm, nombre: e.target.value})}
                  placeholder='Tu nombre'
                  style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input  required type='email' value={contactoForm.email}
                  onChange={e => setContactoForm({...contactoForm, email: e.target.value})}
                  placeholder='Tu email'
                  style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <textarea required rows={4} value={contactoForm.mensaje}
                    onChange={e => setContactoForm({...contactoForm, mensaje: e.target.value})}
                    placeholder='Tu mensaje'
                    style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type='submit' disabled={enviando}
                  style={{ background: '#2E75B6', color: 'white', padding: '0.8rem',
                           border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
          {mensajeOk && <p style={{ color: 'green', textAlign: 'center' }}>{mensajeOk}</p>}
        </form>
      </section>
 
      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{ background: '#1F4E79', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <p>© {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.</p>
      </footer>
 
    </div>
  );
}
