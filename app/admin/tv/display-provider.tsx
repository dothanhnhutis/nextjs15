"use client";
import React from "react";
import {
  createdDisplayService,
  Display,
  getDisplaysService,
  updateDisplayService,
} from "@/services/display.service";
import { CreateDisplay, UpdateDisplay } from "@/schema/display.schema";
import { toast } from "sonner";

type DisplayContext = {
  displays: Display[];
  updateDisplay: (id: string, data: UpdateDisplay) => Promise<void>;
  createDisplay: (data: CreateDisplay) => Promise<void>;
};
const DisplayContext = React.createContext<DisplayContext | null>(null);

type DisplayProviderProps = {
  children?: React.ReactNode;
};

type DisplayFilter = {
  enable?: boolean;
  priority?: number;
  createdAt?: [Date, Date];
  departmentIds?: string[];
};

export function DisplayProvider({ children }: DisplayProviderProps) {
  const [displays, setDisplays] = React.useState<Display[]>([]);
  const [filter, setFilter] = React.useState<DisplayFilter>({
    enable: true,
    priority: 0,
    createdAt: [new Date(), new Date()],
  });

  React.useEffect(() => {
    const handleInit = async () => {
      const { data } = await getDisplaysService();
      setDisplays(data);
    };
    handleInit();
  }, [filter]);

  const handleUpdateDisplay = async (
    displayId: string,
    data: UpdateDisplay
  ) => {
    try {
      await updateDisplayService(displayId, data);
      setDisplays(
        displays.map((display) =>
          display.id == displayId ? { ...display, ...data } : display
        )
      );
      toast.success("Cập nhật hiển thị thành công");
    } catch (error: unknown) {
      console.log(error);
      toast.success("Cập nhật hiển thị thất bại");
    }
  };

  const handleCreateDisplay = async (data: CreateDisplay) => {
    try {
      await createdDisplayService(data);
      //   setDisplays(
      //     displays.map((display) =>
      //       display.id == displayId ? { ...display, ...input } : display
      //     )
      //   );
      toast.success("Tạo hiển thị thành công");
    } catch (error: unknown) {
      console.log(error);
      toast.success("Tạo hiển thị thất bại");
    }
  };

  return (
    <DisplayContext.Provider
      value={{
        displays,
        updateDisplay: handleUpdateDisplay,
        createDisplay: handleCreateDisplay,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
}

export const useDisplay = () => {
  const context = React.useContext(DisplayContext);
  if (!context) {
    throw new Error("useDisplay must be used within a DisplayProvider.");
  }
  return context;
};
