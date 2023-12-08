import { type FileWithPath } from "react-dropzone";
export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type GetOffersAPIResponseType = {
  Status: "S" | "F";
  Message: {
    loanAmt: number;
    ExpiryDate: string;
    MobileNumber: string;
    Tenor: number;
    MerchantID: null;
  };
};

export type SendOTPAPIResponseType = {
  Status: "S" | "F";
  Message: string;
};
