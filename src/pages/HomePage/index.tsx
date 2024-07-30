import { FC, useEffect, useRef, useState } from "react";
import { type AxiosError } from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { CircleCheckBig, Landmark, X } from "lucide-react";

import coin from "@/assets/images/coin.png";
import Second_screen from "@/assets/images/Second_screen.jpg";
import Screen_5 from "@/assets/images/Screen_5.png";
import Screen_6 from "@/assets/images/Screen_6.jpg";
import MonarchLogo from "@/assets/images/monarch-logo.png";
import EsignSteps from "@/assets/images/Esign_steps.png";

import validations from "@/lib/validations";
import crypto from "@/lib/crypto";
import api, { baseURL } from "@/services/api";
import { FileDialog } from "@/components/ui/file-dialog";
import {
  BankList,
  FileWithPreview,
  GetBusinessMerchantDetailsAPIResponseType,
  OfferDetails,
  APIResponseType,
  AadharGetotpAPIRespnseType,
  GetRegenerateloanoffersResponseType,
  GetOffersResponseType,
  GetBankListAPI,
  EsignResponseType,
  ESignPacketsAPI,
  GetStepsAPIResponseType,
  GeolocationData,
  CustomErrorT,
  SendOTPAPIResponse,
} from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlert } from "@/components/modals/alert-modal";

import "./style.css";
import { cn, getBase64, onlyNumberValues, getGeolocation } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/Icons";
import Stepper from "@/components/Stepper";
import KFSDetailsCard from "@/components/KFSDetailsCard";
import CustomError from "@/components/CustomError";
import OfferedLoanAmountS1 from "./Steps/OfferedLoanAmountS1";

