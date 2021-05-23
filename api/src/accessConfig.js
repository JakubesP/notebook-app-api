const { AccessControl } = require("accesscontrol");

exports.roles = (() => {
  const ac = new AccessControl();

  // owner rights
  ac.deny("guest");

  // user rights
  ac.grant("user")
    .createOwn("note", ["*", "!owner", "!_id", "!createdAt", "!updatedAt"])
    .readOwn("note")
    .updateOwn("note", ["*", "!owner", "!_id", "!createdAt", "!updatedAt"])
    .deleteOwn("note")

    .createOwn("upload")
    .readOwn("upload")
    .deleteOwn("upload")

    .readOwn("user")
    .updateOwn("user")
    .deleteOwn("user");

  // admin rights
  ac.grant("admin")
    .extend("user")
    .readAny("user")
    .createAny("user", ["*", "!_id", "!createdAt", "!updatedAt"])
    .deleteAny("user");

  return ac;
})();
