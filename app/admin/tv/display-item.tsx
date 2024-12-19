"use client";
import { extensions } from "@/components/tiptap/components/schema";
import { cn } from "@/lib/utils";
import { Display } from "@/services/display.service";
import { EditorContent, useEditor } from "@tiptap/react";
import { format } from "date-fns";
import React from "react";

const DisplayItem = ({ data }: { data: Display }) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content: data.content,
  });

  return (
    <div className={cn("p-2 border bg-white rounded-[10px]")}>
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-4 items-center">
        <p className="text-xs text-muted-foreground">
          {`Priority: ${data.priority}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {`CreateAt: ${format(data.createdAt, "dd/MM/yy HH:mm")}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {`UpdatedAt: ${format(data.updatedAt, "dd/MM/yy HH:mm")}`}
        </p>
      </div>
    </div>
  );
};

export default DisplayItem;
