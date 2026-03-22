// src/routes/servicios.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');
 
// GET todos los servicios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM servicios ORDER BY orden ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// GET un servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM servicios WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// POST crear servicio
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, icono, imagen_url, orden } = req.body;
    const [result] = await db.query(
      'INSERT INTO servicios (titulo, descripcion, icono, imagen_url, orden) VALUES (?,?,?,?,?)',
      [titulo, descripcion, icono, imagen_url, orden]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// PUT actualizar servicio
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, icono, imagen_url, activo, orden } = req.body;
    await db.query(
      'UPDATE servicios SET titulo=?, descripcion=?, icono=?, imagen_url=?, activo=?, orden=? WHERE id=?',
      [titulo, descripcion, icono, imagen_url, activo, orden, req.params.id]
    );
    res.json({ mensaje: 'Actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// DELETE eliminar servicio
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM servicios WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
module.exports = router;
