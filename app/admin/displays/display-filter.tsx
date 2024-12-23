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
import { cn } from "@/lib/utils";
import SmartInputIntNumber from "@/components/smart-input";

const DisplayFilter = () => {
  const [createdAt, setCreatedAt] = React.useState({
    include: true,
    value: ["", ""],
  });

  const [enable, setEnable] = React.useState({
    include: true,
    value: "true",
  });

  const [priority, setPriority] = React.useState({
    include: true,
    valuetype: "range",
    value: ["0", "10"],
  });

  // const searchParams = React.useMemo(() => {
  //   const params = new URLSearchParams();
  //   console.log(data);
  //   return params.toString();
  // }, [data]);

  // console.log(searchParams);

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
          <div className={cn("grid gap-2 px-2")}>
            <div className="flex justify-between gap-2 items-center ">
              <p className="font-medium text-sm">Ngày tạo</p>
              <Switch
                checked={createdAt.include}
                onCheckedChange={(v) =>
                  setCreatedAt((prev) => ({ ...prev, include: v }))
                }
              />
            </div>
            <div
              className={cn(
                "grid gap-2 grid-cols-2",
                createdAt.include ? "" : "opacity-50"
              )}
            >
              <p className="text-xs font-normal text-muted-foreground">
                Từ ngày:
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                Đến ngày:
              </p>
              <Input
                placeholder="dd/MM/yyyy"
                // value={data.createdAt.value[0].toString()}
              />
              <Input placeholder="dd/MM/yyyy" />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Hiện / Ẩn</p>
              <Switch
                checked={enable.include}
                onCheckedChange={(v) =>
                  setEnable((prev) => ({ ...prev, include: v }))
                }
              />
            </div>
            <div
              className={cn(
                "flex justify-between gap-2 items-center",
                enable.include ? "" : "opacity-50"
              )}
            >
              <p className="text-xs font-normal text-muted-foreground">
                Chọn những hiện thị đang bật hay đã tắt
              </p>
              <Switch
                disabled={!enable.include}
                checked={enable.value === "true"}
                onCheckedChange={(v) =>
                  setEnable((prev) => ({
                    ...prev,
                    value: v ? "true" : "false",
                  }))
                }
              />
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 px-2">
            <div className="flex justify-between gap-2 items-center">
              <p className="font-medium text-sm">Ưu tiên</p>
              <Switch
                checked={priority.include}
                onCheckedChange={(v) =>
                  setPriority((prev) => ({ ...prev, include: v }))
                }
              />
            </div>
            <div
              className={cn(
                "grid gap-2 grid-cols-2",
                priority.include ? "" : "opacity-50"
              )}
            >
              <p className="text-xs font-normal text-muted-foreground col-span-2">
                Chọn độ ưu tiên
                <span
                  onClick={() => {
                    if (priority.valuetype === "string" && priority.include)
                      setPriority((prev) => ({ ...prev, valuetype: "range" }));
                  }}
                  className={cn(
                    "px-1",
                    priority.valuetype === "string"
                      ? priority.include
                        ? "text-primary cursor-pointer"
                        : "text-primary"
                      : ""
                  )}
                >
                  trong phạm vi
                </span>
                hoặc
                <span
                  onClick={() => {
                    if (priority.valuetype === "range" && priority.include)
                      setPriority((prev) => ({ ...prev, valuetype: "string" }));
                  }}
                  className={cn(
                    "px-1",
                    priority.valuetype === "range"
                      ? priority.include
                        ? "text-primary cursor-pointer"
                        : "text-primary"
                      : ""
                  )}
                >
                  chính xác
                </span>
              </p>
              {priority.valuetype === "string" ? (
                <SmartInputIntNumber
                  min={-100}
                  disabled={!priority.include}
                  className="col-span-2"
                  value={priority.value[0]}
                  onInputChange={(v) => {
                    setPriority((prev) => ({
                      ...prev,
                      value: [v, prev.value[1]],
                    }));
                  }}
                />
              ) : (
                <>
                  <p className="text-xs font-normal text-muted-foreground">
                    Từ:
                  </p>
                  <p className="text-xs font-normal text-muted-foreground">
                    Đến:
                  </p>
                  <SmartInputIntNumber
                    min={0}
                    max={99}
                    disabled={!priority.include}
                    value={priority.value[0]}
                    onInputChange={(v) =>
                      setPriority((prev) => ({
                        ...prev,
                        value: [v, prev.value[1]],
                      }))
                    }
                  />
                  <SmartInputIntNumber
                    min={-100}
                    disabled={!priority.include}
                    value={priority.value[1]}
                    onInputChange={(v) =>
                      setPriority((prev) => ({
                        ...prev,
                        value: [prev.value[0], v],
                      }))
                    }
                  />
                </>
              )}
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