const index: FC = () => {
  const [step, setStep] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [alreadyRequest, setAlreadyRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const [countDownTimer, setCountDownTimer] = useState(120);
  const [selectedBankID, setSelectedBankID] = useState(0);
  const [aadharOTPcountDownTimer, setAadharOTPcountDownTimer] = useState(60);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [bankList, setBankList] = useState<BankList[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [KFSHTML, setKFSHTML] = useState<string>();
  const [openTermsDrawer, setOpenTermsDrawer] = useState(false);
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [eSignUrl, setESignUrl] = useState<string>();
  const [customError, setCustomError] = useState<CustomErrorT>();
  const [verificationToken, setVerificationToken] = useState("");

  const [selfieImage, setSelfieImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [panCardImage, setPanCardImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [showAlert, AlertModal] = useAlert();
  const [position, setPosition] = useState<GeolocationData>();

  const defaultFormValues = {
    //step-1
    termsCondition1: {
      value: false,
      error: false,
    },
    termsCondition2: {
      value: false,
      error: false,
    },
    edit_loan_amount: {
      value: "",
      error: false,
    },
    //step-2
    mobile_no: {
      value: "",
      error: false,
    },
    //step-3
    otp: {
      value: "",
      error: false,
    },
    //step-4
    full_name: {
      value: "",
      error: false,
    },
    dob: {
      value: "",
      error: false,
    },
    gender: {
      value: "M",
      error: false,
    },
    pan_number: {
      value: "",
      error: false,
    },
    business_address_pincode: {
      value: "",
      error: false,
    },
    business_address: {
      value: "",
      error: false,
    },
    current_address: {
      value: "",
      error: false,
    },
    current_pincode: {
      value: "",
      error: false,
    },
    email: {
      value: "",
      error: false,
    },
    house: {
      value: "Owned",
      error: false,
    },
    nominee: {
      value: "",
      error: false,
    },
    emergency_contact_number: {
      value: "",
      error: false,
    },
    nominee_relation: {
      value: "",
      error: false,
    },
    //step-7
    aadhar_no: {
      value: "",
      error: false,
    },
    aadhar_otp: {
      value: "",
      error: false,
    },
    //step-8
    bank_name: {
      value: "",
      error: false,
    },
    ifsc_code: {
      value: "",
      error: false,
    },
    account_holder_name: {
      value: "",
      error: false,
    },
    account_number: {
      value: "",
      error: false,
    },
    confirm_account_number: {
      value: "",
      error: false,
    },
    bank_account_type: {
      value: "SA",
      error: false,
    },
    //Esing terms
    esign_terms: {
      value: false,
      error: false,
    },
    //from api
    merchant_id: {
      value: "",
      error: false,
    },
    ip_address: {
      value: "",
      error: false,
    },
    client_id: {
      value: "",
      error: false,
    },
    ref_id: {
      value: "",
      error: false,
    },
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [offers, setOffers] = useState<OfferDetails>();

  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  );

  const digitValidate = (index: number, value: string) => {
    // Update the OTP values in the state
    setOtpValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value.replace(/[^0-9]/g, "");
      return newValues;
    });
    let otp = otpValues.join("");
    let _formValues = { ...formValues };
    if (otp.length === 5 && Number(otp)) {
      _formValues.otp.error = false;
      setFormValues(_formValues);
    }

    if (inputRefs[index].current) {
      inputRefs[index].current!.value = value.replace(/[^0-9]/g, "");
    }
  };

  const tabChange = (index: number, value: string) => {
    if (value !== "") {
      if (inputRefs[index + 1] && inputRefs[index + 1].current) {
        inputRefs[index + 1].current?.focus();
      }
    } else if (inputRefs[index - 1] && inputRefs[index - 1].current) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleNext = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let _formValues = { ...formValues };
    if (step === 1) {
      let termsCondition1HasError = !_formValues.termsCondition1.value;
      // let termsCondition2HasError = !_formValues.termsCondition2.value;
      if (termsCondition1HasError) {
        _formValues.termsCondition1.error = true;
        setFormValues(_formValues);
      } else {
        setStep((prevStep) => prevStep + 1);
      }
    } else if (step === 2) {
      let MobileNo1HasError = !validations.isMobileNumberValid(
        _formValues.mobile_no.value
      );

      if (MobileNo1HasError) {
        _formValues.mobile_no.error = true;
        setFormValues(_formValues);
      } else {
        _formValues.mobile_no.error = false;
        setFormValues(_formValues);
        await sendOTP();
      }
    } else if (step === 3) {
      let otp = otpValues.join("");
      if (otp.length === 6 && Number(otp)) {
        _formValues.otp.value = otp;
        _formValues.otp.error = false;
        setFormValues(_formValues);
        await verifyOTP();
      } else {
        _formValues.otp.error = true;
        setFormValues(_formValues);
      }
    } else if (step === 4) {
      let formObjectHasError = false;
      Object.keys(_formValues).forEach((key) => {
        if (
          // key === "nominee" ||
          key === "business_address" ||
          key === "current_address" ||
          key === "full_name"
        ) {
          let hasError = !validations.isRequired(_formValues[key].value);
          _formValues[key].error = !validations.isRequired(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
        if (key === "email") {
          let hasError = !validations.isRequired(_formValues[key].value);
          _formValues[key].error = !validations.isRequired(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
        if (key === "emergency_contact_number") {
          let hasError = !validations.isMobileNumberValid(
            _formValues[key].value
          );
          _formValues[key].error = !validations.isMobileNumberValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
        if (key === "business_address_pincode" || key === "current_pincode") {
          let hasError = !validations.isPINValid(_formValues[key].value);
          _formValues[key].error = !validations.isPINValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
        // if (key === "pan_number") {
        //   let hasError = !validations.isPANCardValid(_formValues[key].value);
        //   _formValues[key].error = !validations.isPANCardValid(
        //     _formValues[key].value
        //   );
        //   if (hasError) {
        //     formObjectHasError = true;
        //   }
        // }

        if (key === "dob") {
          let hasError = !validations.isAgeValid(_formValues[key].value);
          _formValues[key].error = !validations.isAgeValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
      });
      if (!formObjectHasError) {
        await updateBusinessMerchantDetails();

        // console.log(formValues);
      } else {
        setFormValues(_formValues);
      }
    } else if (step === 5) {
      if (selfieImage) {
        await getBase64(selfieImage[0])
          .then(
            async (res) =>
              await uploadDocument("2", res as string, selfieImage[0].name)
          )
          .catch((err) => console.log(err));
      } else {
        alert("Please upload selfie");
      }
    } else if (step === 6) {
      let formObjectHasError = false;
      Object.keys(_formValues).forEach((key) => {
        if (key === "pan_number") {
          let hasError = !validations.isPANCardValid(_formValues[key].value);
          _formValues[key].error = !validations.isPANCardValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
      });
      if (!formObjectHasError) {
        if (panCardImage) {
          await getBase64(panCardImage[0])
            .then(
              async (res) =>
                await uploadDocument("1", res as string, panCardImage[0].name)
            )
            .catch((err) => console.log(err));
        } else {
          alert("Please upload pan card image");
        }
      } else {
        setFormValues(_formValues);
      }
    } else if (step === 7) {
      let formObjectHasError = false;
      Object.keys(_formValues).forEach((key) => {
        if (key === "aadhar_otp") {
          let hasError = !validations.isOTPValid(_formValues[key].value);
          _formValues[key].error = !validations.isOTPValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
      });
      if (!formObjectHasError) {
        await validateAadharOTP();
      } else {
        setFormValues(_formValues);
      }
    } else if (step === 8) {
      if (bankList && bankList?.length > 0) {
        await updateBank();
        return;
      }
      //
      let formObjectHasError = false;
      Object.keys(_formValues).forEach((key) => {
        if (
          key === "account_holder_name" ||
          key === "account_number" ||
          key === "ifsc_code" ||
          key === "bank_name"
        ) {
          let hasError = !validations.isRequired(_formValues[key].value);
          _formValues[key].error = !validations.isRequired(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
        if (key === "confirm_account_number") {
          let hasError = !(
            _formValues.account_number.value ===
            _formValues.confirm_account_number.value
          );
          _formValues[key].error = !(
            _formValues.account_number.value ===
            _formValues.confirm_account_number.value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
      });
      if (!formObjectHasError) {
        await updateBank();
      } else {
        setFormValues(_formValues);
      }

      // setStep((prevStep) => prevStep + 1);
    } else if (step === 9) {
      agreeKFS();
      // setStep((prevStep) => prevStep + 2);
    } else if (step === 10) {
      setOpenTermsDrawer(true);
    } else if (step === 11) {
      alert("Form submitted successfully");
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const onInputChange = (
    id: keyof typeof defaultFormValues,
    value: string | boolean
  ) => {
    let _formValues = { ...formValues };
    _formValues[id].value = value;
    _formValues[id].error = false;
    setFormValues(_formValues);
  };

  const onSameAsAboveClick = (value: boolean) => {
    const _formValues = { ...formValues };
    if (value) {
      _formValues.current_address.value = _formValues.business_address.value;
      _formValues.current_pincode.value =
        _formValues.business_address_pincode.value;
      setFormValues(_formValues);
    } else {
      _formValues.current_address.value = "";
      _formValues.current_pincode.value = "";
      setFormValues(_formValues);
    }
  };

  const houseDropDown = ["Owned", "Rented"];
  const genderDropdDown = [
    { key: "M", value: "Male" },
    { key: "F", value: "Female" },
    { key: "O", value: "Other" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        getGeolocation()
          .then((position: any) => {
            setPosition(position);
          })
          .catch((error) => {
            setCustomError({
              image: false,
              Heading: "Please Enable Location",
              Description: error,
            });
          });
        const searchParams = new URLSearchParams(location.search);
        // const urlMsg = searchParams.get("msg");
        const refId = searchParams.get("RefId");
        // if (urlMsg !== null) {
        //   const fixedUrl = urlMsg.replace(/ /g, "+");
        //   let msg = crypto.CryptoGraphDecrypt(fixedUrl);
        //   msg = msg.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
        //   const esignMsg = JSON.parse(msg);
        //   await getOffers(undefined, true);
        //   if (esignMsg.Status === "Fail") {
        //     toast.error(esignMsg.Msg || "E-sign failed please retry");

        //     setStep(11);
        //   } else {
        //     toast.success(esignMsg.Msg || "E-sign successfull");

        //     setStep(11);
        //   }
        // } else
        if (refId !== null) {
          // localStorage.setItem("REFID", refId);
          await getOffers(refId);
          // setStep(10); //hcoded
          // console.log("Processing based on Refid:", refId);
        } else {
          setCustomError({
            image: true,
            Heading: "Page Not Found",
            Description:
              "Sorry, the page you are looking for could not be found.",
          });
          // console.log("No relevant parameter found.");
        }
      } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching IP address or processing offers:", error);
      }
    };

    fetchData();
  }, []);

  const getOffers = async (refID?: string, getStepsKey: boolean = false) => {
    // if (!refID) {
    //   let localRefID = localStorage.getItem("REFID")!;
    //   refID = localRefID;
    // }
    setStep(1);
    const body = {
      RefID: refID,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));

    await api.app
      .post<GetOffersResponseType>({
        url: "/api/GetOffers",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          let offerDetails = data.message;
          offerDetails.loanAmount = Math.round(Number(offerDetails.loanAmount));
          offerDetails.tenor = Math.round(Number(offerDetails.tenor));
          const expiryDate = new Date(offerDetails?.ExpiryDate);
          const today = new Date();
          if (expiryDate < today) {
            return setCustomError({
              image: false,
              Heading: "Loan Offer Expired",
              Description:
                "Sorry, but the loan offer you were considering has expired",
            });
          }
          setOffers(offerDetails);
          let _formValues = { ...formValues };
          _formValues.ref_id.value = refID as string;
          _formValues.mobile_no.value = offerDetails.MobileNumber;
          _formValues.merchant_id.value = offerDetails.Merchant_Id;
          setFormValues(_formValues);
          // if (getStepsKey) {
          //   await getSteps(
          //     data.message.Merchant_Id,
          //     data.message.ApplicationID,
          //     data.message.loanAmount.toString(),
          //     data.message.LoanStatus
          //   );
          // }
        } else {
          setCustomError({
            image: true,
            Heading: "Page Not Found",
            Description:
              "Sorry, the page you are looking for could not be found.",
          });
          toast.error(`${data.message}`);
        }
      })
      .catch((error: AxiosError) => {
        setCustomError({
          image: true,
          Heading: error.message,
          Description:
            "Sorry, the page you are looking for could not be found.",
        });
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const sendOTP = async (resend?: boolean) => {
    const body = {
      MobileNumber: formValues.mobile_no.value,
      RefID: formValues.ref_id.value,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app

      .post<SendOTPAPIResponse>({
        url: "/api/SendOTP",
        requestBody: encryptedBody,
      })
      .then((res) => {
        setIsLoading(false);
        const { data } = res;
        if (data.status === "Success") {
          setVerificationToken(data.OTPToken);
          setInterval(() => {
            setCountDownTimer((PrevCountDown) => PrevCountDown - 1);
          }, 1000);
          toast.success(data.message);
          if (resend) {
            setCountDownTimer(120);
          } else {
            setStep((prevStep) => prevStep + 1);
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const verifyOTP = async () => {
    const body = {
      MobileNumber: formValues.mobile_no.value,
      OTP: formValues.otp.value,
      OTPToken: verificationToken,
      RefID: formValues.ref_id.value,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<APIResponseType>({
        url: "/api/OTPVerify",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        setIsLoading(false);
        const { data } = res;
        if (data.status === "Success") {
          setVerificationToken(data.Token);
          toast.success(data.message);
          const steps = await getSteps2(data.Token, step);

          // if(steps.length === 0){
          //   return  await getPersonalDetails();
          //    setStep(4);
          // }
          const nextStep = steps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (steps.length === 0) {
            await getPersonalDetails();
            return setStep(4);
          }
          if (nextStep < 0) {
            //jump to last step
            return setStep(11);
          } else if (nextStep === 0) {
            //jump to personal details
            await getPersonalDetails();
            return setStep(4);
          } else if (nextStep === 1) {
            //jump to selfie
            return setStep(5);
          } else if (nextStep === 2) {
            //jump to pan card upload
            setStep(6);
          } else if (nextStep === 3) {
            //jump to aadhar details
            setStep(7);
          } else if (nextStep === 4) {
            //jump to bank details
            await getBusinessBankDetails();
            setStep(8);
          } else if (nextStep === 5) {
            //jump to Kfs
            await getKFSHTML();
            return setStep(9);
          } else if (nextStep === 6) {
            //jump to esign
            return setStep(11);
          } else if (nextStep === 7) {
            //jump to last step
            setStep(11);
          }
          // setStep((prevStep) => prevStep + 1);
          // getPersonalDetails();
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const getPersonalDetails = async () => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetBusinessMerchantDetailsAPIResponseType>({
        url: "/api/BusinessMerchantDetails",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          // toast.success(data.Message);
          const BusinessDetailsResEntity = data.data.BusinessDetailsResEntity;
          const BusinessAddressResEntity = data.data.BusinessAddressResEntity;
          const inputDate = new Date(BusinessDetailsResEntity.DateOfBirth);
          const formattedDate = format(inputDate, "yyyy-MM-dd");
          let _formValues = { ...formValues };
          _formValues.dob.value = formattedDate;
          _formValues.email.value = BusinessDetailsResEntity.EmailId;
          _formValues.pan_number.value = BusinessDetailsResEntity.PANNo;
          if (
            BusinessDetailsResEntity.FirstName &&
            BusinessDetailsResEntity.MiddleName &&
            BusinessDetailsResEntity.LastName
          ) {
            _formValues.full_name.value =
              BusinessDetailsResEntity.FirstName.trim() +
              " " +
              BusinessDetailsResEntity.MiddleName.trim() +
              " " +
              BusinessDetailsResEntity.LastName.trim();
          } else {
            _formValues.full_name.value =
              BusinessDetailsResEntity.FirstName.trim() +
              " " +
              BusinessDetailsResEntity.LastName.trim();
          }

          _formValues.business_address_pincode.value =
            BusinessAddressResEntity.PinCode;
          _formValues.business_address.value =
            BusinessAddressResEntity.Address1 +
            BusinessAddressResEntity.Address2;
          setFormValues(_formValues);
          // await getBusinessAddressDetails();
          // setStep((prevStep) => prevStep + 1);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        // showAlert({
        //   title: error.message,
        //   description: "Please try after some time",
        // });
      });
  };

  const onSelfieClick = () => {
    fileInputRef.current?.click();
  };

  const handleCapture = (target: HTMLInputElement) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl: FileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setSelfieImage([newUrl]);
        if (newUrl.size >= 1024 * 1024 * 2) {
          const blobURL = newUrl.preview;
          const img = new Image();
          img.src = blobURL;
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          //@ts-ignore
          const mimeType = img.mimeType;
          const quality = 50;

          canvas.toBlob(
            function (blob) {
              const _newUrl: FileWithPreview = Object.assign({}, newUrl, {
                preview: URL.createObjectURL(blob!),
              });
              // Handle the compressed image
              setSelfieImage([_newUrl]);
              // uploadToServer(blob);
            },
            mimeType,
            quality
          );
        }
      }
    }
  };

  const getBusinessBankDetails = async () => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetBankListAPI>({
        url: "/api/BusinessBankDetails",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          const _banklist: BankList[] = data.data;
          setBankList(_banklist);
          let _formValues = { ...formValues };
          if (_banklist?.[0]) {
            _formValues.bank_name.value = _banklist[0].Bank;
            _formValues.ifsc_code.value = _banklist[0].IFSCCode;
            _formValues.account_holder_name.value =
              _banklist[0].AccountHolderName;
            _formValues.account_number.value = _banklist[0].AccountNumber;
            _formValues.confirm_account_number.value =
              _banklist[0].AccountNumber;
            setFormValues(_formValues);
          }
        } else {
          // toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const updateBusinessMerchantDetails = async () => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      customer_name: formValues.full_name.value,
      mobile_no: formValues.mobile_no.value,
      pan: formValues.pan_number.value,
      loan_amount: offers?.loanAmount,
      dob: formValues.dob.value,
      gender: formValues.gender.value,
      house: formValues.house.value,
      emergency: formValues.emergency_contact_number.value,
      email: formValues.email.value,
      nomineeName: "NA" ?? formValues.nominee.value,
      nomineeRelation: "NA" ?? formValues.nominee_relation.value,
      bPinCode: formValues.business_address_pincode.value,
      bAddress1: formValues.business_address.value,
      bAddress2: "",
      cPinCode: formValues.current_pincode.value,
      cAddress1: formValues.current_address.value,
      cAddress2: "",
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<APIResponseType>({
        url: "/api/update_businessMerchantDetails",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          toast.success(data.message || "Address updated successfully");
          //Personal Details step === 4
          const steps = await getSteps2(data.Token, step);

          const nextStep = steps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (steps.length === 0) {
            return setStep(5);
          }
          if (nextStep < 0) {
            //jump to last step
            return setStep(11);
          } else if (nextStep === 1 || nextStep === 0) {
            //jump to selfie
            return setStep(5);
          } else if (nextStep === 2) {
            //jump to pan card upload
            setStep(6);
          } else if (nextStep === 3) {
            //jump to aadhar details
            setStep(7);
          } else if (nextStep === 4) {
            //jump to bank details
            await getBusinessBankDetails();
            setStep(8);
          } else if (nextStep === 5) {
            //jump to Kfs
            await getKFSHTML();
            return setStep(9);
          } else if (nextStep === 6) {
            //jump to esign
            return setStep(11);
          } else if (nextStep === 7) {
            //jump to last step
            setStep(11);
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  /**
   * Document upload api.
   * @param id 1 - pancard , 2 - selfie , 3 - aadhar e-kyc .
   * @param image image to be uploaded .
   * @param imagename name of image to be uploaded.
   */
  const uploadDocument = async (
    id: "1" | "2" | "3",
    image: string,
    imagename: string
  ) => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      DocumentFileImage: image,
      DocumentFilename: imagename,
      DocID: id,
      DocNumber: id === "1" ? formValues.pan_number.value.toUpperCase() : "",
      Token: verificationToken,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetBusinessMerchantDetailsAPIResponseType>({
        url: "/api/savekycdocuments",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          toast.success(
            `${
              id === "1" ? "Pancard" : id === "2" ? "Selfie" : "Adress proof"
            } uploaded successfully`
          );
          if (id === "1") {
            //Pancard step === 6
            const steps = await getSteps2(data.Token, step);

            const nextStep = steps?.findIndex(
              ({ kycStepCompletionStatus }) =>
                kycStepCompletionStatus === "Pending"
            )!;
            if (steps.length === 0) {
              return setStep(7);
            }
            if (nextStep < 0) {
              //jump to last step
              return setStep(11);
            } else if (
              nextStep === 1 ||
              nextStep === 0 ||
              nextStep === 2 ||
              nextStep === 3
            ) {
              //jump to aadhar details
              return setStep(7);
            } else if (nextStep === 4) {
              //jump to bank details
              await getBusinessBankDetails();
              setStep(8);
            } else if (nextStep === 5) {
              //jump to Kfs
              await getKFSHTML();
              return setStep(9);
            } else if (nextStep === 6) {
              //jump to esign
              return setStep(11);
            } else if (nextStep === 7) {
              //jump to last step
              setStep(11);
            }
          } else {
            //Selfie step === 5
            const steps = await getSteps2(data.Token, step);

            const nextStep = steps?.findIndex(
              ({ kycStepCompletionStatus }) =>
                kycStepCompletionStatus === "Pending"
            )!;
            if (steps.length === 0) {
              return setStep(6);
            }
            if (nextStep < 0) {
              //jump to last step
              return setStep(11);
            } else if (nextStep === 1 || nextStep === 0 || nextStep === 2) {
              //jump to pan card upload
              return setStep(6);
            } else if (nextStep === 3) {
              //jump to aadhar details
              setStep(7);
            } else if (nextStep === 4) {
              //jump to bank details
              await getBusinessBankDetails();
              setStep(8);
            } else if (nextStep === 5) {
              //jump to Kfs
              await getKFSHTML();
              return setStep(9);
            } else if (nextStep === 6) {
              //jump to esign
              return setStep(11);
            } else if (nextStep === 7) {
              //jump to last step
              setStep(11);
            }
          }

          // setStep((prevStep) => prevStep + 1);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const generateAadharOTP = async () => {
    const body = {
      AadhaarNo: formValues.aadhar_no.value,
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<AadharGetotpAPIRespnseType>({
        url: "/api/aadhargetotp",
        requestBody: encryptedBody,
      })
      .then((res) => {
        const { data } = res;
        if (data.status === "Success") {
          toast.success("OTP sent");
          setAadharOTPcountDownTimer(60);
          startAadharOTPTimer();
          let _formValues = { ...formValues };
          _formValues.client_id.value = data.client_id;
          setFormValues(_formValues);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const validateAadharOTP = async () => {
    const body = {
      clientId: formValues.client_id.value,
      OTP: formValues.aadhar_otp.value,

      MerchantID: formValues.merchant_id.value,
      ApplicantID: offers?.ApplicationID,
      MobileNo: "",
      ApplicationID: offers?.ApplicationID,
      Token: verificationToken,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<AadharGetotpAPIRespnseType>({
        url: "/api/aadharotpvalidate",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          toast.success("Aadhar verified successfully");
          await getBusinessBankDetails();
          //Aadhar details step === 7
          const steps = await getSteps2(data.Token, step);

          const nextStep = steps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (steps.length === 0) {
            await getBusinessBankDetails();
            setStep(8);
            return;
          }
          if (nextStep < 0) {
            //jump to last step
            return setStep(11);
          } else if (
            nextStep === 1 ||
            nextStep === 0 ||
            nextStep === 2 ||
            nextStep === 3 ||
            nextStep === 4
          ) {
            //jump to bank details
            await getBusinessBankDetails();
            setStep(8);
          } else if (nextStep === 5) {
            //jump to Kfs
            await getKFSHTML();
            return setStep(9);
          } else if (nextStep === 6) {
            //jump to esign
            return setStep(11);
          } else if (nextStep === 7) {
            //jump to last step
            setStep(11);
          }

          // setStep((prevStep) => prevStep + 1);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (formValues.aadhar_no.value.length >= 12) {
      if (isNaN(Number(formValues.aadhar_no.value))) {
        let _formValues = { ...formValues };
        _formValues.aadhar_no.error = true;
        setFormValues(_formValues);
        toast.error("Please enter valid aadhar number");
      } else {
        let _formValues = { ...formValues };
        _formValues.aadhar_no.error = false;
        setFormValues(_formValues);
        generateAadharOTP();
      }
    }
  }, [formValues.aadhar_no.value]);

  const regenerateloanoffers = async () => {
    const body = {
      MerchantID: offers?.Merchant_Id,
      LoanAmount: formValues.edit_loan_amount.value,
      ProductId: offers?.ProductId,
      LoanOffered: offers?.LoanOffered,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetRegenerateloanoffersResponseType>({
        url: "/api/regenerateloanoffers",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          let offerDetails = {
            ...data.data,
            LoanOffered: offers?.LoanOffered,
            MobileNumber: offers?.MobileNumber,
            ProductId: offers?.ProductId,
            ApplicationID: offers?.ApplicationID,
            ExpiryDate: offers?.ExpiryDate,
          };
          offerDetails.loanAmount = Math.round(Number(offerDetails.loanAmount));
          offerDetails.tenor = Math.round(Number(offerDetails.tenor));

          //@ts-ignore
          setOffers(offerDetails);
          // setKFSDetails(data.data);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const updateBank = async () => {
    const body = {
      ApplicationID: offers?.ApplicationID,
      BankName: bankList?.[selectedBankID]?.Bank ?? formValues.bank_name.value,
      IFSCCode:
        bankList?.[selectedBankID]?.IFSCCode ?? formValues.ifsc_code.value,
      AccountNumber:
        bankList?.[selectedBankID]?.AccountNumber ??
        formValues.account_number.value,
      AccountType:
        bankList?.[selectedBankID]?.AccountType ??
        formValues.bank_account_type.value,
      AccountHolderName:
        bankList?.[selectedBankID]?.AccountHolderName ??
        formValues.account_holder_name.value,
      MerchantID: formValues.merchant_id.value,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<APIResponseType>({
        url: "/api/updatebank",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          toast.success(data.message || "Bank added successfully");

          //Bank details step === 8
          const steps = await getSteps2(data.Token, step);

          const nextStep = steps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (steps.length === 0) {
            await getKFSHTML();
            setStep(9);
            return;
          }
          if (nextStep < 0) {
            //jump to last step
            return setStep(11);
          } else if (nextStep <= 5) {
            //jump to kfs
            await getKFSHTML();
            setStep(9);
            return;
          } else if (nextStep === 6) {
            //jump to esign
            return setStep(11);
          } else if (nextStep === 7) {
            //jump to last step
            setStep(11);
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const onEditAmount = async () => {
    let _formValues = { ...formValues };

    let formObjectHasError = false;
    Object.keys(_formValues).forEach((key) => {
      if (key === "edit_loan_amount") {
        let hasError =
          !validations.isRequired(_formValues[key].value) ||
          Number(_formValues[key].value) > Number(offers?.LoanOffered);
        _formValues[key].error =
          !validations.isRequired(_formValues[key].value) ||
          Number(_formValues[key].value) > Number(offers?.LoanOffered);
        if (hasError) {
          formObjectHasError = true;
        }
      }
    });
    if (!formObjectHasError) {
      setOpen(false);
      regenerateloanoffers();
    } else {
      setFormValues(_formValues);
    }
  };

  const startAadharOTPTimer = () => {
    setInterval(() => {
      setAadharOTPcountDownTimer((PrevCountDown) => PrevCountDown - 1);
    }, 1000);
  };

  const getKFSHTML = async (ApplicationID?: string) => {
    const body = {
      ApplicationID: ApplicationID || offers?.ApplicationID,
      MerchantID: formValues.merchant_id.value,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<EsignResponseType>({
        url: "/gettermsconditions",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          setKFSHTML(data.data);
        } else {
          toast.error(data.data);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const agreeKFS = async () => {
    const body = {
      LATLNG: `${position?.latitude}|${position?.longitude}`,
      IPAddress: "",
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      ResponseURL: "NA",
      Token: verificationToken,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<ESignPacketsAPI>({
        url: "/agreekfs",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          setStep(11);
        } else {
          toast.error(data.data);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      })
      .finally(() => setAlreadyRequest(false));
  };

  const getEsignRequestPackets = async () => {
    if (alreadyRequest) return;
    setAlreadyRequest(true);
    const body = {
      LATLNG: `${position?.latitude}~${position?.longitude}`,
      IPAddress: "",
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
      ResponseURL: "http://localhost:5173",
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<ESignPacketsAPI>({
        url: "/getesignrequestpackets",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          let msg = JSON.parse(data.data);
          let resultMessage = msg;
          const esignUrl = data.redirect;

          // Create a meta element
          var metaCharset = document.createElement("meta");
          metaCharset.setAttribute("charset", "ISO-8859-1");
          var head = document.head || document.getElementsByTagName("head")[0];
          head.appendChild(metaCharset);
          var form = document.createElement("form");
          // form.setAttribute("id", "my-from");
          form.setAttribute("method", "post");
          form.setAttribute("action", esignUrl);

          // setting form target to a window named 'formresult'
          form.setAttribute("target", "_self");

          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("id", "msg");
          hiddenField.setAttribute("name", "msg");
          hiddenField.setAttribute("value", resultMessage);
          form.appendChild(hiddenField);
          document.body.appendChild(form);
          form.submit();

          setTimeout(() => document.body.removeChild(form), 500);

          setOpenTermsDrawer(false);
        } else {
          toast.error(data.data);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      })
      .finally(() => setAlreadyRequest(false));
  };

  useEffect(() => {
    if (step === 11) {
      getEsignAgreement();
    }
  }, [step]);

  const getEsignAgreement = async () => {
    // getesigndocument
    const body = {
      ApplicationID: offers?.ApplicationID,
      MerchantID: formValues.merchant_id.value,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<EsignResponseType>({
        url: "/api/getesigndocument",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          setESignUrl(data.data);
        } else {
          // toast.error(data.data);
        }
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const getSteps2 = async (Token?: string, currentStep?: number) => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      ApplicationID: offers?.ApplicationID,
      MobileNo: formValues?.mobile_no.value,
      LoanAmount: offers?.loanAmount,
      Token: Token ?? verificationToken,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    try {
      const res = await api.app.post<GetStepsAPIResponseType>({
        url: "/api/getapplicantmerchantdetails",
        requestBody: encryptedBody,
      });

      const { data } = res;
      if (data.message === "Invalid or expire application.") {
        if (offers?.LoanStatus !== "1" && !data.Token) {
          setCustomError({
            image: false,
            Heading: "Loan Application Already Submitted",
            Description: "It looks like you've already applied for this loan",
          });
        } else {
          setVerificationToken(data.Token);
        }
      }

      if (data.status === "Success") {
        setVerificationToken(data.Token);
        const steps = data.result;

        const nextStep = steps.findIndex(
          ({ kycStepCompletionStatus }) => kycStepCompletionStatus === "Pending"
        );

        if (nextStep === 7) {
          setStep(11);
        }

        return steps; // Return steps if everything is successful
      } else {
        if (data.message !== "Invalid or expire application.") {
          toast.error(data.message);
        }
      }

      return []; // Return empty array if no steps are found or there's an error
    } catch (error: any) {
      showAlert({
        title: error.message,
        description: "Please try after some time",
      });
      return []; // Return empty array if there's a catch error
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {AlertModal({
        title: "",
        description: "",
      })}
      <div className="container">
        <div className="flex justify-center p-2 items-center">
          {" "}
          <img src={MonarchLogo} alt="monarch-logo" />
        </div>

        {customError?.Heading ? (
          <CustomError
            image={customError?.image}
            Heading={customError?.Heading}
            Description={customError?.Description}
          />
        ) : (
          <>
            {step !== 0 && (
              <>
                <Stepper activeStep={step} />
                <div className="row">
                  <div className="col-md-6 mx-auto">
                    <div className="form-outer">
                      <form action="#">
                        {step === 1 && (
                          <OfferedLoanAmountS1
                            offers={offers}
                            handleNext={handleNext}
                          />
                        )}

                        {step === 2 && (
                          <div className="page">
                            <div className="main_step_2">
                              <h4>Enter Your Mobile Number</h4>
                              <img
                                src={Second_screen}
                                alt="enter-mobile-number-image"
                              />
                            </div>
                            <div className="main_step_2 text-left">
                              <label htmlFor="number">Mobile Number*</label>
                              <input
                                readOnly
                                value={formValues.mobile_no.value}
                                maxLength={10}
                                name="number"
                                className="form-control"
                                placeholder="Enter Mobile Number"
                                type="text"
                                onKeyDown={(e) => onlyNumberValues(e)}
                                required
                                id="number"
                                onChange={(e) =>
                                  onInputChange("mobile_no", e.target.value)
                                }
                              />
                              {formValues.mobile_no.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Please enter valid mobile number
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="field btns">
                              <button
                                disabled={isLoading}
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "next-2 next disabled:opacity-70 disabled:pointer-events-none",
                                  isLoading && "animate-pulse"
                                )}
                              >
                                send otp
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 3 && (
                          <div className="page">
                            <div className="main_step_3">
                              <h4>Verification</h4>
                              <h5>
                                We Have Sent OTP on your given Mobile Number
                              </h5>
                              <img
                                src={Second_screen}
                                alt="enter-mobile-otp-image"
                              />
                              <div className="mt-5 otp_box col-md-8 mx-auto">
                                {[...Array(6)].map((_, index) => (
                                  <input
                                    key={index}
                                    className="otp"
                                    type="password"
                                    onChange={(e) =>
                                      digitValidate(index, e.target.value)
                                    }
                                    onKeyUp={(e) =>
                                      tabChange(index, e.currentTarget.value)
                                    }
                                    onKeyDown={(e) => onlyNumberValues(e)}
                                    maxLength={1}
                                    required
                                    ref={inputRefs[index]}
                                  />
                                ))}
                              </div>
                              {formValues.otp.error ? (
                                <h6
                                  className="mt-4"
                                  style={{
                                    color: "red",
                                    fontSize: "14px",
                                    textAlign: "center",
                                  }}
                                >
                                  Please enter valid otp
                                </h6>
                              ) : (
                                ""
                              )}
                              <h4 className="mt-4">Didn't Recieve OTP ?</h4>
                              {countDownTimer > 60 && (
                                <h5>
                                  Please Wait ( 01:
                                  {countDownTimer - 60 < 10
                                    ? `0${countDownTimer - 60}`
                                    : countDownTimer - 60}{" "}
                                  )
                                </h5>
                              )}
                              {countDownTimer < 0 ? (
                                <div className="flex justify-center">
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      sendOTP(true);
                                    }}
                                    className=" border border-purple-900 "
                                    variant={"outline"}
                                  >
                                    Resend
                                  </Button>
                                </div>
                              ) : (
                                countDownTimer <= 60 && (
                                  <h5>
                                    Please Wait ( 00:
                                    {countDownTimer < 10
                                      ? `0${countDownTimer}`
                                      : countDownTimer}{" "}
                                    )
                                  </h5>
                                )
                              )}
                            </div>
                            <div className="field btns">
                              <button
                                disabled={isLoading}
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "next-2 next disabled:opacity-70 disabled:pointer-events-none",
                                  isLoading && "animate-pulse"
                                )}
                              >
                                verify
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 4 && (
                          <div className="page">
                            {/* <div className="main_step_4">
          <h4>Personal Details</h4>
          <h5 className="detailsAdditional">
            Click From The Dropdown to View More Employment Status
          </h5>
        </div> */}
                            <div
                              className="main_step_4"
                              style={{ height: 550, overflow: "auto" }}
                            >
                              <div className="Detail_Form">
                                <h4>Personal Details</h4>
                                <div className="row">
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="name">Full Name *</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        placeholder="Enter Full Name"
                                        id="name"
                                        required
                                        value={formValues.full_name.value}
                                        onChange={(e) =>
                                          onInputChange(
                                            "full_name",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.full_name.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Full name should not be empty
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label>DOB *</label>
                                      <input
                                        className="form-control"
                                        type="date"
                                        name=""
                                        placeholder="DOB"
                                        id=""
                                        value={formValues.dob.value}
                                        required
                                        onChange={(e) =>
                                          onInputChange("dob", e.target.value)
                                        }
                                      />
                                      {formValues.dob.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Please enter valid age
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="business_address">
                                        Business Address *
                                      </label>
                                      <textarea
                                        id="business_address"
                                        className="form-control"
                                        rows={2}
                                        cols={50}
                                        name="business_address"
                                        placeholder="Address Business"
                                        value={
                                          formValues.business_address.value
                                        }
                                        onChange={(e) =>
                                          onInputChange(
                                            "business_address",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.business_address.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Business address should not be empty
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="postal-code">
                                        Business Address Pincode *
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        onKeyDown={(e) => onlyNumberValues(e)}
                                        name="postal-code"
                                        placeholder="Please Enter Pincode"
                                        id="postal-code"
                                        required
                                        value={
                                          formValues.business_address_pincode
                                            .value
                                        }
                                        maxLength={6}
                                        onChange={(e) =>
                                          onInputChange(
                                            "business_address_pincode",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.business_address_pincode
                                        .error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Please enter valid
                                          business_address_pincode
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="street-address">
                                        Current Address *
                                      </label>
                                      <textarea
                                        id="street-address"
                                        className="form-control"
                                        rows={2}
                                        cols={50}
                                        name="street-address"
                                        placeholder="Current Address"
                                        value={formValues.current_address.value}
                                        onChange={(e) =>
                                          onInputChange(
                                            "current_address",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.current_address.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Current address should not be empty
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      <div className="form-check form-check-inline">
                                        <Checkbox
                                          id="sameasabove"
                                          className="form-check-input"
                                          name="sameasabove"
                                          required
                                          onCheckedChange={(checked) => {
                                            onSameAsAboveClick(
                                              checked as boolean
                                            );
                                          }}
                                        />
                                        <label
                                          htmlFor="sameasabove"
                                          className="form-check-label mt-2"
                                        >
                                          Same as above
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="current_pincode">
                                        Current Address Pincode *
                                      </label>
                                      <input
                                        id="current_pincode"
                                        className="form-control"
                                        onKeyDown={(e) => onlyNumberValues(e)}
                                        maxLength={6}
                                        name="current_pincode"
                                        placeholder="Current Address Pincode"
                                        value={formValues.current_pincode.value}
                                        onChange={(e) =>
                                          onInputChange(
                                            "current_pincode",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.current_pincode.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Current pincode should not be empty
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="Gender">Gender *</label>

                                      <select
                                        id="my-select"
                                        className="form-control"
                                        name=""
                                        onChange={(e) =>
                                          onInputChange(
                                            "gender",
                                            e.target.value
                                          )
                                        }
                                      >
                                        {genderDropdDown.map((gender, id) => {
                                          return (
                                            <option key={id} value={gender.key}>
                                              {gender.value}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="house">House *</label>

                                      <select
                                        id="my-select"
                                        className="form-control"
                                        name=""
                                        onChange={(e) =>
                                          onInputChange("house", e.target.value)
                                        }
                                      >
                                        {houseDropDown.map((i, id) => {
                                          return (
                                            <option key={id} value={i}>
                                              {i}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="number">
                                        Emergency Contact Number *
                                      </label>
                                      <input
                                        className="form-control"
                                        maxLength={10}
                                        type="text"
                                        onKeyDown={(e) => onlyNumberValues(e)}
                                        name="number"
                                        placeholder="Emergency Contact Number"
                                        id="number"
                                        required
                                        value={
                                          formValues.emergency_contact_number
                                            .value
                                        }
                                        onChange={(e) =>
                                          onInputChange(
                                            "emergency_contact_number",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.emergency_contact_number
                                        .error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Please enter valid contact number
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="email">
                                        Please Enter Email *
                                      </label>
                                      <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Please Enter Email"
                                        id="email"
                                        required
                                        value={formValues.email.value}
                                        onChange={(e) =>
                                          onInputChange("email", e.target.value)
                                        }
                                      />
                                      {formValues.email.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Please enter valid email
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  {/* <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="nominee">
                                        Nominee Name *
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="nominee"
                                        placeholder="Nominee Name"
                                        id="nominee"
                                        required
                                        value={formValues.nominee.value}
                                        onChange={(e) =>
                                          onInputChange(
                                            "nominee",
                                            e.target.value
                                          )
                                        }
                                      />
                                      {formValues.nominee.error ? (
                                        <span
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Nominee name should not be empty
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 mt-2">
                                    <div className="form-group">
                                      <label htmlFor="relation">
                                        Nominee Relation *
                                      </label>

                                      <select
                                        id="my-select"
                                        className="form-control"
                                        name="relation"
                                        onChange={(e) =>
                                          onInputChange(
                                            "nominee_relation",
                                            e.target.value
                                          )
                                        }
                                      >
                                        {relationDropDown.map((i, id) => {
                                          return (
                                            <option key={id} value={i}>
                                              {i}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="field btns">
                              <button
                                disabled={isLoading}
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "next-2 next disabled:opacity-70 disabled:pointer-events-none",
                                  isLoading && "animate-pulse"
                                )}
                              >
                                next
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 5 && (
                          <>
                            <div className="md:hidden page">
                              <h4>Click Your Selfie</h4>
                              <h5 onClick={onSelfieClick}>
                                Click here to capture your selfie
                              </h5>
                              <img
                                onClick={onSelfieClick}
                                src={Screen_5}
                                alt="clear-selfie-instructions"
                              />
                              <input
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                type="file"
                                capture="user"
                                onChange={(e) => handleCapture(e.target)}
                              />
                              {selfieImage?.[0] && (
                                <div className="relative p-2 sm:p-0 flex items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={selfieImage[0].preview}
                                      alt={selfieImage[0].name}
                                      className="h-10 w-10 shrink-0 rounded-md"
                                      width={40}
                                      height={40}
                                      loading="lazy"
                                    />
                                    <div className="flex flex-col">
                                      <p className="line-clamp-1  text-xs md:text-sm font-medium text-muted-foreground">
                                        {selfieImage[0].name.substring(0, 30)}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {(
                                          selfieImage[0].size /
                                          1024 /
                                          1024
                                        ).toFixed(2)}
                                        MB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => {
                                        if (!selfieImage) return;
                                        setSelfieImage(null);
                                      }}
                                    >
                                      <X
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">
                                        Remove file
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              )}

                              <div className="field btns">
                                <button
                                  className={cn(
                                    "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                    isLoading && "animate-pulse"
                                  )}
                                  disabled={isLoading}
                                  onClick={(e) => handleNext(e)}
                                >
                                  next
                                </button>
                              </div>
                            </div>
                            <div className="hidden md:block page">
                              <FileDialog
                                files={selfieImage}
                                setFiles={setSelfieImage}
                                image={Screen_5}
                                title={"Click Your Selfie"}
                                description={"Click here to upload your selfie"}
                              />

                              <div className="field btns">
                                <button
                                  className={cn(
                                    "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                    isLoading && "animate-pulse"
                                  )}
                                  disabled={isLoading}
                                  onClick={(e) => handleNext(e)}
                                >
                                  next
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {step === 6 && (
                          <div className="page">
                            <FileDialog
                              files={panCardImage}
                              setFiles={setPanCardImage}
                              image={Screen_6}
                              title={"PAN Card"}
                              description={"Click here to upload pan card"}
                            />
                            <div className="col-md-12 mt-2">
                              <div className="form-group">
                                <label htmlFor="pannumber">
                                  Enter PAN number *
                                </label>
                                <input
                                  style={{
                                    textTransform: "uppercase",
                                  }}
                                  className="form-control"
                                  type="password"
                                  name=""
                                  placeholder="Enter PAN Number"
                                  id="pannumber"
                                  required
                                  value={formValues.pan_number.value}
                                  maxLength={10}
                                  onChange={(e) =>
                                    onInputChange("pan_number", e.target.value)
                                  }
                                />
                                {formValues.pan_number.error ? (
                                  <span
                                    style={{ color: "red", fontSize: "14px" }}
                                  >
                                    Please enter valid pan number
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="field btns">
                              <button
                                disabled={isLoading}
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                  isLoading && "animate-pulse"
                                )}
                              >
                                next
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 7 && (
                          <div className="page pt-2">
                            <div className="col-md-12 mt-2">
                              <div className="form-group ">
                                <label htmlFor="enter_aadhar_number mt-2">
                                  Aadhar number *
                                </label>
                                <input
                                  className="form-control"
                                  type="password"
                                  name="enter_aadhar_number"
                                  placeholder="Enter aadhar number"
                                  id="enter_aadhar_number"
                                  required
                                  maxLength={12}
                                  onKeyDown={(e) => onlyNumberValues(e)}
                                  onChange={(e) =>
                                    onInputChange("aadhar_no", e.target.value)
                                  }
                                />
                                {formValues.aadhar_no.error ? (
                                  <span
                                    style={{ color: "red", fontSize: "14px" }}
                                  >
                                    Please enter correct aadhar number
                                  </span>
                                ) : (
                                  ""
                                )}{" "}
                                {isLoading &&
                                  formValues.aadhar_otp.value.length !== 6 && (
                                    <span className="text-sm">
                                      Verifying aadhar number...
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className="col-md-12 mt-2">
                              <div className="form-group">
                                <label htmlFor="aadhar_otp">Aadhar OTP *</label>
                                <input
                                  readOnly={
                                    formValues.aadhar_no.error ||
                                    formValues.aadhar_no.value.length < 12
                                  }
                                  className="form-control"
                                  type="password"
                                  name="aadhar_otp"
                                  placeholder="Enter aadhar otp"
                                  id="aadhar_otp"
                                  autoComplete="one-time-code"
                                  required
                                  maxLength={6}
                                  onKeyDown={(e) => onlyNumberValues(e)}
                                  onChange={(e) =>
                                    onInputChange("aadhar_otp", e.target.value)
                                  }
                                />
                                {formValues.aadhar_otp.error ? (
                                  <span
                                    style={{ color: "red", fontSize: "14px" }}
                                  >
                                    Please enter correct otp
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>{" "}
                            {aadharOTPcountDownTimer < 60 && (
                              <div className="flex p-4 justify-end">
                                {aadharOTPcountDownTimer < 60 &&
                                aadharOTPcountDownTimer > 0 ? (
                                  <h5>
                                    Please Wait 00:
                                    {aadharOTPcountDownTimer < 10
                                      ? `0${aadharOTPcountDownTimer}`
                                      : aadharOTPcountDownTimer}
                                  </h5>
                                ) : (
                                  ""
                                )}
                                {aadharOTPcountDownTimer <= 0 && (
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      generateAadharOTP();
                                    }}
                                    className="border border-purple-900"
                                    variant={"outline"}
                                  >
                                    Resend
                                  </Button>
                                )}
                              </div>
                            )}
                            <div className="field btns">
                              <button
                                disabled={
                                  isLoading ||
                                  formValues.aadhar_no.value.length < 12
                                }
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                  isLoading && "animate-pulse"
                                )}
                              >
                                next
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 8 && (
                          <div className="page">
                            <div className="main_step_8">
                              <h4>
                                Specify bank account for loan disbursement
                              </h4>
                              <img
                                // style={{ width: "60%" }}
                                src={Second_screen}
                                alt="enter-account-details-image"
                              />
                            </div>
                            {bankList?.[0] ? (
                              <>
                                <div
                                  className="main_step_8"
                                  style={{ maxHeight: 350, overflow: "auto" }}
                                >
                                  <RadioGroup
                                    onValueChange={(id) =>
                                      setSelectedBankID(Number(id))
                                    }
                                    defaultValue={selectedBankID.toString()}
                                  >
                                    {bankList?.map((i, id) => (
                                      <article
                                        key={id}
                                        className="flex items-start space-x-6 p-6  ring-1 ring-slate-200"
                                      >
                                        <div className="min-w-0 relative flex-auto">
                                          <Label htmlFor={i.AccountNumber}>
                                            <dt className="text-xs font-medium text-slate-400">
                                              Account holder name
                                            </dt>
                                            <h2 className="font-semibold text-[#5322ba] truncate pr-20">
                                              {i.AccountHolderName}
                                            </h2>
                                          </Label>

                                          <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
                                            <div className="absolute top-0 right-0 flex items-center space-x-1">
                                              <RadioGroupItem
                                                value={id.toString()}
                                                id={id.toString()}
                                              />
                                            </div>
                                            <div>
                                              <dt className="text-xs font-medium text-slate-400">
                                                Bank name
                                              </dt>
                                              <dd className="px-1.5 ring-1 ring-slate-200 rounded">
                                                {i.Bank}
                                              </dd>
                                            </div>
                                            <div className="ml-2">
                                              <dt className="text-xs font-medium text-slate-400">
                                                Bank Account Number
                                              </dt>
                                              <dd className="flex items-center">
                                                <svg
                                                  width="2"
                                                  height="2"
                                                  fill="currentColor"
                                                  className="mx-2 text-slate-300"
                                                  aria-hidden="true"
                                                >
                                                  <circle cx="1" cy="1" r="1" />
                                                </svg>
                                                {i.AccountNumber}
                                              </dd>
                                            </div>

                                            <div className="flex-none w-full mt-2 font-normal">
                                              <dt className="text-xs font-medium text-slate-400">
                                                Ifsc code
                                              </dt>
                                              <dd>{i.IFSCCode}</dd>
                                            </div>
                                          </dl>
                                        </div>
                                      </article>
                                    ))}
                                  </RadioGroup>
                                </div>
                                <div className="field btns">
                                  <button
                                    disabled={isLoading}
                                    onClick={(e) => handleNext(e)}
                                    className={cn(
                                      "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                      isLoading && "animate-pulse"
                                    )}
                                  >
                                    next
                                  </button>
                                </div>
                              </>
                            ) : (
                              //No bank details found update bank
                              <div className="page">
                                <div
                                  className="main_step_8"
                                  style={{ height: 350, overflow: "auto" }}
                                >
                                  <h5>
                                    {" "}
                                    No bank details found please add bank
                                    account
                                  </h5>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <label htmlFor="bank_name">
                                          Enter Bank name
                                        </label>

                                        <input
                                          className="form-control"
                                          type="text"
                                          name="bank_name"
                                          defaultValue=""
                                          placeholder="Bank bank name"
                                          id="bank_name"
                                          required
                                          onChange={(e) =>
                                            onInputChange(
                                              "bank_name",
                                              e.target.value
                                            )
                                          }
                                        />
                                        {formValues.bank_name.error ? (
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Bank name should not be empty
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <label htmlFor="my-select">
                                          Select Your Bank
                                        </label>
                                        <select
                                          id="my-select"
                                          className="form-control"
                                          name=""
                                          onChange={(e) =>
                                            onInputChange(
                                              "bank_account_type",
                                              e.target.value
                                            )
                                          }
                                          value={"SA"}
                                        >
                                          <option value={"SA"}>
                                            Savings Account
                                          </option>
                                          <option value={"CA"}>
                                            Current Account
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label htmlFor="ifsc_code">
                                          Bank IFSC Code
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          name="ifsc_code"
                                          defaultValue=""
                                          placeholder="Bank IFSC Code"
                                          id="ifsc_code"
                                          required
                                          onChange={(e) =>
                                            onInputChange(
                                              "ifsc_code",
                                              e.target.value
                                            )
                                          }
                                        />
                                        {formValues.ifsc_code.error ? (
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "14px",
                                            }}
                                          >
                                            IFSC code should not be empty
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label htmlFor="account_holder_name">
                                          Account Holder Name
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          name="account_holder_name"
                                          defaultValue=""
                                          placeholder="Account Holder Name"
                                          id="account_holder_name"
                                          required
                                          onChange={(e) =>
                                            onInputChange(
                                              "account_holder_name",
                                              e.target.value
                                            )
                                          }
                                        />
                                        {formValues.account_holder_name
                                          .error ? (
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Account holder name should not empty
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label htmlFor="account_number">
                                          Account Number
                                        </label>
                                        <input
                                          className="form-control"
                                          type="password"
                                          name="account_number"
                                          onKeyDown={(e) => onlyNumberValues(e)}
                                          placeholder="Account Number"
                                          id="account_number"
                                          required
                                          onChange={(e) =>
                                            onInputChange(
                                              "account_number",
                                              e.target.value
                                            )
                                          }
                                        />
                                        {formValues.account_number.error ? (
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Please enter valid account number
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                      <div className="form-group">
                                        <label htmlFor="confirm_account_number">
                                          Confirm Account Number
                                        </label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          name="confirm_account_number"
                                          placeholder="Confirm Account Number"
                                          id="confirm_account_number"
                                          required
                                          onKeyDown={(e) => onlyNumberValues(e)}
                                          onChange={(e) =>
                                            onInputChange(
                                              "confirm_account_number",
                                              e.target.value
                                            )
                                          }
                                        />
                                        {formValues.confirm_account_number
                                          .error ? (
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Account number mismatch
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="field btns">
                                  <button
                                    disabled={isLoading}
                                    onClick={(e) => handleNext(e)}
                                    className={cn(
                                      "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                      isLoading && "animate-pulse"
                                    )}
                                  >
                                    next
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {step === 9 && (
                          <div className="page overflow-auto max-h-[600px]">
                            {offers ? <KFSDetailsCard offers={offers} /> : ""}

                            {KFSHTML && (
                              <div
                                className="main_step_10bottom"
                                dangerouslySetInnerHTML={{ __html: KFSHTML }}
                              ></div>
                            )}
                            <div className="field btns">
                              <button
                                disabled={isLoading}
                                onClick={(e) => handleNext(e)}
                                className="submit disabled:opacity-70 disabled:pointer-events-none"
                              >
                                Agree
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 10 && (
                          <div className="page">
                            <div className="main_step_8">
                              <h4>E-sign customer agreement</h4>
                              <img
                                // style={{ width: "60%" }}
                                src={EsignSteps}
                                alt="enter-account-details-image"
                              />
                            </div>
                            {/* <div
                              dangerouslySetInnerHTML={{ __html: esignTerms! }}
                              className="main_step_9 col-md-12 pt-2 bg-cover max-h-[32rem]   overflow-auto relative"
                            ></div> */}
                            <div className="check_box">
                              <div className="check">
                                <div className="form-check form-check-inline">
                                  <Checkbox
                                    checked={formValues.esign_terms.value}
                                    // value={formValues.esign_terms.value}
                                    id="esign_terms"
                                    className="form-check-input"
                                    name="esign_terms"
                                    defaultValue="true"
                                    required
                                    onCheckedChange={(checked) => {
                                      onInputChange("esign_terms", checked);
                                    }}
                                  />
                                  <label
                                    htmlFor="esign_terms"
                                    className="form-check-label"
                                  >
                                    I have read and agree to the{" "}
                                    <a
                                      target="_blank"
                                      href="https://paypointindia.co.in/PDF/retailer_agreement.pdf"
                                    >
                                      customer agreement
                                    </a>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="field btns">
                              <button
                                disabled={
                                  isLoading || !formValues.esign_terms.value
                                }
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                                  isLoading && "animate-pulse"
                                )}
                              >
                                next
                              </button>
                            </div>
                          </div>
                        )}
                        {/* TODO second terms  */}
                        <Drawer
                          onOpenChange={(open) => {
                            setOpenTermsDrawer(open);
                          }}
                          open={openTermsDrawer}
                          shouldScaleBackground
                        >
                          <DrawerContent>
                            <div className="mx-auto  overflow-auto w-full">
                              <DrawerHeader>
                                <DrawerTitle>
                                  E-sign Terms And Conditions
                                </DrawerTitle>
                              </DrawerHeader>
                              <div className="modal-body p-0">
                                <div
                                  className="col-sm-12"
                                  id="staticBackdropAadharWrap"
                                  style={{
                                    padding: "10px 50px",
                                    // height: 590,
                                    minHeight: 200,
                                    overflowY: "scroll",
                                    textAlign: "justify",
                                  }}
                                >
                                  <div
                                    className="container"
                                    // dangerouslySetInnerHTML={{
                                    //   __html: esignTerms2!,
                                    // }}
                                  >
                                    <div className="col-sm-12 tca">
                                      <p>
                                        I hereby authorize Protean eGov
                                        Technologies Limited (Protean) to -
                                      </p>
                                      <ul className="list-decimal pl-3 mt-4 space-y-2 ">
                                        <li>
                                          {" "}
                                          Use my Aadhaar / Virtual ID details
                                          (as applicable) for the purpose of e
                                          sign of Loan Agreement &nbsp;with
                                          Monarch Networth Finserve Private
                                          Limited) authenticate my identity
                                          through the Aadhaar Authentication
                                          system (Aadhaar based e-KYC services
                                          of UIDAI) in accordance with the
                                          provisions of the Aadhaar (Targeted
                                          Delivery of Financial and other
                                          Subsidies, Benefits and Services) Act,
                                          2016 and the allied rules and
                                          regulations notified thereunder and
                                          for no other purpose.
                                        </li>
                                        <li>
                                          Authenticate my Aadhaar/Virtual ID
                                          through OTP or Biometric for
                                          authenticating my identity through the
                                          Aadhaar Authentication system for
                                          obtaining my e-KYC through Aadhaar
                                          based e-KYC services of UIDAI and use
                                          my Photo and Demographic details
                                          (Name, Gender, Date of Birth and
                                          Address) for the purpose of e sign of
                                          Loan Agreement with&nbsp;&nbsp;Monarch
                                          Networth Finserve Private
                                          Limited&nbsp;
                                        </li>
                                        <li>
                                          I understand that Security and
                                          confidentiality of personal identity
                                          data provided, for the purpose of
                                          Aadhaar based authentication is
                                          ensured by Protean and the data will
                                          be stored by Protean till such time as
                                          mentioned in guidelines from UIDAI
                                          from time to time.
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-end rounded-br-[calc(0.3rem_-_1px)] rounded-bl-[calc(0.3rem_-_1px)] p-3 border-t-[#dee2e6] border-t border-solid mx-auto">
                                <div className="container space-x-2 flex">
                                  <Button
                                    onClick={() => getEsignRequestPackets()}
                                    type="button"
                                    disabled={isLoading}
                                    className={cn(
                                      "disabled:opacity-70 disabled:pointer-events-none",
                                      isLoading && "animate-pulse"
                                    )}
                                  >
                                    Agree
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setOpenTermsDrawer(false);
                                    }}
                                    disabled={isLoading}
                                    className={cn(
                                      "disabled:opacity-70 disabled:pointer-events-none",
                                      isLoading && "animate-pulse"
                                    )}
                                    type="button"
                                    variant={"outline"}
                                  >
                                    Close
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                        {step === 11 && (
                          // <div className="page">
                          <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                              <div className="flex space-x-2 items-center">
                                <Icons.AlertCircleIcon className="text-[#5322ba] h-6 w-6" />
                                <h2 className="text-xl font-semibold">
                                  Loan sanctioned
                                </h2>
                              </div>
                            </div>
                            <div className="mt-6 p-6 bg-gray-100 rounded-lg">
                              <div className="text-center">
                                <h3 className="text-lg font-medium">
                                  Loan amount
                                </h3>
                                <p className="text-4xl font-bold mt-2">
                                  ₹ {offers?.loanAmount}
                                </p>
                              </div>
                              <hr className="my-6 border-[#5322ba]" />
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="font-medium">EDMI</p>
                                  <p className="font-bold">
                                    ₹ {Math.round(offers?.emi!)}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Tenure</p>
                                  <p className="font-bold">
                                    {offers?.tenor} days
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Interest</p>
                                  <p className="font-bold">
                                    {offers?.interest}% p.m
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6">
                              <div className="flex space-x-2 items-center">
                                <Icons.InfoIcon className="text-[#5322ba] h-6 w-6" />
                                <p className="text-sm">
                                  Your Loan application has been acknowledged.
                                  The amount will be disbursed within 24 working
                                  hours subject to final approval.
                                </p>
                              </div>
                              {eSignUrl && (
                                <div className="flex justify-center items-center cursor-pointer p-2">
                                  <a
                                    href={`${baseURL}/vhost/${eSignUrl}`}
                                    className="text-center"
                                    target="_blank"
                                    download="esignagreement.pdf"
                                  >
                                    View agreement
                                  </a>
                                </div>
                              )}

                              {bankList?.[selectedBankID] && (
                                <>
                                  <hr className="my-6 border-gray-300" />
                                  <h3 className=" font-black">
                                    Loan disbured will be credited to below bank
                                    account
                                  </h3>
                                  <div className="p-2 mt-2 space-y-4 rounded-lg border border-t-[#131314] border-black">
                                    {/* <div className="p-2 space-x-2 border border-solid   border-black"></div> */}
                                    <div className="flex   items-center space-x-2">
                                      <Landmark className="text-[#5322ba] h-6 w-6" />
                                      <div>
                                        <h4 className="font-semibold">
                                          {bankList?.[selectedBankID].Bank}
                                        </h4>
                                        <p className="text-sm">
                                          {bankList?.[selectedBankID]
                                            .AccountType === "SB"
                                            ? "Savings Account"
                                            : "Current Account"}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        <CircleCheckBig
                                          style={{
                                            color: "green",
                                            display: "inline-flex",
                                            marginRight: "0.2rem",
                                          }}
                                          height={"18"}
                                          width={"18"}
                                        />{" "}
                                        Account Number -{" "}
                                        <span className="font-semibold">
                                          {
                                            bankList?.[selectedBankID]
                                              .AccountNumber
                                          }
                                        </span>
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium">
                                        <CircleCheckBig
                                          style={{
                                            color: "green",
                                            display: "inline-flex",
                                            marginRight: "0.2rem",
                                          }}
                                          height={"18"}
                                          width={"18"}
                                        />{" "}
                                        IFSC Code -{" "}
                                        <span className="font-semibold">
                                          {bankList?.[selectedBankID].IFSCCode}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            {/* <div className="mt-4 text-center">
                              <p className="text-xs text-gray-500">
                                Lending partner
                              </p>
                              <img
                                alt="Lending Partner Logo"
                                className="inline-block h-6"
                                height="24"
                                src={MonarchLogo}
                                style={{
                                  aspectRatio: "100/24",
                                  objectFit: "cover",
                                }}
                                width="100"
                              />
                            </div> */}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default index;
