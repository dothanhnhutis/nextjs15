"use client";
import React from "react";
type DateInputProps = {
  date?: string;
  onDateChange?: (date: string) => void;
  disabled?: boolean;
};
export const DateInput = ({ date, onDateChange }: DateInputProps) => {
  const dateRegex = /^(0[1-9]|[1-2][0-9]|[3][0-1])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  const [data, setDate] = React.useState<string>(
    date && dateRegex.test(date) ? date : ""
  );

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!/^[0-9\/]{0,10}$/.test(value)) return;

    // const fullDateRegex = /^(0[1-9]|[1-2][0-9]|[3][0-1])\/(0[1-9]|1[0-2])\/(\d{0,4})$/;

    // if (value.length <= 10 && value.length > 6) {
    //   if (value[2] !== "/" || value[5] !== "/") return;
    // }

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
    if (value.length >= 3 && value.length <= 5 && !dayMonthRegex.test(value))
      return;

    const dayRegex = /^([0-3]{0,1}|0[1-9]|[1-2][0-9]|[3][0-1])\/?$/;
    if (value.length <= 2 && !dayRegex.test(value)) return;

    setDate(value);
    if (onDateChange) onDateChange(value);
  };

  return (
    <input
      type="string"
      placeholder="DD/MM/YYYY"
      value={data}
      onChange={handleOnchange}
    />
  );
};

export const DateInputV1 = ({}: DateInputProps) => {
  const [day, setDay] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");

  const [focusAt, setFocusAt] = React.useState<"day" | "month" | "year" | null>(
    null
  );

  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);

  const handleOnChange =
    (type: "day" | "month" | "year") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //   if (!/[0-9]/.test(e.key)) return;
      //   if (type === "day") {
      //     if (day.length === 2) {
      //       setFocusAt("month");
      //       monthRef.current?.focus();
      //     } else {
      //       setDay(day + e.key);
      //     }
      //   } else if (type === "month") {
      //     if (month.length === 2) {
      //       setFocusAt("year");
      //       yearRef.current?.focus();
      //     } else {
      //       setMonth(month + e.key);
      //     }
      //   } else {
      //     if (year.length === 4) return;
      //     setYear(year + e.key);
      //   }
    };

  React.useEffect(() => {
    if (focusAt === "day") {
      dayRef.current?.focus();
    } else if (focusAt === "month") {
      monthRef.current?.focus();
    } else if (focusAt === "year") {
      yearRef.current?.focus();
    }
  }, [focusAt]);

  return (
    <div
      onClick={() => {
        if (focusAt === null) {
          setFocusAt("day");
        }
      }}
      className="inline-flex items-center border border-gray-300 rounded-md p-1"
    >
      <input
        ref={dayRef}
        type="text"
        className="w-5 outline-none"
        placeholder="DD"
        value={day}
        onChange={handleOnChange("day")}
      />
      <span>/</span>
      <input
        ref={monthRef}
        type="text"
        className="w-5 outline-none"
        placeholder="MM"
        value={month}
        onChange={handleOnChange("month")}
      />
      <span>/</span>
      <input
        ref={yearRef}
        type="text"
        className="w-10 outline-none"
        value={year}
        placeholder="YYYY"
        onChange={handleOnChange("year")}
      />
    </div>
  );
};
