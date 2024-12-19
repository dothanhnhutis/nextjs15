import { getDepartments } from "@/services/department.service";
import { getDisplayByIdService } from "@/services/display.service";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import UpdateDisplayForm from "./form";

const EditDisplayPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const cookieStore = await cookies();

  const display = await getDisplayByIdService(id, {
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });
  const departments = await getDepartments({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });
  if (!display) return notFound();

  return (
    <div className="mx-auto w-full max-w-screen-md px-4">
      <h3 className="text-xl font-bold">Chỉnh sửa hiển thị</h3>
      <UpdateDisplayForm departments={departments} display={display} />
    </div>
  );
};

export default EditDisplayPage;
