"use client";
import { extensions } from "@/components/tiptap/components/schema";
import { cn } from "@/lib/utils";
import { Display } from "@/services/display.service";
import { EditorContent, useEditor } from "@tiptap/react";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

const DisplayItem = ({ data }: { data: Display }) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content: data.content,
  });

  if (!editor) return;

  return (
    <div className={cn("p-2 border bg-white rounded-[10px]")}>
      <EditorContent editor={editor} />
      <div className="flex flex-wrap justify-between gap-4 items-center mt-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/tv/displays/${data.id}`}
            className="text-sm border px-2 py-1 rounded-md border-primary text-primary"
          >
            Chỉnh sửa
          </Link>
          <Link
            href={`/admin/tv/displays/${data.id}`}
            className="text-sm border px-2 py-1 rounded-md border-destructive text-destructive"
          >
            Ẩn
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {`Priority: ${data.priority}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`CreateAt: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`UpdatedAt: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayItem;
