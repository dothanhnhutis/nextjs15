"use server";

import { deleteSessionByIdService } from "@/services/users.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteSessionByIdAction(id: string) {
  const cookieStore = await cookies();
  const status = await deleteSessionByIdService(id, {
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });
  revalidatePath("/sessions");

  return {
    success: status,
    message: status
      ? "Xoá phiên đăng nhập thành công"
      : "Xoá phiên đăng nhập thất bại",
  };
}
