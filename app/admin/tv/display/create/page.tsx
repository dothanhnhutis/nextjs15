import { Metadata } from "next";
import React from "react";
import CreateDisplayForm from "./form";
export const metadata: Metadata = {
  title: "Tạo Hiển Thị",
};
const CreateDisplayPage = () => {
  return (
    <div className="mx-auto w-full max-w-screen-md px-4">
      <h3 className="text-xl font-bold">Tạo hiển thị</h3>
      <CreateDisplayForm />
    </div>
  );
};

export default CreateDisplayPage;
