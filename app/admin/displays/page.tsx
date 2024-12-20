import { getDisplaysService } from "@/services/display.service";
import { FilterIcon, PlusIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import DisplayItem from "./display-item";

type DisplayFilter = {
  enable?: boolean;
  priority?: number;
  createdAt?: [Date, Date];
  departmentIds?: string[];
};

type DisplayPageProps = {
  searchParams: Awaited<{
    enable?: boolean;
  }>;
};

const DisplayPage = async ({ searchParams }: DisplayPageProps) => {
  const cookieStore = await cookies();
  const { enable = true } = await searchParams;

  const { data: displays } = await getDisplaysService({
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  console.log(displays);

  return (
    <main>
      <div className="flex items-center gap-2 sticky right-0 top-[64px] z-10 bg-white px-2">
        <h3 className="text-3xl font-bold w-full">Hiển Thị</h3>
        <button type="button" className="border rounded-md p-1 hover:bg-accent">
          <FilterIcon className="shrink-0 size-5" />
        </button>

        <Link
          href={"/admin/tv/displays/create"}
          className="border rounded-md p-1 hover:bg-accent"
        >
          <PlusIcon className="shrink-0 size-5" />
        </Link>
      </div>
      <div className="grid gap-2 mt-2 pb-4 px-2 mx-auto max-w-screen-lg">
        {displays.map((d) => (
          <DisplayItem key={d.id} data={d} />
        ))}
      </div>
    </main>
  );
};

export default DisplayPage;
