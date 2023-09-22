"use strict";
const StatusCode = {
  OK: 200,
  CREATED: 201,
};
const ReasonStatusCode = {
  OK: "SUCCESS",
  CREATED: "CREATED",
};
class ErrorRespone extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
class SuccessResponse {
  constructor(message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}
class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}
class CREATED extends SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata = {},
    options = {}
  ) {
    super({ message, metadata });
    this.options = options;
  }
}
export { OK, CREATED,SuccessResponse };
