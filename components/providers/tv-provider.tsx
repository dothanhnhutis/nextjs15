"use client";
import envs from "@/configs/envs";
import { createSocket } from "@/lib/socket";
import React from "react";
import { Socket } from "socket.io-client";
interface ITaskContext {
  connected: boolean;
  socket: Socket | null;
  departmentId: string | null;
  setDeparment: (departmentId: string) => void;
  pinDepartmentId: string | null;
  setPinDeparment: (departmentId: string | null) => void;
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
  pinDepartmentId,
  departmentId,
}: {
  children?: React.ReactNode;
  pinDepartmentId?: string;
  departmentId: string | null;
}) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [department, setDepartment] = React.useState<string | null>(
    departmentId
  );
  const [pinDepartment, setPinDepartment] = React.useState<string | null>(
    pinDepartmentId ?? null
  );

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
        namespace: "display",
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

  React.useEffect(() => {
    if (socket && department) {
      socket.emit("joinDepartment", department);
    }
  }, [socket, department]);

  const handleChangeDepartment = (departmentId: string) => {
    setDepartment(departmentId);
    // if (!socket) return;
    // socket.emit("joinPlanRoom", planId);
  };

  const handlePinDepartment = (departmentId: string | null) => {
    if (departmentId) {
      document.cookie = `deparment:pin=${departmentId}; path=/;`;
    } else {
      document.cookie =
        "deparment:pin=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    setPinDepartment(departmentId);
  };

  return (
    <TVContext.Provider
      value={{
        connected,
        socket,
        departmentId: department,
        setDeparment: handleChangeDepartment,
        pinDepartmentId: pinDepartment,
        setPinDeparment: handlePinDepartment,
      }}
    >
      {children}
    </TVContext.Provider>
  );
}
