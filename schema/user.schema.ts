import * as z from "zod";

export const updateProfileSchema = z
  .object({
    username: z.string({
      required_error: "tên người dùng là trường bắt buộc",
      invalid_type_error: "tên người dùng phải là chuỗi",
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable(),
    birthDate: z
      .string()
      .regex(
        /^\d{2}\/\d{2}\/\d{4}$/,
        "Ngày sinh không hợp lệ. Expected DD/MM/YYYY (30/10/2000)"
      )
      .refine((dateStr) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        if (year < 1) return false;
        if (month < 1 || month > 12) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        return day > 0 && day <= daysInMonth;
      }, "Ngày sinh không hợp lệ."),
    phoneNumber: z.string().length(10, "Số điện thoại không hợp lệ"),
  })
  .strip()
  .partial();

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

type UserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;

export type UserMFA = {
  secretKey: string;
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type OauthProvider = {
  provider: string;
  providerId: string;
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: UserStatus;
  username: string;
  gender: UserGender;
  picture: string | null;
  phoneNumber: string | null;
  birthDate: string | null;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
};

export type UserToken = {
  type: "emailVerification" | "recover" | "reActivate";
  session: string;
};
