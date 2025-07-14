const jwt = require('jsonwebtoken');

/**
 * Middleware untuk memverifikasi token JWT.
 * Jika valid, data pengguna akan ditambahkan ke object `req`.
 */
exports.authMiddleware = (req, res, next) => {
  // Ambil token dari header Authorization, formatnya: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia atau format salah.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token menggunakan secret key dari .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan payload token (berisi id dan role) ke request
    next(); // Lanjutkan ke controller/middleware berikutnya
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

/**
 * Middleware untuk memastikan pengguna adalah admin.
 * Harus digunakan *setelah* authMiddleware.
 */
exports.adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Pengguna adalah admin, lanjutkan
  } else {
    res.status(403).json({ message: 'Akses ditolak. Rute ini hanya untuk admin.' });
  }
};