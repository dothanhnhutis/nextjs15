import { filterDisplaysService } from "@/services/display.service";
import { PlusIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import DisplayItem from "./display-item";
import { Metadata } from "next";
import { updateDisplayAction } from "./actions";
import DisplayFilter from "./display-filter";

type DisplayPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Hiển thị",
};

const DisplayPage = async (props: DisplayPageProps) => {
  const cookieStore = await cookies();
  const searchParams = await props.searchParams;
  const {
    data: { displays },
  } = await filterDisplaysService(searchParams, {
    headers: {
      cookie: cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("; "),
    },
  });

  return (
    <main>
      <div className="flex items-center gap-2 sticky right-0 top-[64px] z-10 bg-white px-2">
        <h3 className="text-3xl font-bold w-full">Hiển Thị</h3>
        <DisplayFilter />
        <Link
          href={"/admin/displays/create"}
          className="border rounded-md p-1 hover:bg-accent"
        >
          <PlusIcon className="shrink-0 size-5" />
        </Link>
      </div>
      <div className="grid gap-2 mt-2 pb-4 px-2 mx-auto max-w-screen-lg">
        {displays.map((d) => (
          <DisplayItem key={d.id} data={d} action={updateDisplayAction} />
        ))}
      </div>
    </main>
  );
};

export default DisplayPage;
