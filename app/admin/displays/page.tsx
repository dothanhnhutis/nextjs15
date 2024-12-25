import { filterDisplaysService } from "@/services/display.service";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import DisplayItem from "./display-item";
import { Metadata } from "next";
import { updateDisplayAction } from "./actions";
import DisplayFilter from "./display-filter";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { caculatorPagination, cn } from "@/lib/utils";
import DisplaySort from "./display-sort";

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
        <DisplaySort />
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
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center justify-center text-sm font-medium ">
          0 of 10 row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 md:hidden"
              disabled={false}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" disabled={false}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            {caculatorPagination({
              totalPage: 10,
              currentPage: 1,
            }).map((p) =>
              p != -1 ? (
                <Button
                  key={p}
                  variant="outline"
                  className={cn(
                    "h-8 w-8 p-0",
                    1 == p ? "border-primary" : "hidden md:block"
                  )}
                >
                  <span>{p}</span>
                </Button>
              ) : (
                <div
                  key={p}
                  className="h-8 w-8 cursor-not-allowed border rounded-lg md:flex justify-center bg-background opacity-50 items-center hidden"
                >
                  <span className="sr-only">More pages</span>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </div>
              )
            )}

            <Button variant="outline" className="h-8 w-8 p-0" disabled={false}>
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 md:hidden"
              disabled={false}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <Select value={`${50}`}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder={"10 / page"} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </main>
  );
};

export default DisplayPage;
