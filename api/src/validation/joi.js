const { BadRequest } = require("../utils/errors");

// ----------------------------------------------------------------------------

exports.validate = async (schema, payload) => {
  try {
    await schema.validateAsync(payload, { abortEarly: false });
  } catch (e) {
    throw new BadRequest(e);
  }
};
