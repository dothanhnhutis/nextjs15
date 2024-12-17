"use client";
import { useTV } from "@/components/providers/tv-provider";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { PinIcon, PinOffIcon } from "lucide-react";
import React from "react";

const DepartmentItem = ({ id, name }: { id: string; name: string }) => {
  const { departmentId, setDeparment, pinDepartmentId, setPinDeparment } =
    useTV();
  const handlePinDepartment = () => {
    if (id == pinDepartmentId) {
      setPinDeparment(null);
    } else {
      setPinDeparment(id);
    }
  };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={departmentId == id}
        onClick={() => {
          setDeparment(id);
        }}
      >
        <div className="flex items-center group/item">
          <p className="w-full">{name || ""}</p>
          <button
            type="button"
            onClick={handlePinDepartment}
            className="group-hover/item:block hidden"
          >
            {pinDepartmentId && pinDepartmentId == id ? (
              <PinOffIcon className="shrink-0 size-4" />
            ) : (
              <PinIcon className="shrink-0 size-4" />
            )}
          </button>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default DepartmentItem;
