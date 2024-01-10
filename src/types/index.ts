import { type FileWithPath } from "react-dropzone";
export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type GetOffersAPIResponseType = {
  status: "Success" | "Fail";
  message: string;
};

export type SendOTPAPIResponseType = {
  status: "Success" | "Fail";
  message: string;
};

export type GetBusinessMerchantDetailsAPIResponseType = {
  status: "Success" | "Fail";
  message: string;
  data: string;
};

export type GeoLocationAPIResponeObject = {
  country_code: string;
  country_name: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  IPv4: string;
  state: string;
};

export type ParsedMerchantDetails = {
  IdentificationCode: string;
  Salutation: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Business: string;
  DateOfBirth: string;
  Mobile: string;
  EmailId: string;
  BusinessID: number;
  CreatedOn: string;
  PANNo: string;
  AadhaarNo: string;
  AadharMobile: string;
  BCStatus: string;
  Status: number;
};

export type ParsedMerchantAddressDetails = {
  CityID: number;
  StateID: number;
  category: string;
  Address1: string;
  Address2: string;
  Area: string;
  City: string;
  District: string;
  State: string;
  Country: string;
  Region: string;
  PinCode: string;
  LNG: string;
  LAT: string;
  DistrictId: null;
  UpdateByName: null;
};

export type BankList = {
  BBMID: number;
  BusinessID: number;
  Status: number;
  Bank: string;
  IFSCCode: string;
  AccountNumber: string;
  AccountType: string;
  AccountHolderName: string;
  CreatedOn: string;
  UpdatedOn: string;
  BusinessType: string;
  Remark: string;
  IdentificationCode: string;
};

export type OfferDetails = {
  LoanAmount: string;
  ExpiryDate: string;
  MobileNumber: string;
  Tenor: number;
  MerchantID: string;
};
