class BadRequest extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.status = 400;
  }
}

class Unauthorized extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.status = 401;
  }
}

class NotFound extends Error {
  constructor(message = "Not found") {
    super(message);
    this.status = 404;
  }
}

class Forbidden extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.status = 403;
  }
}

class ServerError extends Error {
  constructor(message = "Internal server error") {
    super(message);
    this.status = 500;
  }
}

exports.BadRequest = BadRequest;
exports.Unauthorized = Unauthorized;
exports.NotFound = NotFound;
exports.Forbidden = Forbidden;
exports.ServerError = ServerError;
