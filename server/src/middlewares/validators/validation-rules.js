import { body, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { toTitleCase } from "../../utils/general-utils.js";

export function createFieldValidator(
  fields,
  minLength = 1,
  customValidators = []
) {
  const fieldList = Array.isArray(fields) ? fields : [fields];
  customValidators = Array.isArray(customValidators)
    ? customValidators
    : [customValidators];

  return fieldList.map((field) => {
    let fieldName = toTitleCase(field.split(".").pop());
    fieldName = fieldName.includes("_")
      ? fieldName.replace("_", " ")
      : fieldName;
    const validator = body(field)
      .exists()
      .withMessage(`${fieldName} is required`)
      .bail()
      .notEmpty()
      .withMessage(`${fieldName} is invalid`)
      .bail()
      .isLength({ min: minLength })
      .withMessage(`${fieldName} must be at least ${minLength} characters`)
      .bail();

    customValidators.forEach((customValidator) => {
      validator.custom(customValidator).bail();
    });

    return validator;
  });
}

export function handleValidationErrors(req, _, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  //   next(new BadRequestError(errors.array()[0].msg));
  const errorMsg = errors.array()[0].msg;
  if (
    errorMsg.includes("is required") ||
    errorMsg.includes("exist") ||
    errorMsg.includes("invalid")
  )
    return next(new NotFoundError(errorMsg));
  return next(new BadRequestError(errorMsg));
}
