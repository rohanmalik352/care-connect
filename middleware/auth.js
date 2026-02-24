const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/auth/login');
};

const ensureDoctor = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'doctor') return next();
  req.flash('error', 'Access restricted to doctors.');
  res.redirect('/');
};

const ensurePatient = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'patient') return next();
  req.flash('error', 'Access restricted to patients.');
  res.redirect('/');
};

const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') return next();
  req.flash('error', 'Access restricted to admins.');
  res.redirect('/');
};

module.exports = { ensureAuthenticated, ensureDoctor, ensurePatient, ensureAdmin };