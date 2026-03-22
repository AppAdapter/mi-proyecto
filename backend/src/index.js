// src/index.js
// Punto de entrada principal del servidor backend
 
// Cargamos las variables del archivo .env ANTES que cualquier otra cosa
require('dotenv').config();
 
const express = require('express');
const cors    = require('cors');
 
// Importamos las rutas que creamos
const heroRoutes      = require('./routes/hero');
const serviciosRoutes = require('./routes/servicios');
const productosRoutes = require('./routes/productos');
const contactoRoutes  = require('./routes/contacto');
 
// Creamos la aplicación Express
const app = express();
 
// ── Middlewares ──────────────────────────────────────────────────────
// Middleware: son funciones que procesan la petición ANTES de llegar a las rutas
 
// cors() permite que el frontend (en otro dominio) pueda llamar al backend
// Sin esto, el navegador bloquearía las peticiones por seguridad
app.use(cors());
 
// express.json() permite que el servidor lea los datos JSON del body de las peticiones
// Sin esto, req.body estaría vacío en los POST y PUT
app.use(express.json());
 
// ── Rutas ────────────────────────────────────────────────────────────
// Registramos las rutas con sus prefijos
// Por ejemplo: heroRoutes manejará todas las URLs que empiecen con /api/hero
app.use('/api/hero',      heroRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/contacto',  contactoRoutes);
 
// Ruta de prueba — sirve para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor funcionando correctamente! 🚀' });
});
 
// ── Arrancar el servidor ─────────────────────────────────────────────
// Leemos el puerto del archivo .env, o usamos 3000 si no está definido
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
