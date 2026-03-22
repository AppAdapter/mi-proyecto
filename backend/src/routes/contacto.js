// src/routes/contacto.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');
 
// GET todos los mensajes (solo admin los ve)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacto ORDER BY creado_en DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// POST enviar mensaje de contacto (lo usa el formulario de la landing)
router.post('/', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    await db.query(
      'INSERT INTO contacto (nombre, email, mensaje) VALUES (?,?,?)',
      [nombre, email, mensaje]
    );
    res.status(201).json({ mensaje: 'Mensaje enviado correctamente' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
// DELETE eliminar mensaje
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM contacto WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
 
module.exports = router;
