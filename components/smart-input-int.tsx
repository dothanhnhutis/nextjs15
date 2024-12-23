"use client";
import React from "react";
type SmartInputIntNumberProps = React.ComponentProps<"input"> & {
  className?: string;
  isNegative?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  delay?: number;
  value?: string;
  onInputChange?: (v: string) => void;
};

const SmartInputIntNumber = ({
  min,
  max,
  isNegative = true,
  delay = 2000,
  value,
  onInputChange,
  ...props
}: SmartInputIntNumberProps) => {
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
  const [input, setInput] = React.useState<string>(value || "0");

  React.useEffect(() => {
    const regex = allowNegative ? /^-?\d+$/ : /^\d+$/;
    let timer: NodeJS.Timeout;
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
      timer = setTimeout(() => {
        setInput(value || min?.toString() || max?.toString() || "0");
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [allowNegative, delay, input, max, min, onInputChange, value]);

  return (
    <input
      {...props}
      value={input}
      onChange={(e) => setInput(e.target.value.replace(/^-?[0]{1,}/g, "0"))}
    />
  );
};

export default SmartInputIntNumber;
