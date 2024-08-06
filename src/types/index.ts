import { type FileWithPath } from "react-dropzone";
export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type APIResponseType = {
  status: "Success" | "Fail";
  message: string;
  Token: string;
};

export type EsignResponseType = {
  data: string;
  status: "Success" | "Fail";
  Token: string;
};

export type ESignPacketsAPI = {
  status: "Success" | "Fail";
  data: string;
  redirect: string;
  post: string;
  Token: string;
  message: string;
};

export type GetStepsAPIResponseType = {
  status: "Success" | "Fail";
  Token: string;
  result: Steps;
  message: "Invalid or expire application." | "expired";
};

export type SendOTPAPIResponse = {
  OTPToken: string;
} & APIResponseType;

type kycStepCompletionStatus =
  | "Complete"
  | "Document under-revirew"
  | "Pending";
export type Steps = [
  {
    kycStepName: "PersonalDetails";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "Selfi_check";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "PanDetails";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "AadharDetails";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "BankDetails";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "KFS";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "Esign";
    kycStepCompletionStatus: kycStepCompletionStatus;
  },
  {
    kycStepName: "Disbursed";
    kycStepCompletionStatus: kycStepCompletionStatus;
  }
];

export type GetOffersResponseType = {
  status: "Success" | "Fail";
  message: OfferDetails;
};

export type GetBusinessMerchantDetailsAPIResponseType = {
  data: BusinessMerchantDetailsDataKey;
} & APIResponseType;

export type BusinessMerchantDetailsDataKey = {
  BusinessDetailsResEntity: {
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
  BusinessAddressResEntity: {
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
    UpdateOn: string;
    LNG: string;
    LAT: string;
    DistrictId: string | null;
    UpdateByName: string | null;
  };
};

export type GetRegenerateloanoffersResponseType = {
  data: {
    BusinessIdentity: string | null;
    LoanUID: string | null;
    ExpiryDate: string | null;
    BatchID: string | null;
    loanAmount: number;
    interest: number;
    processingFee: number;
    gst: number;
    insuranceFee: number;
    tenor: number;
    noOfCycels: number;
    totalInterest: number;
    upfrontInterest: number;
    upfrontFees: number;
    totalUpfront: number;
    netDisbursement: number;
    totalPaidbyCustomer: number;
    emi: number;
    LoanRefID: string | null;
    noOfPayment: number;
  };
} & APIResponseType;

export type AadharGetotpAPIRespnseType = {
  client_id: string;
} & APIResponseType;

export type GetBankListAPI = {
  data: BankList[];
} & APIResponseType;

export type GeolocationData = {
  latitude: number;
  longitude: number;
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
  Merchant_Id: string;
  LoanUID: string;
  ExpiryDate: string;
  BatchID: null;
  loanAmount: number;
  interest: number;
  processingFee: number;
  gst: number;
  insuranceFee: number;
  tenor: number;
  noOfCycels: number;
  totalInterest: number;
  upfrontInterest: number;
  upfrontFees: number;
  totalUpfront: number;
  netDisbursement: number;
  totalPaidbyCustomer: number;
  emi: number;
  LoanRefID: null;
  noOfPayment: number;
  LoanOffered: number;
  MobileNumber: string;
  ProductId: number;
  ApplicationID: string;
  ProcessingFeesRate: number;
  GSTRate: number;
  LoanStatus: "1" | "2" | "5";
};

export type LoginOTPVerifyAPIResponeType = {
  data: LoginOTPVerifyDataObject[];
} & APIResponseType;

export type LoginOTPVerifyDataObject = {
  NaturalId: number;
  Enc_Application_id: string | null;
  Application_id: string;
  Partner_code: string | null;
  Application_date: string;
  Customer_code: string;
  Product_code: string;
  Customer_name: string;
  CreatedOn: string;
  Mobile_no: string;
  Pan: string | null;
  Status: number;
  Loan_amount: string;
  Upfront_interest: string;
  Upfront_fees: string;
  Total_deduction: string;
  Disbursement_amount: string;
  Address: string;
  Closed: string | null;
  Date: string | null;
  Remark: string | null;
  DOB: string;
  Gender: string;
  Emergency: string;
  Email: string;
  UpdateOn: string | null;
};

export type InstallmentTrackerAPIResponeType = {
  data: InstallmentTrackerDataArray[];
} & APIResponseType;

export type InstallmentTrackerDataArray = {
  ApplicationID: string;
  Day: number;
  EDI: number;
  PrincipalDue: number;
  InterestDue: number;
  UpfrontDeduction: number;
  PrincipalRepaid: number;
  InterestRepaid: number;
  EDIDate: string;
  EMICollectOrderId: null | string;
  IsPaid: number;
  PaymentMode: null | string;
  PaymentRefNo: null | string;
  FailAttemptCount: number;
};

export type LoanAccountledgerAPIResponeType = {
  data: LoanAccountledgerDataObject[];
} & APIResponseType;

export type LoanAccountledgerDataObject = {
  ledger_code: string;
  name: string | null;
  txn_id: string;
  txn_ref_id: string;
  voucher_number: string;
  narration1: string;
  ledger_name: string;
  amount: number;
  closing_balance: number;
  is_credit: number;
  is_debit: number;
  created_on: string;
  UserName: string | null;
};

export type CustomErrorT = {
  image: boolean;
  Heading: string;
  Description: string;
};

export type APIEndPoints =
  | "/api/GetOffers"
  | "/api/SendOTP"
  | "/api/OTPVerify"
  | "/api/BusinessBankDetails"
  // | "/BusinessAddressDetails" <-- deprecated
  | "/api/BusinessMerchantDetails"
  | "/api/update_businessMerchantDetails"
  | "/api/savekycdocuments"
  | "/api/aadhargetotp"
  | "/api/aadharotpvalidate"
  | "/api/regenerateloanoffers"
  | "/api/getapplicantmerchantdetails"
  // | "/validatepan" <-- deprecated
  | "/api/updatebank"
  | "/api/getesignrequestterms1"
  | "/api/getesignrequestterms2"
  | "/getesignrequestpackets"
  | "/api/esignresponse"
  | "/gettermsconditions"
  | "/api/getesigndocument"
  | "/agreekfs"
  | "/api/loginSendOTP"
  | "/api/loginOTPVerify"
  | "/api/installmentTracker"
  | "/api/loanAccountledger";
