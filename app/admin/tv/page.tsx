import React from "react";
import { Metadata } from "next";
import { FilterIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { DisplayProvider } from "./display-provider";
import DisplayList from "./display-list";

export const metadata: Metadata = {
  title: "Màn Hình",
};

const TVPage = async () => {
  return (
    <DisplayProvider>
      <main>
        <div className="flex items-center gap-2 sticky right-0 top-[64px] z-10 bg-white px-2">
          <h3 className="text-3xl font-bold w-full">Hiển Thị</h3>
          <button
            type="button"
            className="border rounded-md p-1 hover:bg-accent"
          >
            <FilterIcon className="shrink-0 size-5" />
          </button>

          <Link
            href={"/admin/tv/displays/create"}
            className="border rounded-md p-1 hover:bg-accent"
          >
            <PlusIcon className="shrink-0 size-5" />
          </Link>
        </div>
        <DisplayList />
      </main>
    </DisplayProvider>
  );
};

export default TVPage;
