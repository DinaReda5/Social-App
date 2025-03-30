import { asyncHandler } from "../utilits/error/index.js";

export const validation = (schema) => {
  return (req, res, next) => {

    const inputData = { ...req.body, ...req.params, ...req.query };
    const result = schema.validate(inputData, { abortEarly: false });
    if (result?.error) {
      return res
        .status(409)
        .json({ message: "validation error", errors: result?.error.details });
    }

    next();
  };
};
