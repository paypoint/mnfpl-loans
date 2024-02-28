import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"
  }`;
}

export function toLocalCurrency(amount: string | number) {
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}

export async function getBase64(
  file: File
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
}

export const onlyNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const keyCode = event.which || event.keyCode;
  const isValid = /^[0-9]+$/.test(String.fromCharCode(keyCode));
  return isValid;
};

export const onlyNumberValues = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  var e = event || window.event;
  var key = e.keyCode || e.which;
  const isCopyPasteShortcut =
    (event.ctrlKey || event.metaKey) &&
    (event.key === "c" || event.key === "v");

  if (
    (!e.shiftKey &&
      !e.altKey &&
      !e.ctrlKey &&
      // numbers
      key >= 48 &&
      key <= 57) ||
    // Numeric keypad
    (key >= 96 && key <= 105) ||
    // Backspace and Tab and Enter
    key == 8 ||
    key == 9 ||
    key == 13 ||
    // Home and End
    key == 35 ||
    key == 36 ||
    // left and right arrows
    key == 37 ||
    key == 39 ||
    // Del and Ins
    key == 46 ||
    key == 45 ||
    isCopyPasteShortcut
  ) {
  } else if (!onlyNumber(event)) {
    event.preventDefault();
  }
};
