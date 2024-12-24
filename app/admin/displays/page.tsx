import { filterDisplaysService } from "@/services/display.service";
import { PlusIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import DisplayItem from "./display-item";
import { Metadata } from "next";
import { updateDisplayAction } from "./actions";
import DisplayFilter from "./display-filter";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="flex items-center justify-between px-2 mx-auto max-w-screen-lg">
        <div className="flex-1 text-sm text-muted-foreground">
          {10} of {10} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
            // value={`${table.getState().pagination.pageSize}`}
            // onValueChange={(value) => {
            //   table.setPageSize(Number(value))
            // }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={10} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {1} of {10}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              // onClick={() => table.setPageIndex(0)}
              // disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() => table.previousPage()}
              // disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              // onClick={() => table.nextPage()}
              // disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              // onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              // disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DisplayPage;
