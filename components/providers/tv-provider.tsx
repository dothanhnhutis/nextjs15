"use client";
import envs from "@/configs/envs";
import { createSocket } from "@/lib/socket";
import { Department } from "@/services/department.service";
import React from "react";
import { Socket } from "socket.io-client";


// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

interface ITaskContext {
  connected: boolean;
  socket: Socket | null;
  selectedId: string | null;
  setSelectedId: (departmentId: string) => void;
  pinId: string | null;
  setPinId: (departmentId: string | null) => void;
  departmentsData: Department[];
  isAudioAllowed:boolean
  setAccessAudio: () => void
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

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isAudioAllowed, setIsAudioAllowed] = React.useState(audioRef.current == null ? false : true);


  const [selectedId, setSelectedId] = React.useState<string | null>(
    defaultPinId || (departments.length == 0 ? null : departments[0].id)
  );
  const [pinId, setPinId] = React.useState<string | null>(defaultPinId ?? null);

  const [data] = React.useState<Department[]>(departments);

  React.useEffect(() => {
    const audio = new Audio("/mp3/bell.mp3");
    audioRef.current = audio;
  }, []);

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
    // const audio = new Audio("/mp3/bell.mp3")
   
   console.log(audioRef.current)
    audioRef.current?.play().then(() => {
      // audio.pause()
      console.log("Audio permission granted");
    }).catch(err => {
      console.log(err)
    });
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

  const handleAccessAudio = () => {
    const audio = new Audio("/mp3/bell.mp3");
    audio.play()
      .then(() => {
        audio.pause(); // Dừng ngay để tránh phát âm thanh không cần thiết
        audioRef.current = audio; // Lưu tham chiếu audio
        setIsAudioAllowed(true); // Đánh dấu đã cấp quyền
        console.log("Quyền phát audio đã được cấp!");
      })
      .catch((err) => {
        console.error("Không thể xin quyền phát audio:", err);
      });
  }

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
        isAudioAllowed,
        setAccessAudio: handleAccessAudio
      }}
    >
      <video muted={false} autoPlay >
        <source src="https://www.youtube.com/watch?v=Ej7OAuVAAIM" type="video/mp4"/>
      </video>
      {children}

      {/* <AlertDialog open={!isAudioAllowed} onOpenChange={(v) => setIsAudioAllowed(!v)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Trình duyệt của bạn không hỗ trợ phát âm thanh tự động</AlertDialogTitle>
          <AlertDialogDescription>
            {`Phát âm thanh tự động giúp cho bạn nhận được âm thanh thông báo. Bấm 'Cho phép' để nhận thông báo có âm thanh`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAccessPlayAudio}>Chấp nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> */}
    </TVContext.Provider>
  );
}
