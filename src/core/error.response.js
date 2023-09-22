"use strict";

import { ReasonPhrases, StatusCodes } from "../utils/httpStatusCode.js";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};
const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict error",
};
class ErrorRespone extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
class ConflictRequestError extends ErrorRespone {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorRespone {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}
class AuthFailureError extends ErrorRespone {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorRespone {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}
class ForbiddenError extends ErrorRespone {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}
export { ConflictRequestError, BadRequestError, NotFoundError, AuthFailureError ,ForbiddenError };
