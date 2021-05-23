module.exports = (success, body = {}) => {
  return { success: success ? 1 : 0, ...body };
};
