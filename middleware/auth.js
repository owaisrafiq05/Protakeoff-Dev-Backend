const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Auth middleware - authHeader:', authHeader);
  console.log('Auth middleware - token:', token);
  
  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth middleware - token verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports.adminOnly = function (req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}; 