"use client";
import React from "react";
import DisplayItem from "./display-item";
import { useDisplay } from "./display-provider";

const DisplayList = () => {
  const { displays } = useDisplay();
  return (
    <div className="grid gap-2 mt-2 pb-4 px-2 mx-auto max-w-screen-lg">
      {displays.map((d) => (
        <DisplayItem key={d.id} data={d} />
      ))}
    </div>
  );
};

export default DisplayList;
