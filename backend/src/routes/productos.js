// src/routes/productos.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');
 
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE activo = TRUE');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
router.get('/todos', async (req, res) => {
  try {
    // Esta ruta devuelve TODOS los productos (activos e inactivos)
    // La usará el panel admin para ver todos
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categoria } = req.body;
    const [result] = await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria) VALUES (?,?,?,?,?)',
      [nombre, descripcion, precio, imagen_url, categoria]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categoria, activo } = req.body;
    await db.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen_url=?, categoria=?, activo=? WHERE id=?',
      [nombre, descripcion, precio, imagen_url, categoria, activo, req.params.id]
    );
    res.json({ mensaje: 'Actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
module.exports = router;
