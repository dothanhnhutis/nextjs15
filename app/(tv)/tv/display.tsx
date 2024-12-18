"use client";
import React from "react";
import { useTV } from "@/components/providers/tv-provider";
import { cn } from "@/lib/utils";
import { PanelLeftIcon, VolumeOffIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Display,
  getDisplaysOfDepartment,
} from "@/services/department.service";
import { format } from "date-fns";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "@/components/tiptap/schema";

const DisplayItem = (data: Display) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content: data.content,
    
  });

  const [isNew, setIsNew] = React.useState<boolean>(
    Date.now() - new Date(data.createdAt).getTime() < 60000
  );


  React.useEffect(() => {
    let id: NodeJS.Timeout;
    if (isNew) {
      id = setTimeout(() => {
        setIsNew(false);
      }, 60000 - (Date.now() - new Date(data.createdAt).getTime()));
    }

    return () => clearTimeout(id);
  }, [data.createdAt, isNew]);

  return (
    <div
      className={cn(
        "p-2 border bg-white rounded-[10px]",
        isNew ? "animation-border" : ""
      )}
    >
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

const DisplayContainer = () => {
  const { connected, departmentsData, selectedId,isAudioAllowed,setAccessAudio } = useTV();
  const { toggleSidebar } = useSidebar();

  const departmentName = React.useMemo(() => {
    return departmentsData.find(({ id }) => id == selectedId);
  }, [departmentsData, selectedId]);

  const [displays, setDisplays] = React.useState<Display[]>([]);

  React.useEffect(() => {
    const handleFetch = async () => {
      setDisplays(selectedId ? await getDisplaysOfDepartment(selectedId) : []);
    };
    handleFetch();
  }, [selectedId]);

  if(!selectedId)
    return (
      <div className="flex flex-col relative h-screen overflow-hidden">
        <div className="bg-white p-2">
        <div className="flex items-center gap-2 w-full">
           <button type="button" onClick={toggleSidebar} className="p-2">
             <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
           </button>
         </div>
        </div>
        <div className="h-full flex w-full items-center justify-center"><p>Không có phòng ban nào</p></div>
      </div>
  )

  return (
    <div className="flex flex-col relative h-screen overflow-hidden">
      <div className="bg-white p-2">
        <div className="flex items-center gap-2 w-full">
          <button type="button" onClick={toggleSidebar} className="p-2">
            <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
          </button>

          <h4 className="text-lg font-semibold text-back line-clamp-2 w-full">
            {departmentName?.name ?? "error"}
          </h4>
          <div className="flex items-center gap-2">
            {
              !isAudioAllowed && <button onClick={setAccessAudio} type="button" className="rounded-full p-2 shadow-md">
              <VolumeOffIcon className="shrink-0 size-6 text-muted-foreground" />
            </button>
            }
            
            <div
              className={cn(
                "size-2 rounded-full shrink-0",
                connected ? "bg-green-300" : "bg-red-300"
              )}
            />
          </div>
        </div>
      </div>

      <ScrollArea className="h-full">
        <main className="flex flex-col gap-1 p-1 h-full relative z-0">
          {displays.map((d) => (
            <DisplayItem key={d.id} {...d} />
          ))}
        </main>
      </ScrollArea>
    </div>
  );
};

export default DisplayContainer;