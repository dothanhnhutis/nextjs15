"use client";
import React from "react";
import Link from "next/link";

import { Switch } from "@/components/ui/switch";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import DisplayEditor from "@/components/tiptap/display-editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Department } from "@/services/department.service";
import { CreateDisplay, createDisplaySchema } from "@/schema/display.schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createdDisplayService } from "@/services/display.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SmartInputIntNumber from "@/components/smart-input";

const SelectDepartment = ({
  departments = [],
  selectedDefault,
  onSave,
  disabled,
}: {
  departments: Department[];
  selectedDefault: string[];
  onSave?: (departmentIds: string[]) => void;
  disabled?: boolean;
}) => {
  const [currentData, setCurrentData] =
    React.useState<string[]>(selectedDefault);

  const handleSave = () => {
    if (onSave) onSave(currentData);
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) setCurrentData(selectedDefault);
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          disabled={disabled}
          type="button"
          className="inline-flex px-2 py-1 gap-1 rounded-full border disabled:opacity-50"
        >
          <p className="text-sm">Thêm</p>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hiển thị tại đâu ?</AlertDialogTitle>
          <AlertDialogDescription>
            Chọn phòng ban để hiển thị
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <div className="grid gap-2 overflow-y-scroll border px-2 py-1 rounded-lg max-h-[162px]">
            {departments.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 hover:bg-muted p-1 rounded-md cursor-pointer"
                onClick={() => {
                  setCurrentData((prev) =>
                    prev.includes(d.id)
                      ? prev.filter((id) => id != d.id)
                      : [...prev, d.id]
                  );
                }}
              >
                <Checkbox checked={currentData.includes(d.id)} />
                <p className="line-clamp-1">{d.name}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              className="text-primary text-sm hover:underline"
              onClick={() => setCurrentData([])}
            >
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              className="text-primary text-sm hover:underline"
              onClick={() => setCurrentData(selectedDefault)}
            >
              Đặt lại
            </button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Lưu</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CreateDisplayForm = ({
  departments = [],
}: {
  departments?: Department[];
}) => {
  const [formData, setFormData] = React.useState<CreateDisplay>({
    priority: 0,
    enable: true,
    content: "<p></p>",
    departmentIds: [],
  });

  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success, data } = createDisplaySchema.safeParse(formData);
    if (!success) return;
    startTransition(async () => {
      try {
        await createdDisplayService(data);
        router.push("/admin/tv");
        toast.success("Tạo hiển thị thành công");
      } catch (error: unknown) {
        console.log(error);
        toast.error("Tạo hiển thị thất bại");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mt-5">
      <div
        className={cn(
          "space-y-2 sm:col-span-1",
          formData.enable ? "sm:row-span-2" : ""
        )}
      >
        <label htmlFor="priority">Hiển thị tại</label>
        <div className="flex gap-2 items-center flex-wrap">
          {formData.departmentIds.map((departmentId) => {
            const department = departments.find(
              (department) => department.id == departmentId
            );
            if (!department) return;
            return (
              <div
                key={department.id}
                className="inline-flex px-2 py-1 gap-1 rounded-full border"
              >
                <p className="text-sm">{department.name}</p>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentIds: prev.departmentIds.filter(
                        (i) => i != department.id
                      ),
                    }))
                  }
                >
                  <XIcon className="shrink-0 size-4" />
                </button>
              </div>
            );
          })}
          <SelectDepartment
            disabled={isPending}
            departments={departments}
            selectedDefault={formData.departmentIds}
            onSave={(data) => {
              setFormData((prev) => ({
                ...prev,
                departmentIds: data,
              }));
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="priority">Hiển thị</label>
        <div className="text-xs flex items-center gap-2 text-muted-foreground">
          <p className="w-full">Bật / Tắt hiển thị</p>
          <Switch
            disabled={isPending}
            className="block"
            checked={formData.enable}
            onCheckedChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                enable: v,
                priority: 0,
              }))
            }
          />
        </div>
      </div>
      {formData.enable && (
        <div className="space-y-2">
          <label htmlFor="priority">Mức độ ưu tiên</label>
          <div className="text-xs flex items-center gap-2 text-muted-foreground">
            <p className="w-full">
              Mức độ ưu tiên cao thì sẽ được đẩy lên trên
            </p>
            <SmartInputIntNumber
              disabled={isPending}
              className="w-20"
              value={formData.priority.toString()}
              onInputChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: parseInt(v),
                }))
              }
            />
          </div>
        </div>
      )}

      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="priority">Nội dung</label>
        <DisplayEditor
          onEditorChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              content: e.getHTML(),
            }))
          }
          disabled={isPending}
        />
      </div>
      <div className="flex gap-2 justify-end items-center sm:col-span-2">
        <Button type="button" variant="outline" asChild disabled={isPending}>
          <Link href="/admin/tv">Huỷ</Link>
        </Button>

        <Button disabled={isPending}>
          {isPending && (
            <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-1" />
          )}
          Tạo
        </Button>
      </div>
    </form>
  );
};

export default CreateDisplayForm;
