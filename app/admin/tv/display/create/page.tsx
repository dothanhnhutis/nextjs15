import { Metadata } from "next";
import React from "react";
import CreateDisplayForm from "./form";
import { cookies } from "next/headers";
import { getDepartments } from "@/services/department.service";
export const metadata: Metadata = {
  title: "Tạo Hiển Thị",
};
const CreateDisplayPage = async () => {
  const cookieStore = await cookies();
  const departments = await getDepartments({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-md px-4">
      <h3 className="text-xl font-bold">Tạo hiển thị</h3>
      <CreateDisplayForm departments={departments} />
    </div>
  );
};

export default CreateDisplayPage;
