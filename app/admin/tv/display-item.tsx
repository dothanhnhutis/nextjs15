"use client";
import { extensions } from "@/components/tiptap/components/schema";
import { cn } from "@/lib/utils";
import { Display } from "@/services/display.service";
import { EditorContent, useEditor } from "@tiptap/react";
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

const DisplayItem = ({ data }: { data: Display }) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content: data.content,
  });

  if (!editor) return;

  return (
    <div className={cn("p-2 border bg-white rounded-[10px] relative")}>
      <EditorContent editor={editor} />

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
            <DropdownMenuItem>Ẩn</DropdownMenuItem>
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
