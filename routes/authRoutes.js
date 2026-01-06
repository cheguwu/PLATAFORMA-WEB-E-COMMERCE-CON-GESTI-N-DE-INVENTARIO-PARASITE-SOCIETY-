// backend/routes/authRoutes.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const router   = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'El email ya está en uso.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashed,
      role: role === 'admin' ? 'admin' : 'user'
    });
    await newUser.save();
    res.status(201).json({ msg: 'Usuario registrado exitosamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar usuario.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado.' });

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ msg: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      msg: 'Inicio de sesión exitoso.',
      token,
      userId: user._id,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en login de usuario.' });
  }
});

module.exports = router;
