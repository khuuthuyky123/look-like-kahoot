const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const accessToken = req.headers['authorization'];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY || 'SECRET_KEY');
      console.log(decoded);
      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        message: 'Invalid accessToken'
      });
    }
  } else {
    return res.status(401).json({
      message: 'AccessToken not found.'
    })
  }
}