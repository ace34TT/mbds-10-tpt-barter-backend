import { ZodError, ZodIssueCode } from "zod";

export const extractZodErrors = (zodError: ZodError): string[] => {
  if (!(zodError instanceof ZodError)) {
    return ["Invalid Zod error object"];
  }

  return zodError.errors.map((error) => {
    const field = error.path.join(".");
    const { message, code } = error;

    switch (code) {
      case ZodIssueCode.invalid_type:
        if (error.received === "undefined") {
          return `${field} is required`;
        }
        return `${field} should be of type ${error.expected}`;

      case ZodIssueCode.invalid_enum_value:
        const options = (error as any).options;
        return `${field} must be one of: ${options.join(", ")}`;

      case ZodIssueCode.invalid_string:
        if (error.validation === "email") {
          return `${field} must be a valid email address`;
        } else if (error.validation === "url") {
          return `${field} must be a valid URL`;
        }
        return `${field}: ${message}`;

      case ZodIssueCode.too_small:
        const min = (error as any).minimum;
        if (error.type === "string") {
          return `${field} should be at least ${min} character(s) long`;
        } else if (error.type === "number") {
          return `${field} should be greater than or equal to ${min}`;
        }
        return `${field}: ${message}`;

      case ZodIssueCode.too_big:
        const max = (error as any).maximum;
        if (error.type === "string") {
          return `${field} should be at most ${max} character(s) long`;
        } else if (error.type === "number") {
          return `${field} should be less than or equal to ${max}`;
        }
        return `${field}: ${message}`;

      case ZodIssueCode.invalid_date:
        return `${field} is not a valid date`;

      case ZodIssueCode.invalid_union:
        return `${field} is not a valid option`;

      case ZodIssueCode.custom:
        return message || `${field} is invalid`;

      default:
        return `${field}: ${message}`;
    }
  });
};
