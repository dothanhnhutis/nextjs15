import { getDepartments } from "@/services/department.service";
import { getDisplaysService } from "@/services/display.service";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import DisplayItem from "./display-item";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Màn Hình",
};

const TVPage = async () => {
  const cookieStore = await cookies();

  const departments = await getDepartments({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  const { data: displays } = await getDisplaysService({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  return (
    <main className="flex gap-4">
      <div className="px-2 w-[200px] sticky left-0 top-[64px] h-[calc(100vh_-_64px)] ">
        <div className="flex items-center px-2">
          <p className="text-sm font-semibold w-full">Phòng ban</p>
          <button type="button">
            <PlusIcon className="shrink-0 size-4" />
          </button>
        </div>
        <div className="grid gap-2 mt-2">
          {departments.map((d) => (
            <button
              key={d.id}
              type="button"
              className="text-start bg-accent px-2 py-1 rounded-md"
            >
              <span>{d.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 sticky right-0 top-[64px] z-10 bg-white px-2">
          <h3 className="text-xl font-bold w-full">Hiển Thị</h3>
          <Link href={"/admin/tv/displays/create"}>
            <PlusIcon className="shrink-0 size-4" />
          </Link>
        </div>
        <div className="grid gap-2 mt-2 pb-4 px-2 mx-auto max-w-screen-lg">
          {displays.map((d) => (
            <DisplayItem key={d.id} data={d} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default TVPage;
