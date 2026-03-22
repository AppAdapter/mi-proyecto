// src/routes/hero.js
// Rutas para la sección Hero de la landing page
 
const express = require('express');
const router  = express.Router(); // Router es como un mini servidor para un grupo de rutas
const db      = require('../db'); // Importamos la conexión a la BD
 
// ── GET /api/hero ──────────────────────────────────────────────────
// Devuelve todos los registros de la tabla hero
// El frontend llama a esta ruta para obtener el contenido del hero
router.get('/', async (req, res) => {
  try {
    // Ejecutamos la consulta SQL y esperamos el resultado
    const [rows] = await db.query('SELECT * FROM hero');
    // Enviamos los datos como JSON al frontend
    res.json(rows);
  } catch (error) {
    // Si hay un error, lo mostramos en consola y enviamos error 500
    console.error('Error en GET /hero:', error);
    res.status(500).json({ error: 'Error al obtener el hero' });
  }
});
 
// ── POST /api/hero ─────────────────────────────────────────────────
// Crea un nuevo registro en la tabla hero
// El panel admin usa esta ruta cuando el admin agrega un nuevo hero
router.post('/', async (req, res) => {
  try {
    // Extraemos los datos del body (cuerpo) de la petición
    const { titulo, subtitulo, descripcion, imagen_url, boton_texto, boton_link } = req.body;
    // Ejecutamos INSERT y guardamos el resultado
    const [result] = await db.query(
      'INSERT INTO hero (titulo, subtitulo, descripcion, imagen_url, boton_texto, boton_link) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, subtitulo, descripcion, imagen_url, boton_texto, boton_link]
    );
    // Respondemos con el ID del nuevo registro
    res.status(201).json({ id: result.insertId, mensaje: 'Hero creado correctamente' });
  } catch (error) {
    console.error('Error en POST /hero:', error);
    res.status(500).json({ error: 'Error al crear el hero' });
  }
});
 
// ── PUT /api/hero/:id ──────────────────────────────────────────────
// Actualiza un registro existente en la tabla hero
// :id es un parámetro dinámico, por ejemplo: /api/hero/1
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID de la URL
    const { titulo, subtitulo, descripcion, imagen_url, boton_texto, boton_link } = req.body;
    await db.query(
      'UPDATE hero SET titulo=?, subtitulo=?, descripcion=?, imagen_url=?, boton_texto=?, boton_link=? WHERE id=?',
      [titulo, subtitulo, descripcion, imagen_url, boton_texto, boton_link, id]
    );
    res.json({ mensaje: 'Hero actualizado correctamente' });
  } catch (error) {
    console.error('Error en PUT /hero:', error);
    res.status(500).json({ error: 'Error al actualizar el hero' });
  }
});
 
// ── DELETE /api/hero/:id ───────────────────────────────────────────
// Elimina un registro de la tabla hero
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM hero WHERE id = ?', [id]);
    res.json({ mensaje: 'Hero eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE /hero:', error);
    res.status(500).json({ error: 'Error al eliminar el hero' });
  }
});
 
module.exports = router;
