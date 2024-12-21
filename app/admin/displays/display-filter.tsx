"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";

const DisplayFilter = () => {
  const [] = React.useState();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="border rounded-md p-1 hover:bg-accent">
          <FilterIcon className="shrink-0 size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 p-0">
        <div className="">
          <h4 className="font-medium leading-none p-2">Bộ lọc</h4>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center ">
              <p className="font-medium text-sm">Ngày tạo</p>
              <Switch />
            </div>
            <div className="grid gap-2 grid-cols-2 ">
              <p className="text-xs font-normal text-muted-foreground">
                Từ ngày:
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                Đến ngày:
              </p>
              <Input />
              <Input />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Hiện / Ẩn</p>
              <Switch />
            </div>
            <div className="flex justify-between gap-2 items-center">
              <p className="text-xs font-normal text-muted-foreground">
                Chọn những hiện thị đang bật hay đã tắt
              </p>
              <Switch />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Ưu tiên</p>
              <Switch />
            </div>
            <div className="grid gap-2 grid-cols-2 ">
              <p className="text-xs font-normal text-muted-foreground col-span-2">
                Chọn độ ưu tiên
                <span className="text-primary px-1 cursor-pointer">
                  trong phạm vi
                </span>
                hoặc
                <span className="text-primary px-1 cursor-pointer">
                  chính xác
                </span>
              </p>

              <p className="text-xs font-normal text-muted-foreground">Form:</p>
              <p className="text-xs font-normal text-muted-foreground">To:</p>
              <Input />
              <Input />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between gap-2 items-center px-2 pb-4">
            <Button variant="outline">Đặt lại</Button>
            <Button>Áp dụng</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DisplayFilter;
