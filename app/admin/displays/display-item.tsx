"use client";
import { cn } from "@/lib/utils";
import { Display } from "@/services/display.service";
import { format } from "date-fns";
import { EllipsisIcon } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
// import { toast } from "sonner";
// import { updateDisplayAction } from "./actions";

const DisplayItem = ({ data }: { data: Display }) => {
  // const [isPending, startTransition] = React.useTransition();

  const handleSave = () => {
    // startTransition(async () => {
    // try {
    //   await updateDisplayAction(data.id, {
    //     enable: !data.enable,
    //   });
    //   toast.success("Ẩn hiển thị thành công");
    // } catch (error: unknown) {
    //   console.log(error);
    //   toast.error("Ẩn hiển thị thất bại");
    // }
    // });
  };

  return (
    <div className={cn("p-2 border bg-white rounded-[10px] relative")}>
      <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 border rounded-full p-2">
            <EllipsisIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-20">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/admin/tv/displays/" + data.id}>Chỉnh sửa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSave}>
              {data.enable ? "Ẩn" : "Hiện"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-wrap justify-between gap-4 items-center mt-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {`${data.departments.map((d) => d.name).join(", ")}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {`enable: ${data.enable}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Ưu tiên: ${data.priority}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Ngày tạo: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Cập nhật cuối: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayItem;
