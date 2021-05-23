const Joi = require("@hapi/joi");

// ----------------------------------------------------------------------------

const title = Joi.string().max(254).trim().required();
const content = Joi.string().required();

// ----------------------------------------------------------------------------

exports.noteSchema = Joi.object({
  title,
  content,
});
