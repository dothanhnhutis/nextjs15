import React from "react";
import { Input } from "./ui/input";

const SmartInputNumber = ({
  value = "0",
  onInputChange,
  disabled,
  placeholder,
  className,
}: {
  value?: string;
  onInputChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) => {
  // const [inputValue, setInputValue] = React.useState<string>(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (/^\d+$/.test(input)) {
      const v =
        input.startsWith("0") && input !== "0"
          ? parseInt(input).toString()
          : input;
      if (onInputChange) {
        onInputChange(v);
      }
      // setInputValue(v);
    } else {
      if (onInputChange) {
        onInputChange("0");
      }
      // setInputValue("0");
    }
  };

  return (
    <Input
      disabled={disabled}
      className={className}
      value={value}
      type="number"
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};
export default SmartInputNumber;
