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

export function findPanNumber(text: string) {
  const panCardRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  const customRegex = /[A-Z]*[0-9][A-Z0-9]{9}/;

  let inputText = text.replace(/\s/g, "");

  const match = inputText.match(panCardRegex);
  const customRegexMatch = inputText.match(customRegex);

  if (match && match.length > 0) {
    const panNumber = match[0];
    console.log("PAN Number:", panNumber);
    return panNumber;
  } else if (customRegexMatch && customRegexMatch.length > 0) {
    return findCustomPattern(customRegexMatch[0]);
  } else {
    console.log("PAN Number not found in the given string.");
  }
}

export function findCustomPattern(text: string) {
  let p = text.substring(0, 9);

  const replacementsLetterToNumber: { [key: string]: string } = {
    O: "0",
    I: "1",
    Z: "2",
    H: "4",
    S: "5",
    C: "6",
    B: "8",
  };

  let replacementsNumberToLetters: { [key: string]: string } = {};

  for (let key in replacementsLetterToNumber) {
    if (replacementsLetterToNumber.hasOwnProperty(key)) {
      replacementsNumberToLetters[replacementsLetterToNumber[key]] = key;
    }
  }

  for (let i = 5; i <= 8; i++) {
    const currentChar = p.charAt(i);
    if (replacementsLetterToNumber[currentChar]) {
      p =
        p.substring(0, i) +
        replacementsLetterToNumber[currentChar] +
        p.substring(i + 1);
    }
  }

  for (let i = 0; i <= 4; i++) {
    const currentChar = p.charAt(i);
    if (replacementsNumberToLetters[currentChar]) {
      p =
        p.substring(0, i) +
        replacementsNumberToLetters[currentChar] +
        p.substring(i + 1);
    }
  }

  const lastChar = p.charAt(9);
  if (replacementsNumberToLetters[lastChar]) {
    p = p.substring(0, 9) + replacementsNumberToLetters[lastChar];
  }
  return p;
}
