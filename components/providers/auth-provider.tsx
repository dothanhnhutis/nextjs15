"use client";
import React from "react";
import { User } from "@/schema/user.schema";
import { changeEmail, signOut } from "@/services/users.service";

type AuthContext = {
  currentUser: User | null;
  signOut: () => Promise<void>;
  changeEmail: (email: string) => Promise<void>;
};

const AuthContext = React.createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider.");
  }
  return context;
};

export const AuthProvider = ({
  initUser,
  children,
}: {
  initUser: User | null;
  children: React.ReactNode;
}) => {
  React.useEffect(() => {}, []);

  const handleSignOut = async () => {
    if (!initUser) return;
    await signOut();
  };

  const handleChangeEmail = async (email: string) => {
    await changeEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: initUser,
        signOut: handleSignOut,
        changeEmail: handleChangeEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
