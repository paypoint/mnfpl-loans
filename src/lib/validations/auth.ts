import * as z from "zod";

export const authSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, {
      message: "Mobile Number must be 10 digits long",
    })
    .max(10)
    .regex(/^[6-9]\d{9}$/, { message: "Please enter valid mobile number" }),
  otp: z
    .string()
    .min(6, {
      message: "OTP must be at least 6 digits long",
    })
    .max(6)
    .regex(/^[0-9]{6}$/, {
      message: "Please enter valid otp",
    }),
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
});

// export const checkEmailSchema = z.object({
//   email: authSchema.shape.email,
// });

// export const resetPasswordSchema = z
//   .object({
//     password: authSchema.shape.password,
//     confirmPassword: authSchema.shape.password,
//     code: verifyEmailSchema.shape.code,
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

export const userPrivateMetadataSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]),
  stripePriceId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeCurrentPeriodEnd: z.string().optional().nullable(),
});
