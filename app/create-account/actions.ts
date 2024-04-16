"use server";
import { z } from "zod";

const checkUsername = (username: string) => {
  !username.includes("potato");
}

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

const formSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string.",
      required_error: "Username required."
    })
    .min(3, "Way too short.")
    .max(10, "That is too looooog")
    .trim()
    .toLowerCase()
    .transform((username) => `${username}⭐️`)
    .refine(
      checkUsername,
      "No potatoes allowed."
    ),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(10)
    .regex(
      passwordRegex,
      "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-"
    ),
  confirm_password: z.string().min(10),
})
  .superRefine((val, ctx) => {
    if (val.password !== val.confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Two passwords should be equal.",
        path: ["confirm_password"],
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}