const verifyUserAdmmin = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        message: `sory ${req.user.role} cannot access this route`,
      });
    }
    next();
  };
};

module.exports = verifyUserAdmmin;
