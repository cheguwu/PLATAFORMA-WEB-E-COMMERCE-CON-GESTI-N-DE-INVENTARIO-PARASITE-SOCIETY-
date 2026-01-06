const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middlewares/upload');
const path = require('path');

// Crear producto
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
const imagen = req.file ? `uploads/${req.file.filename}` : '';

    const nuevoProducto = new Product({ nombre, descripcion, precio, imagen });
    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;
