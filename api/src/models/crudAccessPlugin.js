const { NotFound } = require("../utils/errors");

// ----------------------------------------------------------------------------

module.exports = (schema, _options) => {
  schema.statics.getDocument = async function (id, appliedPermissions) {
    let doc = appliedPermissions.restrictToOwner
      ? await this.findOne({ _id: id, owner: appliedPermissions.userId })
      : await this.findOne({ _id: id });

    if (!doc) throw new NotFound("Resource is unreachable");

    return doc;
  };

  schema.statics.getQuery = function (appliedPermissions) {
    let query = appliedPermissions.restrictToOwner
      ? this.find({ owner: appliedPermissions.userId })
      : this.find();

    return query;
  };
};
