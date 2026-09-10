import { ZodError } from "zod";

import { validationError } from "../utils/errors.js";

function validate(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(validationError());
      }
      return next(error);
    }
  };
}

export { validate };