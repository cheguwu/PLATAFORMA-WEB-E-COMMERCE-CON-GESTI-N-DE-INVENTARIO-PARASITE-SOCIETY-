// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ msg: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token inválido' });
    }
}

function verifyAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ msg: 'Acceso denegado: no eres administrador' });
    }
    req.user.role === 'admin'
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Acceso denegado: no eres administrador' });
    }
}

module.exports = { verifyToken, verifyAdmin };
