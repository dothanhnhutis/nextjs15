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
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { DateInputV1 } from "@/components/date-input";

const prioritySchema = z
  .string()
  .regex(/^(0|[1-9]\d*)$/, {
    message: "Ưu tiên phải là một số nguyên dương",
  })
  .refine((v) => parseInt(v) < 100, {
    message: "Ưu tiên phải nhỏ hơn hoặc bằng 99",
  });

const DisplayFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [open, setOpen] = React.useState<boolean>(false);
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
    value: ["0", "99"],
  });

  const [error, setError] = React.useState({
    dateStartError: "",
    dateEndError: "",
    priorityError: "",
    priorityFromError: "",
    priorityToError: "",
  });

  React.useEffect(() => {
    if (priority.valuetype === "string") {
      const priorityParse = prioritySchema.safeParse(priority.value[0]);
      if (!priorityParse.success) {
        console.log(priorityParse.error.issues);
        setError((prev) => ({
          ...prev,
          priorityError: priorityParse.error.issues[0].message,
        }));
      } else {
        setError((prev) => ({
          ...prev,
          priorityError: "",
        }));
      }
    } else {
      const priorityFromParse = prioritySchema.safeParse(priority.value[0]);
      const priorityToParse = prioritySchema.safeParse(priority.value[1]);

      if (!priorityFromParse.success) {
        setError((prev) => ({
          ...prev,
          priorityFromError: priorityFromParse.error.issues[0].message,
        }));
      } else {
        setError((prev) => ({
          ...prev,
          priorityFromError: "",
        }));
      }
      if (!priorityToParse.success) {
        setError((prev) => ({
          ...prev,
          priorityToError: priorityToParse.error.issues[0].message,
        }));
      } else {
        setError((prev) => ({
          ...prev,
          priorityToError: "",
        }));
      }

      if (
        error.priorityFromError == "" &&
        error.priorityToError == "" &&
        priority.value[0] == priority.value[1]
      ) {
        setError((prev) => ({
          ...prev,
          priorityError: "Ưu tiên (From) phải khác Ưu tiên (To)",
        }));
      } else if (
        error.priorityFromError == "" &&
        error.priorityToError == "" &&
        priority.value[0] > priority.value[1]
      ) {
        setError((prev) => ({
          ...prev,
          priorityError: "Ưu tiên (From) phải nhỏ hơn Ưu tiên (To)",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          priorityError: "",
        }));
      }
    }
  }, [error.priorityFromError, error.priorityToError, priority]);

  const filter = React.useMemo(() => {
    const searchParams = new URLSearchParams();
    if (enable.include) {
      searchParams.append("enable", enable.value);
    }
    if (priority.include) {
      if (priority.valuetype === "string") {
        if (error.priorityError.length == 0)
          searchParams.append("priority", priority.value[0]);
      } else {
        if (
          error.priorityError.length == 0 &&
          error.priorityFromError.length == 0
        )
          searchParams.append("minPriority", priority.value[0]);
        if (
          error.priorityError.length == 0 &&
          error.priorityToError.length == 0
        )
          searchParams.append("maxPriority", priority.value[1]);
      }
    }
    if (createdAt.include) {
      searchParams.append("createdAtFrom", createdAt.value[0]);
      searchParams.append("createdAtTo", createdAt.value[1]);
    }
    return searchParams.toString();
  }, [
    enable.include,
    enable.value,
    priority.include,
    priority.valuetype,
    priority.value,
    createdAt.include,
    createdAt.value,
    error.priorityError.length,
    error.priorityFromError.length,
    error.priorityToError.length,
  ]);

  // console.log(filter);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(pathname + "?" + filter);
    setOpen(false);
  };

  const handleReset = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const enable = searchParams.get("enable");
    const priority = searchParams.get("priority");
    const minPriority = searchParams.get("minPriority");
    const maxPriority = searchParams.get("maxPriority");
    const createdAtFrom = searchParams.get("createdAtFrom");
    const createdAtTo = searchParams.get("createdAtTo");

    if (enable) {
      setEnable((prev) => ({ ...prev, value: enable, include: true }));
    } else {
      setEnable((prev) => ({ ...prev, include: false }));
    }
    if (priority) {
      setPriority(() => ({
        include: true,
        value: [priority, priority],
        valuetype: "string",
      }));
    } else if (minPriority && maxPriority) {
      setPriority(() => ({
        include: true,
        value: [minPriority, maxPriority],
        valuetype: "range",
      }));
    } else {
      setPriority(() => ({
        include: false,
        value: ["0", "99"],
        valuetype: "range",
      }));
    }
    if (createdAtFrom && createdAtTo) {
      setCreatedAt(() => ({
        include: true,
        value: [createdAtFrom, createdAtTo],
      }));
    } else {
      const currentDate = new Date();
      setCreatedAt(() => ({
        include: false,
        value: [
          format(currentDate, "dd/MM/yyyy"),
          format(currentDate, "dd/MM/yyyy"),
        ],
      }));
    }
  };

  React.useEffect(() => {
    // handleReset();
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="border rounded-md p-1 hover:bg-accent">
          <FilterIcon className="shrink-0 size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 p-0">
        <DateInputV1 />
        <form onSubmit={handleSubmit}>
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
                disabled={!createdAt.include}
                placeholder="dd/MM/yyyy"
                value={createdAt.value[0]}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!/^[0-9\/]{0,10}$/.test(value)) return;

                  if (value.length == 6) {
                    if (value[5] !== "/") {
                      value = value.slice(0, 5) + "/" + value.slice(5);
                    }
                  }

                  if (value.length == 3) {
                    if (value[2] !== "/") {
                      value = value.slice(0, 2) + "/" + value.slice(2);
                    }
                  }

                  const dayMonthRegex =
                    /^(0[1-9]|[1-2][0-9]|[3][0-1])\/([0-1]?|0[1-9]|1[0-2])$/;
                  if (
                    value.length >= 3 &&
                    value.length <= 5 &&
                    !dayMonthRegex.test(value)
                  )
                    return;

                  const dayRegex =
                    /^([0-3]{0,1}|0[1-9]|[1-2][0-9]|[3][0-1])\/?$/;
                  if (value.length <= 2 && !dayRegex.test(value)) return;

                  setCreatedAt((prev) => ({
                    ...prev,
                    value: [value, prev.value[1]],
                  }));
                }}
              />
              <Input
                disabled={!createdAt.include}
                placeholder="dd/MM/yyyy"
                value={createdAt.value[1]}
                onChange={(e) => console.log(e.target.value)}
              />
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
                      setPriority((prev) => ({
                        ...prev,
                        valuetype: "range",
                        value: ["0", "99"],
                      }));
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
                      setPriority((prev) => ({
                        ...prev,
                        valuetype: "string",
                        value: ["0", "99"],
                      }));
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
                <div className="col-span-2 space-y-1">
                  <Input
                    disabled={!priority.include}
                    className={cn(
                      "focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:ring-0",
                      priority.include && error.priorityError.length > 0
                        ? "border-destructive"
                        : ""
                    )}
                    value={priority.value[0]}
                    onChange={(e) =>
                      setPriority((prev) => ({
                        ...prev,
                        value: [e.target.value, e.target.value],
                      }))
                    }
                  />
                  {error.priorityError.length > 0 &&
                    priority.include &&
                    priority.valuetype == "string" && (
                      <p className="text-destructive text-xs">
                        {error.priorityError}
                      </p>
                    )}
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-normal text-muted-foreground">
                      Từ:
                    </p>
                    <Input
                      disabled={!priority.include}
                      className={cn(
                        "focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:ring-0",
                        priority.include &&
                          (error.priorityFromError.length > 0 ||
                            error.priorityError)
                          ? "border-destructive"
                          : ""
                      )}
                      value={priority.value[0]}
                      onChange={(e) =>
                        setPriority((prev) => ({
                          ...prev,
                          value: [e.target.value, prev.value[1]],
                        }))
                      }
                    />
                    {error.priorityFromError.length > 0 &&
                      priority.valuetype == "range" &&
                      priority.include && (
                        <p className="text-destructive text-xs">
                          {error.priorityFromError}
                        </p>
                      )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-normal text-muted-foreground">
                      Đến:
                    </p>
                    <Input
                      disabled={!priority.include}
                      className={cn(
                        "focus-visible:outline-0 focus-visible:ring-offset-0 focus-visible:ring-0",
                        priority.include &&
                          (error.priorityToError.length > 0 ||
                            error.priorityError)
                          ? "border-destructive"
                          : ""
                      )}
                      value={priority.value[1]}
                      onChange={(e) =>
                        setPriority((prev) => ({
                          ...prev,
                          value: [prev.value[0], e.target.value],
                        }))
                      }
                    />
                    {error.priorityToError.length > 0 &&
                      priority.valuetype == "range" &&
                      priority.include && (
                        <p className="text-destructive text-xs">
                          {error.priorityToError}
                        </p>
                      )}
                  </div>
                  {error.priorityError.length > 0 &&
                    priority.valuetype == "range" &&
                    priority.include && (
                      <p className="col-span-2 text-destructive text-xs">
                        {error.priorityError}
                      </p>
                    )}
                </>
              )}
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between gap-2 items-center px-2 pb-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Đặt lại
            </Button>
            <Button>Áp dụng</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default DisplayFilter;
