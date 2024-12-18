"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { XIcon } from "lucide-react";
import DisplayEditor from "@/components/tiptap/display-editor";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const SmartInputNumber = ({
  value = "0",
  onInputChange,
}: {
  value?: string;
  onInputChange?: (v: string) => void;
}) => {
  const [inputValue, setInputValue] = React.useState<string>(value);

  // Đồng bộ hóa khi `value` từ bên ngoài thay đổi
  React.useEffect(() => {
    if (/^\d+$/.test(value)) {
      setInputValue(parseInt(value).toString());
    }
  }, [value]);

  // Gửi giá trị hiện tại ra ngoài khi thay đổi
  React.useEffect(() => {
    if (onInputChange) {
      onInputChange(inputValue);
    }
  }, [inputValue, onInputChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      // Cho phép nhập số hoặc chuỗi rỗng
      setInputValue(
        input.startsWith("0") && input !== "0"
          ? parseInt(input).toString()
          : input
      );
    }
  };

  return (
    <input
      className="w-20"
      value={inputValue}
      type="number"
      onChange={handleChange}
    />
  );
};

const CreateDisplayForm = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = React.useState({
    userId: currentUser!.id,
    priority: 0,
    enable: true,
    content: "<p></p>",
    departmentIds: [],
  });

  return (
    <form className="grid sm:grid-cols-2 gap-4 mt-5">
      <div className="space-y-2 sm:row-span-2 sm:col-span-1">
        <label htmlFor="priority">Hiển thị tại</label>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="inline-flex px-2 py-1 gap-1 rounded-full border">
            <p className="text-sm">Phong 1</p>
            <button type="button">
              <XIcon className="shrink-0 size-4" />
            </button>
          </div>
          <div className="inline-flex px-2 py-1 gap-1 rounded-full border">
            <p className="text-sm">Phong 1</p>
            <button type="button">
              <XIcon className="shrink-0 size-4" />
            </button>
          </div>
          <button
            type="button"
            className="inline-flex px-2 py-1 gap-1 rounded-full border"
          >
            <p className="text-sm">Thêm</p>
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="priority">Hiển thị</label>
        <div className="text-xs flex items-center gap-2 text-muted-foreground">
          <p className="w-full">Bật / Tắt hiển thị</p>
          <Switch
            className="block"
            checked={formData.enable}
            onCheckedChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                enable: v,
              }))
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="priority">Mức độ ưu tiên</label>
        <div className="text-xs flex items-center gap-2 text-muted-foreground">
          <p className="w-full">Mức độ ưu tiên cao thì sẽ được đẩy lên trên</p>
          {/* <Input
            className="w-20"
            value={formData.priority}
            type="number"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                priority:
                  e.target.value == "" ? 0 : parseInt(e.target.value, 10),
              }))
            }
          /> */}
          <SmartInputNumber
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

      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="priority">Nội dung</label>
        <DisplayEditor
          onEditorChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              content: e.getHTML(),
            }))
          }
        />
      </div>
      <div className="flex gap-2 justify-end items-center sm:col-span-2">
        <Button type="button" variant="outline">
          Huỷ
        </Button>
        <Button>Tạo</Button>
      </div>
    </form>
  );
};

export default CreateDisplayForm;
