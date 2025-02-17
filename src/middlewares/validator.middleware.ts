import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import logger from "../services/logger.service";

const validate = (validations: ValidationChain[]) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(request)));
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      return next();
    }
    logger.error(`Error in validation: ${errors.array()[0].msg}`);

    response.status(400).json({
      ...errors.array()[0],
      status: 400,
      statusCode: "Bad Request", // Fix typo here
      success: false,
    });
  };
};

export default validate;
