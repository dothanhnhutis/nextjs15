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
import { audioPath } from "@/configs/constants";
import { extensions } from "@/components/tiptap/components/schema";

const DisplayItem = ({ data }: { data: Display }) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content: data.content,
  });

  const [isNew, setIsNew] = React.useState<boolean>(false);

  React.useEffect(() => {
    let id: NodeJS.Timeout;
    if (Date.now() - new Date(data.updatedAt).getTime() < 60000) {
      setIsNew(true);
      id = setTimeout(() => {
        setIsNew(false);
      }, 60000 - (Date.now() - new Date(data.updatedAt).getTime()));
    }
    return () => clearTimeout(id);
  }, [data]);

  React.useEffect(() => {
    if (editor) {
      editor.commands.setContent(data.content, false);
    }
  }, [data.content, editor]);

  if (!data.enable) return;

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
  const {
    connected,
    departmentsData,
    selectedId,
    isAudioAllowed,
    setAccessAudio,
    socket,
  } = useTV();
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

  const sortDisplays = (array: Display[]) => {
    return array.sort((a, b) => {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority < b.priority) {
        return 1;
      } else {
        if (new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()) {
          return -1;
        } else if (
          new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime()
        ) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  };

  const handleCreateDisplay = React.useCallback(
    (data: Display) => {
      setDisplays(sortDisplays([data, ...displays]));
      if (isAudioAllowed) {
        const audio = new Audio(audioPath);
        audio.play();
      }
    },
    [displays, isAudioAllowed]
  );

  const handleUpdateDisplay = React.useCallback(
    (data: Display) => {
      setDisplays(
        sortDisplays(displays.map((d) => (d.id == data.id ? data : d)))
      );
      if (isAudioAllowed) {
        const audio = new Audio(audioPath);
        audio.play();
      }
    },
    [displays, isAudioAllowed]
  );

  React.useEffect(() => {
    if (socket) {
      socket.on("createDisplay", handleCreateDisplay);
      socket.on("updateDisplay", handleUpdateDisplay);
    }

    return () => {
      if (socket) {
        socket.off("createDisplay", handleCreateDisplay);
        socket.off("updateDisplay", handleUpdateDisplay);
      }
    };
  }, [socket, handleCreateDisplay, handleUpdateDisplay]);

  if (!selectedId)
    return (
      <div className="flex flex-col relative h-screen overflow-hidden">
        <div className="bg-white p-2">
          <div className="flex items-center gap-2 w-full">
            <button type="button" onClick={toggleSidebar} className="p-2">
              <PanelLeftIcon className="size-6 shrink-0 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="h-full flex w-full items-center justify-center">
          <p>Không có phòng ban nào</p>
        </div>
      </div>
    );

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
            {!isAudioAllowed && (
              <button
                onClick={setAccessAudio}
                type="button"
                className="rounded-full p-2 shadow-md"
              >
                <VolumeOffIcon className="shrink-0 size-6 text-muted-foreground" />
              </button>
            )}

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
            <DisplayItem key={d.id} data={d} />
          ))}
        </main>
      </ScrollArea>
    </div>
  );
};

export default DisplayContainer;
