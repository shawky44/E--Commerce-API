import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  category: z.string().min(2),
  newPrice: z.coerce.number().min(0),
  oldPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0).optional(),
  description: z.string().min(5),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Name is too short").optional(),
  category: z.string().min(2).optional(),
  newPrice: z.coerce.number().min(0).optional(),
  oldPrice: z.coerce.number().min(0).optional(),
  quantity: z.coerce.number().min(0).optional(),
  description: z.string().min(5).optional(),
});

import Joi from "joi";
export const signupSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: { allow: ["com", "net", "org", "edu"] },
    })
    .min(5)
    .required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,25}$"
      ),
      "Password must be 6-25 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required(),
});

export const acceptCodeSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: { allow: ["com", "net", "org", "edu"] },
    })
    .min(5)
    .required(),
  providedCode: Joi.number().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,25}$"
      ),
      "Password must be 6-25 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required(),
  newPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,25}$"
      ),
      "Password must be 6-25 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required(),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: { allow: ["com", "net", "org", "edu"] },
    })
    .min(5)
    .required(),
  providedCode: Joi.number().required(),
  newPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,25}$"
      ),
      "Password must be 6-25 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    )
    .required(),
});

export const siginSchema = signupSchema;


export const cartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1")
})



export const validate = (schema) => (req, res, next) => {
  try {
    // إذا كنت تريد التحقق من req.body فقط
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err.issues) { // ZodError
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      });
    }
    
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      error: err.message
    });
  }
};