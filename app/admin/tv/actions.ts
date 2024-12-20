"use server";

import { UpdateDisplay } from "@/schema/display.schema";
import { updateDisplayService } from "@/services/display.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateDisplayAction(
  displayId: string,
  data: UpdateDisplay
) {
  const cookieStore = await cookies();
  try {
    await updateDisplayService(displayId, data, {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
          .join("; "),
      },
    });
    // revalidatePath("/admin/tv");
  } catch (error: unknown) {
    console.log(error);
  }
  revalidatePath("/admin/tv");
}
