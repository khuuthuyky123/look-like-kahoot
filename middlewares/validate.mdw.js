const Ajv = require('ajv');
const addFormats = require("ajv-formats");

module.exports = function (schema) {
  return function validate(req, res, next) {
    const ajv = new Ajv();
    addFormats(ajv);
    addFormats(ajv, ["date"])
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      return res.status(400).json(ajv.errors);
    }

    next();
  }
}