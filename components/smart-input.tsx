import React from "react";
import { Input } from "./ui/input";

const SmartInputIntNumber = ({
  value = "0",
  onInputChange,
  disabled,
  placeholder,
  className,
  isNegative = true,
  min,
  max,
}: {
  value?: string;
  onInputChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  isNegative?: boolean;
  min?: number;
  max?: number;
}) => {
  // const [inputValue, setInputValue] = React.useState<string>(value);
  if (min && max && min > max) throw new Error("Min must be less than max");

  const [allowNegative, setAllowNegative] = React.useState<boolean>(isNegative);

  React.useEffect(() => {
    if (min && !max && min < 0) {
      setAllowNegative(true);
    }

    if (max && !min && max < 0) {
      setAllowNegative(true);
    }

    if (min && max && (min < 0 || max < 0)) {
      setAllowNegative(true);
    }
  }, [min, max]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = allowNegative ? /^-?\d+$/ : /^\d+$/;

    if (regex.test(input)) {
      if (min && parseInt(input) < min) {
        if (onInputChange) {
          onInputChange(min.toString());
        }
        return;
      }

      if (max && parseInt(input) > max) {
        if (onInputChange) {
          onInputChange(max.toString());
        }
        return;
      }

      if (onInputChange) {
        onInputChange(input);
      }
    } else {
      if (onInputChange) {
        onInputChange(value);
      }
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
export default SmartInputIntNumber;
