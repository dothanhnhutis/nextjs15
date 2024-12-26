"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { caculatorPagination, cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const DisplayPagination = (pagination: {
  count: number;
  page: number;
  hasNext: boolean;
  totalPages: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [take, setTake] = React.useState(10);

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const take = newSearchParams.get("take");
    setTake(take ? parseInt(take) : 10);
  }, [take, searchParams]);

  return (
    <div className="flex items-center justify-between my-2">
      <div className="flex items-center justify-center text-sm font-medium ">
        {`${(pagination.page - 1) * 1 + 1} - ${Math.min(
          pagination.page * 1,
          pagination.count
        )} trong số
    ${pagination.count}`}
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
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={pagination.page == 1}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", (pagination.page - 1).toString());
              router.push(pathname + "?" + newSearchParams.toString());
            }}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          {caculatorPagination({
            totalPage: pagination.totalPages,
            currentPage: pagination.page,
          }).map((p) =>
            p != -1 ? (
              <Button
                key={p}
                onClick={() => {
                  const newSearchParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newSearchParams.set("page", p.toString());
                  router.push(pathname + "?" + newSearchParams.toString());
                }}
                variant="outline"
                className={cn(
                  "h-8 w-8 p-0",
                  pagination.page == p ? "border-primary" : "hidden md:block"
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

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={!pagination.hasNext}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", (pagination.page + 1).toString());
              router.push(pathname + "?" + newSearchParams.toString());
            }}
          >
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

        <Select
          value={`${take}`}
          onValueChange={(v) => {
            const newSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            newSearchParams.set("take", v.toString());
            router.push(pathname + "?" + newSearchParams.toString());
          }}
        >
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
  );
};

export default DisplayPagination;
