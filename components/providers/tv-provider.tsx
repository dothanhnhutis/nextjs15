"use client";
import envs from "@/configs/envs";
import { createSocket } from "@/lib/socket";
import { Department } from "@/services/department.service";
import React from "react";
import { Socket } from "socket.io-client";
interface ITaskContext {
  connected: boolean;
  socket: Socket | null;
  selectedId: string | null;
  setSelectedId: (departmentId: string) => void;
  pinId: string | null;
  setPinId: (departmentId: string | null) => void;
  departmentsData: Department[];
}
const TVContext = React.createContext<ITaskContext | null>(null);

export const useTV = () => {
  const context = React.useContext(TVContext);
  if (!context) {
    throw new Error("useTV must be used within a TVProvider.");
  }
  return context;
};

export function TVProvider({
  children,
  defaultPinId,
  departments,
}: {
  children?: React.ReactNode;
  defaultPinId?: string | null;
  departments: Department[];
}) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const audio = new Audio("/mp3/bell.mp3");
  audio.load();

  const [selectedId, setSelectedId] = React.useState<string | null>(
    defaultPinId || (departments.length == 0 ? null : departments[0].id)
  );
  const [pinId, setPinId] = React.useState<string | null>(defaultPinId ?? null);

  const [data] = React.useState<Department[]>(departments);

  function onConnect() {
    console.log("onConnect");
    setConnected(true);
  }

  function onDisconnect() {
    console.log("onDisconnect");
    setConnected(false);
  }

  React.useEffect(() => {
    if (!socket) {
      const newSocket = createSocket({
        path: "/api/v1/socket.io",
        url: envs.NEXT_PUBLIC_SERVER_URL,
        namespace: "department",
        autoConnect: false,
      });
      setSocket(newSocket);
      newSocket.connect();

      newSocket.on("connect", onConnect);
      newSocket.on("disconnect", onDisconnect);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      }
    };
  }, [socket]);

  const handleCreateDisplay = (data: unknown) => {
    console.log(data);
    console.log(audio);
    audio.play();
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("createDisplay", handleCreateDisplay);
      // socket.on("emptyTask", onCreateTask);
    }

    return () => {
      if (socket) {
        socket.off("createDisplay", handleCreateDisplay);
        // socket.off("emptyTask", onCreateTask);
      }
    };
  }, [socket]);

  React.useEffect(() => {
    if (socket && selectedId) {
      socket.emit("joinDepartment", selectedId);
    }
    return () => {
      if (socket && selectedId) {
        socket.emit("leaveDepartment", selectedId);
      }
    };
  }, [socket, selectedId]);

  const handleSelected = (departmentId: string) => {
    setSelectedId(departmentId);
  };

  const handleSetPin = (departmentId: string | null) => {
    if (departmentId) {
      document.cookie = `deparment:pin=${departmentId}; path=/;`;
    } else {
      document.cookie =
        "deparment:pin=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    setPinId(departmentId);
  };

  return (
    <TVContext.Provider
      value={{
        connected,
        socket,
        selectedId,
        setSelectedId: handleSelected,
        pinId,
        setPinId: handleSetPin,
        departmentsData: data,
      }}
    >
      {children}
    </TVContext.Provider>
  );
}
