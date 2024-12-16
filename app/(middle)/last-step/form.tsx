"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/providers/auth-provider";
import { User } from "@/schema/user.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import SmartDateInput from "./smart-date-input";

const LastStepForm = () => {
  const { currentUser } = useAuth();
  const [info, setInfo] = React.useState<{
    username: string;
    phoneNumber: string;

    gender: User["gender"];
  }>({
    username: currentUser?.username || "",

    gender: currentUser?.gender || "MALE",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form className="grid grid-cols-6 gap-4">
      <div className="flex justify-center col-span-6">
        <Avatar className="size-24">
          <AvatarImage
            referrerPolicy="no-referrer"
            src={currentUser?.picture || "/user-picture.jpg"}
          />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="size-24 rounded-full" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 col-span-6 sm:col-span-3">
        <label htmlFor="username" className="cursor-pointer">
          Họ và tên
        </label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="Nhập họ và tên"
          value={info.username}
          onChange={handleOnchange}
        />
      </div>

      <div className="flex flex-col gap-1 col-span-6 sm:col-span-3">
        <label htmlFor="phoneNumber">Số điện thoại</label>
        <Input
          placeholder="0123456789"
          id="phoneNumber"
          name="phoneNumber"
          value={info.phoneNumber}
          onChange={handleOnchange}
        />
      </div>

      <div className="grid gap-1 col-span-6">
        <label htmlFor="birthDate" className="col-span-full">
          Ngày sinh
        </label>
        <SmartDateInput />
      </div>

      <div className="flex flex-col gap-2 col-span-6">
        <label htmlFor="r1" className="cursor-pointer">
          Giới tính
        </label>
        <RadioGroup
          defaultValue={info.gender || undefined}
          className="min-[512px]:grid-cols-3"
          onValueChange={(v) => {
            setInfo((prev) => ({ ...prev, gender: v as User["gender"] }));
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MALE" id="r1" />
            <Label htmlFor="r1" className="text-sm cursor-pointer">
              Nam
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEMALE" id="r2" />
            <Label htmlFor="r2" className="text-sm cursor-pointer">
              Nữ
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OTHER" id="r3" />
            <Label htmlFor="r3" className="text-sm cursor-pointer">
              Khác
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="col-span-6">Lưu</Button>
    </form>
  );
};

export default LastStepForm;
