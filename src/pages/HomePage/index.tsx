import { FC, useEffect, useRef, useState } from "react";
import { type AxiosError } from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

import coin from "../../assets/images/coin.png";
import Second_screen from "../../assets/images/Second_screen.jpg";
import Screen_5 from "../../assets/images/Screen_5.jpg";
import Screen_6 from "../../assets/images/Screen_6.jpg";
import MonarchLogo from "../../assets/images/monarch-logo.png";

import validations from "@/lib/validations";
import crypto from "@/lib/crypto";
import api from "@/services/api";
import { FileDialog } from "@/components/ui/file-dialog";
import {
  BankList,
  FileWithPreview,
  GeoLocationAPIResponeObject,
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
  Steps,
} from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlert } from "@/components/modals/alert-modal";

import "./style.css";
import { cn, getBase64, onlyNumberValues } from "@/lib/utils";
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
import Stepper from "@/components/Stepper";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

import { Icons } from "@/components/ui/Icons";
import ErrorComponent from "@/components/Error";

const index: FC = () => {
  const [step, setStep] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [KFSDetails, setKFSDetails] =
    useState<GetRegenerateloanoffersResponseType["data"]>();
  const [alreadyRequest, setAlreadyRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const [countDownTimer, setCountDownTimer] = useState(120);
  const [selectedBankID, setSelectedBankID] = useState(0);
  const [aadharOTPcountDownTimer, setAadharOTPcountDownTimer] = useState(60);
  const [locationDetails, setLocationDetails] =
    useState<GeoLocationAPIResponeObject>();
  const [esignTerms, setEsignTerms] = useState<string>();
  const [esignTerms2, setEsignTerms2] = useState<string>();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [bankList, setBankList] = useState<BankList[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [KFSHTML, setKFSHTML] = useState<string>();
  const [openTermsDrawer, setOpenTermsDrawer] = useState(false);
  const [apiSteps, setApiSteps] = useState<Steps>();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ErrorPage, setErrorPage] = useState(false);

  const [selfieImage, setSelfieImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [panCardImage, setPanCardImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [showAlert, AlertModal] = useAlert();

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
      await getEsignRequestTerms("/getesignrequestterms1");
      setStep((prevStep) => prevStep + 1);
    } else if (step === 10) {
      eSignCheckBoxValidtion();
      // await getEsignRequestTerms("/getesignrequestterms2");
      // setOpenTermsDrawer(true);
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
  const relationDropDown = ["Father", "Mother", "Daughter"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getIPAddress();
        const searchParams = new URLSearchParams(location.search);
        const urlMsg = searchParams.get("msg");
        const refId = searchParams.get("RefId");
        if (urlMsg !== null) {
          let msg = crypto.CryptoGraphDecrypt(urlMsg);
          msg = msg.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
          const esignMsg = JSON.parse(msg);
          // console.log("esignmsg", esignMsg);
          await getOffers(undefined, false);
          if (esignMsg.Status === "Fail") {
            toast.error(esignMsg.Msg || "E-sign failed please retry");

            setStep(10);
          } else {
            toast.success(esignMsg.Msg || "E-sign successfull");

            setStep(11);
          }
        } else if (refId !== null) {
          localStorage.setItem("REFID", refId);
          await getOffers(refId);
          // setStep(8); //hcoded
          // console.log("Processing based on Refid:", refId);
        } else {
          setErrorPage(true);
          // console.log("No relevant parameter found.");
        }
      } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching IP address or processing offers:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (step === 10) {
      getEsignRequestTerms("/getesignrequestterms1");
    }
  }, [step]);

  const getIPAddress = async () => {
    const response = await fetch("https://geolocation-db.com/json/");
    const data: GeoLocationAPIResponeObject = await response.json();
    setLocationDetails(data);
  };

  const getOffers = async (refID?: string, getStepsKey: boolean = true) => {
    if (!refID) {
      let localRefID = localStorage.getItem("REFID")!;
      refID = localRefID;
    }
    setStep(1);
    const body = {
      RefID: refID,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));

    await api.app
      .post<GetOffersResponseType>({
        url: "/GetOffers",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          let offerDetails = data.message;
          offerDetails.loanAmount = Math.round(Number(offerDetails.loanAmount));
          offerDetails.tenor = Math.round(Number(offerDetails.tenor));
          setOffers(offerDetails);
          let _formValues = { ...formValues };
          _formValues.mobile_no.value = offerDetails.MobileNumber;
          _formValues.merchant_id.value = offerDetails.Merchant_Id;
          setFormValues(_formValues);
          if (getStepsKey) {
            await getSteps(
              data.message.Merchant_Id,
              data.message.ApplicationID,
              data.message.loanAmount.toString()
            );
          }
        } else {
          setErrorPage(true);
          toast.error(`${data.message}`);
        }
      })
      .catch((error: AxiosError) => {
        setErrorPage(true);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const sendOTP = async (resend?: boolean) => {
    const body = { MobileNumber: formValues.mobile_no.value };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app

      .post<APIResponseType>({
        url: "/SendOTP",
        requestBody: encryptedBody,
      })
      .then((res) => {
        setIsLoading(false);
        const { data } = res;
        if (data.status === "Success") {
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
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<APIResponseType>({
        url: "/OTPVerify",
        requestBody: encryptedBody,
      })
      .then((res) => {
        setIsLoading(false);
        const { data } = res;
        if (data.status === "Success") {
          toast.success(data.message);
          setStep((prevStep) => prevStep + 1);
          getPersonalDetails();
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
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetBusinessMerchantDetailsAPIResponseType>({
        url: "/BusinessMerchantDetails",
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
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
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
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetBankListAPI>({
        url: "/BusinessBankDetails",
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
      Application_ID: offers?.ApplicationID,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<APIResponseType>({
        url: "/update_businessMerchantDetails",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          toast.success(data.message || "Address updated successfully");
          //Personal Details step === 4
          let nextStep = apiSteps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (!nextStep) {
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
            await getEsignRequestTerms("/getesignrequestterms1");
            return setStep(10);
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
   * @param imagename name of image to be uploaded .
   */
  const uploadDocument = async (
    id: "1" | "2" | "3",
    image: string,
    imagename: string
  ) => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      Application_ID: offers?.ApplicationID,
      DocumentFileImage: image,
      DocumentFilename: imagename,
      DocID: id,
      DocNumber: id === "1" ? formValues.pan_number.value.toUpperCase() : "",
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetBusinessMerchantDetailsAPIResponseType>({
        url: "/savekycdocuments",
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
            let nextStep = apiSteps?.findIndex(
              ({ kycStepCompletionStatus }) =>
                kycStepCompletionStatus === "Pending"
            )!;
            if (!nextStep) {
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
              await getEsignRequestTerms("/getesignrequestterms1");
              return setStep(10);
            } else if (nextStep === 7) {
              //jump to last step
              setStep(11);
            }
          } else {
            //Selfie step === 5
            let nextStep = apiSteps?.findIndex(
              ({ kycStepCompletionStatus }) =>
                kycStepCompletionStatus === "Pending"
            )!;
            if (!nextStep) {
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
              await getEsignRequestTerms("/getesignrequestterms1");
              return setStep(10);
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
      ApplicantID: offers?.ApplicationID,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<AadharGetotpAPIRespnseType>({
        url: "/aadhargetotp",
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
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<AadharGetotpAPIRespnseType>({
        url: "/aadharotpvalidate",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          toast.success("Aadhar verified successfully");
          await getBusinessBankDetails();
          //Aadhar details step === 7
          let nextStep = apiSteps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (!nextStep) {
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
            await getEsignRequestTerms("/getesignrequestterms1");
            return setStep(10);
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

  const getSteps = async (
    MerchantID?: string,
    ApplicationID?: string,
    LoanAmount?: string
  ) => {
    const body = {
      MerchantID: formValues.merchant_id.value || MerchantID,
      ApplicationID: ApplicationID || offers?.ApplicationID,
      LoanAmount: LoanAmount || offers?.loanAmount,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetStepsAPIResponseType>({
        url: "/getapplicantmerchantdetails",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          const steps = data.result;
          setApiSteps(steps);
          const nextStep = steps.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          );
          if (nextStep === 0) {
            return setStep(1);
            // await getPersonalDetails();
          } else if (nextStep === 4) {
            await getBusinessBankDetails();
          } else if (nextStep === 5) {
            await getKFSHTML(ApplicationID);
            return setStep(9);
          } else if (nextStep === 6) {
            await getEsignRequestTerms("/getesignrequestterms1", ApplicationID);
            return setStep(10);
          } else if (nextStep === 7) {
            return setStep(11);
          }

          setStep(nextStep + 4);
        } else {
          if (data.message === "Invalid or expire application.") return;
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

  const eSignCheckBoxValidtion = async () => {
    var checkbox = document.getElementById("chk") as HTMLInputElement;

    if (checkbox.checked) {
      await getEsignRequestTerms("/getesignrequestterms2");
      setOpenTermsDrawer(true);
      //proceed
      // history.push("/merchant-esign-terms");
      // getMerchantTEsignTerms();
    } else {
      showAlert({
        title: "Please click the check box",
        description: "Agree the terms and conditions to proceed",
      });
    }
  };

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
        url: "/regenerateloanoffers",
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
      Application_id: offers?.ApplicationID,
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
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<APIResponseType>({
        url: "/updatebank",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          toast.success(data.message || "Bank added successfully");

          //Bank details step === 8
          let nextStep = apiSteps?.findIndex(
            ({ kycStepCompletionStatus }) =>
              kycStepCompletionStatus === "Pending"
          )!;
          if (!nextStep) {
            await getKFSHTML();
            setStep(9);
            return;
          }
          if (nextStep < 0) {
            //jump to last step
            return setStep(11);
          } else if (nextStep <= 5) {
            //jump to kfs
            // await getEsignRequestTerms("/getesignrequestterms1");
            await getKFSHTML();
            setStep(9);
            return;
          } else if (nextStep === 6) {
            //jump to esign
            await getEsignRequestTerms("/getesignrequestterms1");
            return setStep(10);
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

  const getEsignRequestTerms = async (
    url: "/getesignrequestterms1" | "/getesignrequestterms2",
    ApplicationID?: string
  ) => {
    const body = {
      LATLNG: `${locationDetails?.latitude}~${locationDetails?.longitude}`,
      IPAddress: locationDetails?.IPv4,

      ApplicationID: ApplicationID ?? offers?.ApplicationID,

      ResponseURL: "NA",
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<EsignResponseType>({
        url: url,
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          if (url === "/getesignrequestterms1") {
            setEsignTerms(data.data);
          } else {
            setEsignTerms2(data.data);
          }
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

  const getKFSHTML = async (ApplicationID?: string) => {
    const body = {
      ApplicationID: ApplicationID || offers?.ApplicationID,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .postKFS<EsignResponseType>({
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

  const getEsignRequestPackets = async () => {
    if (alreadyRequest) return;
    setAlreadyRequest(true);
    const body = {
      LATLNG: `${locationDetails?.latitude}~${locationDetails?.longitude}`,
      IPAddress: locationDetails?.IPv4,
      ApplicationID: offers?.ApplicationID,
      ResponseURL: "http://localhost:5173",
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .postEsign<ESignPacketsAPI>({
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

        {ErrorPage ? (
          <ErrorComponent />
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
                          <div className="page slide-page">
                            <div className="main_step_1 form-card overflow-auto max-h-[600px]">
                              {offers ? (
                                <div className="step_1">
                                  <div className="coin_img">
                                    <img src={coin} alt="coin-image" />
                                  </div>
                                  <div className="contenttext">
                                    {/* <label>Your loan amount</label> */}
                                    <p>
                                      Offered loan amount <br />
                                      <i
                                        className="fa fa-inr"
                                        aria-hidden="true"
                                      />
                                      {" " + offers.loanAmount + " "}{" "}
                                      <Dialog
                                        open={open}
                                        onOpenChange={setOpen}
                                      >
                                        <DialogTrigger asChild>
                                          <Button
                                            size={"rounded"}
                                            variant={"ghost"}
                                            type="button"
                                          >
                                            <i
                                              style={{ fontSize: "20px" }}
                                              className="fa fa-pen"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Edit loan amount
                                            </DialogTitle>
                                            <DialogDescription>
                                              <b className="text-black/70">
                                                Edited amount should not be
                                                greater than ₹
                                                {offers.LoanOffered}
                                              </b>
                                            </DialogDescription>
                                          </DialogHeader>
                                          <form
                                            onSubmit={(event) => {
                                              event.preventDefault();
                                              onEditAmount();
                                            }}
                                          >
                                            <div className="grid gap-2">
                                              <div className="form-group">
                                                <label htmlFor="amount">
                                                  Amount
                                                </label>
                                                <input
                                                  className="form-control"
                                                  type="text"
                                                  name="amount"
                                                  placeholder="Enter amount"
                                                  id="amount"
                                                  value={
                                                    formValues.edit_loan_amount
                                                      .value
                                                  }
                                                  required
                                                  maxLength={12}
                                                  onKeyDown={(e) =>
                                                    onlyNumberValues(e)
                                                  }
                                                  onChange={(e) =>
                                                    onInputChange(
                                                      "edit_loan_amount",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                {formValues.edit_loan_amount
                                                  .error ? (
                                                  <span
                                                    style={{
                                                      color: "red",
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    Amount should not be less
                                                    than offered amount
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>

                                            <Button
                                              disabled={
                                                formValues.edit_loan_amount
                                                  .error ||
                                                formValues.edit_loan_amount
                                                  .value === ""
                                              }
                                              className="w-full"
                                              type="submit"
                                            >
                                              Save changes
                                            </Button>
                                          </form>
                                        </DialogContent>
                                      </Dialog>
                                    </p>
                                    <strong>Tenor: {offers.tenor} days</strong>
                                    <span>
                                      Offer Expriy Date:
                                      {" " +
                                        format(
                                          new Date(offers.ExpiryDate),
                                          "dd/MM/yyyy"
                                        )}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <Skeleton className="bg-cover min-h-[480px] relative shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] m-[15px] rounded-[15px]" />
                              )}
                              <div className="main_step_10bottom">
                                <div className="loanDetails">
                                  {offers && (
                                    <>
                                      <p>
                                        Tenor <span>{offers?.tenor} days</span>
                                      </p>
                                      <p>
                                        Offer Expiry Date{" "}
                                        <span>
                                          {format(
                                            new Date(offers?.ExpiryDate!),
                                            "dd/MM/yyyy"
                                          )}
                                        </span>
                                      </p>
                                    </>
                                  )}

                                  <p>
                                    Daily Installment Amount
                                    <span>
                                      <i
                                        className="fa fa-inr"
                                        aria-hidden="true"
                                      />
                                      {Math.round(offers?.emi!)}
                                    </span>
                                  </p>
                                  <p>
                                    Number of Installments{" "}
                                    <span> {offers?.noOfPayment} </span>
                                  </p>
                                </div>
                                <div className="loanDetails">
                                  <p>
                                    Interest Rate
                                    <span>{offers?.interest}%</span>
                                  </p>
                                  <p>
                                    Processing Fees {/* <span> */}(
                                    {offers?.interest}% + {offers?.gst}%)
                                    {/* </span> */}
                                    <span>
                                      <i
                                        className="fa fa-inr"
                                        aria-hidden="true"
                                      />
                                      {offers?.processingFee.toFixed(2)}
                                    </span>
                                  </p>
                                  <p>
                                    Net Disbursed Amount
                                    <span>
                                      <i
                                        className="fa fa-inr"
                                        aria-hidden="true"
                                      />
                                      {offers?.netDisbursement.toFixed(2)}
                                    </span>
                                  </p>
                                  {/* <p>
                                    GST
                                    <span> {offers?.gst}%</span>
                                  </p> */}
                                  <p>
                                    Total Paid by Customer
                                    <span>
                                      <i
                                        className="fa fa-inr"
                                        aria-hidden="true"
                                      />
                                      {offers?.totalPaidbyCustomer.toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="check_box">
                              <div className="check">
                                <div className="form-check form-check-inline">
                                  <Checkbox
                                    checked={formValues.termsCondition1.value}
                                    // value={formValues.termsCondition1.value}
                                    id="termsCondition1"
                                    className="form-check-input"
                                    name="termsCondition1"
                                    defaultValue="true"
                                    required
                                    onCheckedChange={(checked) => {
                                      onInputChange("termsCondition1", checked);
                                      if (checked) {
                                        setOpenDrawer(true);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor="termsCondition1"
                                    className="form-check-label"
                                  >
                                    Accept terms and conditions.
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="field">
                              <button
                                disabled={
                                  !offers || !formValues.termsCondition1.value
                                  // || !formValues.termsCondition2.value
                                }
                                onClick={(e) => handleNext(e)}
                                className={cn(
                                  "firstNext next disabled:opacity-70 disabled:pointer-events-none",
                                  !offers && "animate-pulse"
                                )}
                              >
                                Next
                              </button>

                              {/* First Drawer  */}
                              <Drawer
                                onOpenChange={(open) => {
                                  setOpenDrawer(open);
                                }}
                                open={openDrawer}
                                shouldScaleBackground
                              >
                                <DrawerContent>
                                  <div className="mx-auto h-[85vh] overflow-auto w-full">
                                    <DrawerHeader>
                                      <DrawerTitle>
                                        Terms And Conditions
                                      </DrawerTitle>
                                      {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                                    </DrawerHeader>
                                    <div className="modal-body p-0">
                                      <div
                                        className="col-sm-12"
                                        id="staticBackdropAadharWrap"
                                        style={{
                                          padding: "10px 50px",
                                          height: 590,
                                          minHeight: 200,
                                          overflowY: "scroll",
                                          textAlign: "justify",
                                        }}
                                      >
                                        {" "}
                                        <div>
                                          <div className="container">
                                            <div style={{ textAlign: "right" }}>
                                              <img
                                                src={MonarchLogo}
                                                alt="Monarch"
                                              />
                                            </div>
                                            <div>
                                              <h3
                                                style={{ textAlign: "center" }}
                                              >
                                                <strong>
                                                  <u>
                                                    Monarch Networth Finserve
                                                    Pvt Ltd
                                                  </u>
                                                </strong>
                                              </h3>
                                              <h3
                                                style={{ textAlign: "center" }}
                                              >
                                                <strong>
                                                  <u>
                                                    General Terms &amp;
                                                    Conditions
                                                  </u>
                                                </strong>
                                              </h3>
                                              <p>
                                                This Agreement sets forth the
                                                terms and conditions that apply
                                                to the access and use of the
                                                Monarch Networth Finserve Pvt
                                                Ltd’s Website, Mobile
                                                Application (collectively be
                                                referred to as "Website") which
                                                is managed and operated by
                                                Monarch Networth Finserve Pvt
                                                Ltd&nbsp;(hereinafter
                                                collectively be referred to as
                                                "Company"/ "Monarch Networth
                                                Finserve Pvt Ltd"), incorporated
                                                under the laws of India and
                                                registered under the Companies
                                                Act, 1956.
                                              </p>
                                              <p>
                                                This document/agreement
                                                (referred to as “Agreement”) is
                                                an electronic record in terms of
                                                Information Technology Act, 2000
                                                and generated by a computer
                                                system and does not require any
                                                physical or digital signatures.
                                                This document is published in
                                                accordance with the provisions
                                                of Rule 3 of the Information
                                                Technology (Intermediaries
                                                guidelines) 2011, that provides
                                                for the due diligence to be
                                                exercised for the access or
                                                usage of this Website.
                                              </p>
                                              <p>
                                                PLEASE READ THE FOLLOWING TERMS
                                                AND CONDITIONS CAREFULLY. YOUR
                                                ACCEPTANCE OF TERMS CONTAINED
                                                HEREIN CONSTITUTES THE AGREEMENT
                                                BETWEEN YOU AND THE COMPANY FOR
                                                THE PURPOSE AS DEFINED
                                                HEREUNDER.
                                              </p>
                                              <h4>
                                                <strong>
                                                  Customer Due Diligence
                                                </strong>
                                              </h4>
                                              <p>
                                                Company may undertake
                                                client/customer due diligence
                                                measures and seek mandatory
                                                information required for KYC
                                                purpose which as a customer you
                                                are obliged to give while
                                                facilitating your request of
                                                loan/credit card/mutual fund and
                                                other financial product
                                                requirements with the
                                                banks/financial institutions, in
                                                accordance with applicable
                                                Prevention of Money Laundering
                                                Act (“PMLA”) and rules.
                                              </p>
                                              <p>
                                                You agree and authorize the
                                                Company to share your data with
                                                Statutory bodies /rating
                                                agencies/ credit bureaus
                                                /banks/financial institutions,
                                                governmental/regulatory
                                                authorities.
                                              </p>
                                              <h4>
                                                <strong>
                                                  Fees, Charges and taxes
                                                </strong>
                                              </h4>
                                              <p>
                                                Company may charge up to 3%
                                                facilitation fee/processing
                                                fee/platform/convenience fee to
                                                provide services requested by
                                                you. Details of the same shall
                                                be available during the
                                                completion of the customer
                                                journey on the website.
                                              </p>
                                              <p>
                                                You shall bear all applicable
                                                taxes if the Fees are subject to
                                                any type of goods and sales tax,
                                                income tax, duty or other
                                                governmental tax or levy.
                                              </p>
                                              <h4>
                                                <strong>Eligibility</strong>
                                              </h4>
                                              <p>
                                                You confirm that you are a
                                                resident of India, above 18
                                                (Eighteen) years of age, and
                                                have the capacity to contract as
                                                specified under the Indian
                                                Contract Act, 1872, while
                                                availing the Services offered by
                                                the Company.
                                              </p>
                                              <h4>
                                                <strong>
                                                  KEY FACT STATEMENT
                                                </strong>
                                              </h4>
                                              <h4>
                                                <strong>
                                                  Annual Percentage Rate
                                                </strong>
                                              </h4>
                                              <p>
                                                The Services offered by the
                                                Company shall attract the Annual
                                                Percentage Rate (APR) which
                                                includes but not limited to
                                                Processing/Facilitation/Platform/Convenience
                                                Fee, Group Insurance Premium,
                                                applicable taxes subject to any
                                                types of Goods &amp; Sales Tax,
                                                Income Tax, Duty, or other
                                                Governmental Tax.
                                              </p>
                                              <p>
                                                You agree and consent the
                                                acceptance of the APR displayed
                                                to you while completing the
                                                journey on the Website for the
                                                Application of Services.
                                              </p>
                                              <h4>
                                                <strong>
                                                  Recovery Mechanism
                                                </strong>
                                              </h4>
                                              <p>
                                                Customer agrees and consents the
                                                acceptance of the following
                                                terms &amp; conditions of the
                                                recovery &amp; repayment.
                                              </p>
                                              <ol>
                                                <li>
                                                  Term/Frequency of the
                                                  repayment of Equal
                                                  installments which has been
                                                  displayed during the journey
                                                  on the Website for Application
                                                  of Services
                                                </li>
                                                <li>
                                                  Receive the notifications in
                                                  relation to the repayment
                                                  schedule via various modes of
                                                  communication.
                                                </li>
                                                <li>
                                                  Reporting of credit records of
                                                  the Customer to the Credit
                                                  Information Companies (CIC)
                                                </li>
                                                <li>
                                                  Share information with the
                                                  third-party websites,
                                                  applications, partners or
                                                  associates to facilitate the
                                                  various modes of payments.
                                                </li>
                                                <li>
                                                  Late Payment Fee of Rs. 10 per
                                                  day may be levied in case of
                                                  delay of repayment from the
                                                  due date according to defined
                                                  repayment schedule.
                                                </li>
                                                <li>
                                                  Cash Handling Fee of Rs.250
                                                  and Rs.25 per visit may be
                                                  levied in case if repayments
                                                  collected from Home or Shop
                                                  location and via the modes of
                                                  cash at Centres respectively.
                                                </li>
                                              </ol>
                                              <p>
                                                Company does not intend to
                                                involve or get into the
                                                association with the third-party
                                                websites, applications,
                                                partners, or associates for the
                                                purpose of the recovery, however
                                                Customer shall be notified in
                                                advance in case of future
                                                involvement.
                                              </p>
                                              <p>
                                                Dedicated Customer Support Desk
                                                for Queries, Request, and
                                                Complaints is operational for
                                                Customers through below
                                                mentioned modes.
                                              </p>
                                              <ol>
                                                <li>
                                                  Email at support@mnclgroup.com
                                                </li>
                                                <li>
                                                  “Write to us” at Monarch
                                                  Networth Finserve Pvt Ltd
                                                  Website - &nbsp;
                                                  <a
                                                    href="https://www.mnclgroup.com/"
                                                    target="_blank"
                                                  >
                                                    <u>www.mnclgroup.com</u>
                                                  </a>
                                                </li>
                                                <li>
                                                  Customer Support Helpline -
                                                  +91 9033839897
                                                </li>
                                              </ol>
                                              <p>
                                                Customer may reach out to
                                                Grievance Officer in case not
                                                satisfied with the resolution
                                                offered by the dedicated
                                                Customer Support Desk through
                                                below mentioned means.
                                              </p>
                                              <ol>
                                                <li>
                                                  Email at
                                                  anshit.acharya@mnclgroup.com
                                                </li>
                                                <li>
                                                  “Escalate you query” at
                                                  Monarch Networth Finserve Pvt
                                                  Ltd Website -{" "}
                                                  <a
                                                    href="https://www.mnclgroup.com/"
                                                    target="_blank"
                                                  >
                                                    <u>www.mnclgroup.com</u>
                                                  </a>
                                                </li>
                                                <li>
                                                  Grievance Support Helpline -
                                                  +91 9033839897
                                                </li>
                                              </ol>
                                              <p>
                                                Assistance from the Customer
                                                Support and the Grievance
                                                Officer shall be subject to
                                                Customer Grievance Redressal
                                                Policy of the Company, more
                                                details of the same is available
                                                on the Website{" "}
                                                <a
                                                  href="https://www.mnclgroup.com/"
                                                  target="_blank"
                                                >
                                                  <u>www.mnclgroup.com</u>
                                                </a>
                                              </p>
                                              <h4>
                                                <strong>Look Up Period</strong>
                                              </h4>
                                              <p>
                                                Customer had been facilitated
                                                with the Look Up period of Three
                                                (3) Days during which Customer
                                                can revoke the Services availed.
                                              </p>
                                              <p>
                                                Customer shall be required to
                                                repay the Principal &amp;
                                                Proportionate Interest (from the
                                                date of disbursement till the
                                                date of the repayment) according
                                                to the Annual Percentage Rate
                                                (APR).
                                              </p>
                                              <p>
                                                Customer may reach out dedicated
                                                Customer Support Desk of the
                                                Company for requesting to revoke
                                                the Services , response to which
                                                shall be provided according to
                                                the to Customer Grievance
                                                Redressal Policy of the Company,
                                                more details of the same shall
                                                be available on the Website{" "}
                                                <a
                                                  href="https://www.mnclgroup.com/"
                                                  target="_blank"
                                                >
                                                  <u>www.mnclgroup.com</u>
                                                </a>
                                              </p>
                                              <h4>
                                                <strong>
                                                  Group Insurance Policy
                                                </strong>
                                              </h4>
                                              <p>
                                                The company may further offer
                                                you group insurance coverage
                                                from Insurance partners for
                                                which Monarch Networth Finserve
                                                Pvt Ltd&nbsp;. shall be the
                                                Master Policy Holder ("MPH")
                                                provided you are a customer of
                                                the Company. Such insurance
                                                coverage shall be governed by
                                                terms &amp; conditions of
                                                Insurer and as per the
                                                guidelines issued by the
                                                Insurance Regulatory and
                                                Development Authority of India
                                                ("IRDAI").
                                              </p>
                                              <h4>
                                                <strong>Indemnity</strong>
                                              </h4>
                                              <p>
                                                You indemnify and hold Company
                                                (and its affiliates, officers,
                                                directors, agents and employees)
                                                harmless from any and against
                                                any claims, causes of action,
                                                demands, recoveries, losses,
                                                damages, fines, penalties or
                                                other costs or expenses of any
                                                kind or nature, including
                                                reasonable attorneys' fees, or
                                                arising out of or related to
                                                your breach of Terms &amp;
                                                Conditions, your violation of
                                                any law or the rights of a third
                                                party, or your use of the
                                                Website.
                                              </p>
                                              <h4>
                                                <strong>
                                                  License and Access
                                                </strong>
                                              </h4>
                                              <p>
                                                You acknowledge and agree that
                                                the Company owns all legal
                                                right, title and interest in and
                                                to the Services, including any
                                                intellectual property rights
                                                which subsist in the Services
                                                (whether those rights are
                                                registered or not). You further
                                                acknowledge that the Services
                                                may contain information which is
                                                designated confidential by
                                                Company and that you shall not
                                                disclose such information
                                                without Company`s prior written
                                                consent.
                                              </p>
                                              <p>
                                                By sharing or submitting any
                                                content including any data and
                                                information on the Website, you
                                                agree that you shall be solely
                                                responsible for all content you
                                                post on the Website and Company
                                                shall not be responsible for any
                                                content you make available on or
                                                through the Website. At
                                                Company`s sole discretion, such
                                                content may be included in the
                                                Service and ancillary services
                                                (in whole or in part or in a
                                                modified form). With respect to
                                                such content, you submit or make
                                                available on the Website, you
                                                grant Company a perpetual,
                                                irrevocable, non-terminable,
                                                worldwide, royalty-free and
                                                non-exclusive license to use,
                                                copy, distribute, publicly
                                                display, modify, create
                                                derivative works, and sublicense
                                                such materials or any part of
                                                such content. You agree that you
                                                are fully responsible for the
                                                content you submit. You are
                                                prohibited from posting or
                                                transmitting to or from this
                                                Website: (i) any unlawful,
                                                threatening, libelous,
                                                defamatory, obscene,
                                                pornographic, or other material
                                                or content that would violate
                                                rights of publicity and/or
                                                privacy or that would violate
                                                any law; (ii) any commercial
                                                material or content (including,
                                                but not limited to, solicitation
                                                of funds, advertising, or
                                                marketing of any good or
                                                services); and (iii) any
                                                material or content that
                                                infringes, misappropriates or
                                                violates any copyright,
                                                trademark, patent right or other
                                                proprietary right of any third
                                                party. Youshall be solely liable
                                                for any damages resulting from
                                                any violation of the foregoing
                                                restrictions, or any other harm
                                                resulting from your posting of
                                                content to this Website.
                                              </p>
                                              <h4>
                                                <strong>
                                                  Limitation of Liability
                                                </strong>
                                              </h4>
                                              <p>
                                                You expressly understand and
                                                agree that the Company
                                                (including its subsidiaries,
                                                affiliates, directors, officers,
                                                employees, representatives and
                                                providers) shall not be liable
                                                for any direct, indirect,
                                                incidental, special,
                                                consequential or exemplary
                                                damages, including but not
                                                limited to damages for loss of
                                                profits, opportunity, goodwill,
                                                use, data or other intangible
                                                losses, even if Company has been
                                                advised of the possibility of
                                                such damages, resulting from (i)
                                                any failure or delay (including
                                                without limitation the use of or
                                                inability to use any component
                                                of the Website), or (ii) any use
                                                of the Website or content, or
                                                (iii) the performance or
                                                non-performance by us or any
                                                provider, even if we have been
                                                advised of the possibility of
                                                damages to such parties or any
                                                other party, or (b) any damages
                                                to or viruses that may infect
                                                your computer equipment or other
                                                property as the result of your
                                                access to the Website or your
                                                downloading of any content from
                                                the Website.
                                              </p>
                                              <p>
                                                Notwithstanding the above, if
                                                the Company is found liable for
                                                any proven and actual loss or
                                                damage which arises out of or in
                                                any way connected with any of
                                                the occurrences described above,
                                                then you agree that the
                                                liability of Company shall be
                                                restricted to, in the aggregate,
                                                any Facilitation/
                                                Processing/Convenience/Platform
                                                fees paid by you to the Company
                                                in connection with such
                                                transaction(s)/ Services on this
                                                Website, if applicable.
                                              </p>
                                              <h4>
                                                <strong>Privacy Policy</strong>
                                              </h4>
                                              <p>
                                                By using the Website, you hereby
                                                consent to the use of your
                                                information as we have outlined
                                                in our Privacy Policy. This
                                                Privacy Policy explains how
                                                Company treats your personal
                                                information when you access the
                                                Website and use other ancillary
                                                Services. You can access the
                                                Privacy policy by visiting the
                                                company’s official website.
                                              </p>
                                              <h4>
                                                <strong>
                                                  Third-Party Links
                                                </strong>
                                              </h4>
                                              <p>
                                                The company’s Platform may refer
                                                to or may contain, links to
                                                third-party websites,
                                                applications, services and
                                                resources but it does not mean
                                                we are endorsing such channels.
                                                We provide these links only as a
                                                convenience to You to avail
                                                certain services, the Company
                                                makes no representation or
                                                warranty of any kind regarding
                                                the accuracy, reliability,
                                                effectiveness, or correctness of
                                                any aspect of any third-party
                                                services, and consequently, the
                                                Company is not responsible for
                                                the content, products or
                                                services that are available from
                                                third-party services. You are
                                                responsible for reading and
                                                understanding the terms and
                                                conditions and privacy policy
                                                that applies to the use of any
                                                third-party services, and You
                                                acknowledge sole responsibility
                                                and assume all risk arising from
                                                use of any third-party services.
                                              </p>
                                              <h4>
                                                <strong>Consent</strong>
                                              </h4>
                                              <p>
                                                The consent for the collection
                                                of Data and also for the
                                                subsequent use of the Data is
                                                deemed to be given by You when
                                                You decide to avail yourself of
                                                the Services.
                                              </p>
                                              <p>
                                                You are authorizing Company to
                                                share/disclose, any/all
                                                information, documents including
                                                KYC and any other document which
                                                has been provided on Company’s
                                                platform with third party for
                                                KYC verification, including its
                                                subsidiaries, affiliates or
                                                partners for related purposes
                                                that Company may deem fit to
                                                offer services.
                                              </p>
                                              <p>
                                                You consent that you yourself or
                                                with the assistance from the
                                                Company, at your own discretion
                                                had initiated the journey on the
                                                Website for availing the
                                                Services.
                                              </p>
                                              <p>
                                                You consent that information
                                                furnished while completing the
                                                journey on the Website for the
                                                Application of Services are true
                                                &amp; accurate and no material
                                                information has been withheld or
                                                suppressed. In case any
                                                information is found to be false
                                                or untrue or misleading or
                                                misrepresenting, the Customer
                                                might be held liable for it.
                                              </p>
                                              <p>
                                                Company may enter into the
                                                agreement with the third party
                                                for facilitation of the Services
                                                (hereinafter may be referred to
                                                as “Partner”), Customer hereby
                                                agrees to avail the Services
                                                without any objection to the
                                                involvement of the Partner(s).
                                                Customer agrees that information
                                                disclosed by the Customer
                                                including KYC may also be
                                                rendered and stored with the
                                                Partner(s) for facilitation of
                                                the Services.
                                              </p>
                                              <p>
                                                You understand that that Company
                                                and the Partner(s) are entitled
                                                to reject the application
                                                submitted for the Services at
                                                their sole discretion, further
                                                disbursement and transactions
                                                will be governed by the rules of
                                                the Company which may be in
                                                force from time to time.
                                              </p>
                                              <p>
                                                You agree that Loan shall be
                                                disbursed in the Bank Account
                                                registered by you while
                                                submitting the application for
                                                this loan on the Website.
                                              </p>
                                              <p>
                                                You agree to enroll &amp; sign
                                                for National Automated Clearing
                                                House (NACH) Mandate as
                                                prescribed and implemented by
                                                the National Payments Corporate
                                                of India (NPCI) during the
                                                journey for the Application of
                                                Services, authorizing the
                                                Company to deduct the Equated
                                                installment from the Bank
                                                Account registered by you during
                                                the journey for the Application
                                                of Services.
                                              </p>
                                              <p>
                                                You agree that Services shall be
                                                used for the stated purpose and
                                                will not be used for any
                                                speculative, antisocial, or
                                                illegal purpose.
                                              </p>
                                              <p>
                                                You consent that the Document,
                                                KYC &amp; Information submitted
                                                for the application of the
                                                Services shall not be returned,
                                                under any circumstances.
                                                <strong>
                                                  &nbsp;Communication Policy
                                                </strong>
                                              </p>
                                              <p>
                                                As part of use of the Services,
                                                you may receive notifications,
                                                reminder, offers, discounts and
                                                general information from Company
                                                and the Partner(s) via text
                                                messages, WhatsApp messages,
                                                Calls, or by emails, for the
                                                purpose of facilitating the
                                                Services offered by the Company
                                                or the Partner, or for the
                                                information or reminders for the
                                                repayments or for collecting
                                                feedback regarding services. The
                                                User acknowledges that the SMS
                                                service provided by Company is
                                                an additional facility provided
                                                for the User’s convenience and
                                                that it may be susceptible to
                                                error, omission and/ or
                                                inaccuracy. You agree and accept
                                                that this consent overwrites the
                                                restrictions applicable
                                                according to registration with
                                                DNC or NDNC Registry laid down
                                                by the telecom service providers
                                                or Telecom Regulatory Authority
                                                of India (TRAI).
                                              </p>
                                              <p>
                                                You agree and authorize Company
                                                to share your information with
                                                its group companies and other
                                                third parties, in so far as
                                                required for joint marketing
                                                purposes/offering various
                                                services/report generations
                                                and/or to similar services to
                                                provide you with various
                                                value-added services, in
                                                association with the Services
                                                selected by you or otherwise.
                                              </p>
                                              <h4>
                                                <strong>Bureau Consent</strong>
                                              </h4>
                                              <p>
                                                You agree and authorise company
                                                to pull your cibil bureau status
                                                and detailed report.
                                              </p>
                                              <h4>
                                                <strong>GOVERNING LAW</strong>
                                              </h4>
                                              <p>
                                                This Terms of Use shall be
                                                governed by and construed in
                                                accordance with the laws of
                                                India, without regard to its
                                                conflict of law provisions and
                                                the exclusive jurisdiction of
                                                competent courts in Mumbai,
                                                India.
                                              </p>
                                              <h4>
                                                <strong>FORCE MAJEURE</strong>
                                              </h4>
                                              <p>
                                                The company shall not be liable
                                                for failure to perform its
                                                obligations under these Terms of
                                                Use to the extent such failure
                                                is due to causes beyond its
                                                reasonable control. In the event
                                                of a force majeure, the Company
                                                if unable to perform shall
                                                notify the User in writing of
                                                the events creating the force
                                                majeure. For the purposes of
                                                these Terms of Use, force
                                                majeure events shall include,
                                                but not be limited to, acts of
                                                God, failures or disruptions,
                                                orders or restrictions, war or
                                                warlike conditions, hostilities,
                                                sanctions, mobilizations,
                                                blockades, embargoes,
                                                detentions, revolutions, riots,
                                                looting, strikes, stoppages of
                                                labor, lockouts or other labor
                                                troubles, earthquakes, fires or
                                                accidents and epidemics.
                                              </p>
                                              <h4>
                                                <strong>
                                                  Customer Grievance Redressal
                                                </strong>
                                              </h4>
                                              <p>
                                                You may contact us with any
                                                enquiry, complaints or concerns
                                                by reaching to our customer care
                                                at:
                                              </p>
                                              <ul>
                                                <li>
                                                  Customer care number: +91
                                                  9033839897
                                                </li>
                                                <li>
                                                  Customer Care Email-
                                                  cs@mnclgroup.com
                                                </li>
                                              </ul>
                                              <p>&nbsp;</p>
                                              <h4>
                                                <strong>ACCEPTANCE</strong>
                                              </h4>
                                              <ol>
                                                <li>
                                                  I declare that I from my own
                                                  judgment and wisdom had agreed
                                                  to the Terms and Conditions of
                                                  the Services detailed herein
                                                  this document, in no matter
                                                  the Company or the Partner has
                                                  influenced you for availing
                                                  the Services or agree to the
                                                  Terms and Conditions detailed
                                                  herein this document.
                                                </li>
                                                <li>
                                                  I declare that I have duly
                                                  read the document and fully
                                                  understand the Terms and
                                                  Conditions detailed herein.
                                                </li>
                                                <li>
                                                  I understand by completing the
                                                  journey for the Application
                                                  for the Loan/Credit/Financial
                                                  Services on the Website, I am
                                                  signing this document
                                                  electronically.
                                                </li>
                                              </ol>
                                            </div>
                                            <p>&nbsp;</p>
                                            <p>&nbsp;</p>
                                            <p>&nbsp;</p>
                                            <p>&nbsp;</p>
                                            <div>
                                              <strong>
                                                Registered office -{" "}
                                              </strong>
                                              Office no.901/902, 9th Floor,
                                              Atlanta Centre, Opp.Udyog Bhavan,
                                              Sonawala Lane, Goregaon (East),
                                              Mumbai City, &nbsp;Maharashtra,
                                              India, 400063
                                              <br /> <strong>Website</strong>
                                              &nbsp;–{" "}
                                              <a
                                                href="https://www.mnclgroup.com/"
                                                target="_blank"
                                              >
                                                <u>www.mnclgroup.com</u>
                                              </a>
                                              <br /> <strong>Telephone-</strong>{" "}
                                              +91 -22-6202 1600
                                              <br /> <strong>Email </strong>
                                              <a href="mailto:Id-cs@mnclgroup.com">
                                                <strong>
                                                  <u>Id-cs@mnclgroup.com</u>
                                                </strong>
                                              </a>
                                              <br /> <strong>CIN-</strong>{" "}
                                              U65900MH1996PTC100919
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-end rounded-br-[calc(0.3rem_-_1px)] rounded-bl-[calc(0.3rem_-_1px)] p-3 border-t-[#dee2e6] border-t border-solid mx-auto">
                                      <div className="container space-x-2 flex ">
                                        <Button
                                          onClick={() => {
                                            onInputChange(
                                              "termsCondition1",
                                              true
                                            );
                                            setOpenDrawer(false);
                                          }}
                                          type="button"
                                        >
                                          Agree
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            onInputChange(
                                              "termsCondition1",
                                              false
                                            );
                                            setOpenDrawer(false);
                                          }}
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
                            </div>
                          </div>
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
                                              <dt className="sr-only">
                                                Bank name
                                              </dt>
                                              <dd className="px-1.5 ring-1 ring-slate-200 rounded">
                                                {i.Bank}
                                              </dd>
                                            </div>
                                            <div className="ml-2">
                                              <dt className="sr-only">
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
                                              <dt className="sr-only">
                                                Ifsc code
                                              </dt>
                                              <dd className="text-slate-400">
                                                {i.IFSCCode}
                                              </dd>
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
                            <div className="main_step_10bottom">
                              <div className="loanDetails">
                                {offers && (
                                  <>
                                    <p>
                                      Tenor <span>{offers?.tenor} days</span>
                                    </p>
                                    <p>
                                      Offer Expiry Date{" "}
                                      <span>
                                        {format(
                                          new Date(offers?.ExpiryDate!),
                                          "dd/MM/yyyy"
                                        )}
                                      </span>
                                    </p>
                                  </>
                                )}

                                <p>
                                  Daily Installment Amount
                                  <span>
                                    <i
                                      className="fa fa-inr"
                                      aria-hidden="true"
                                    />
                                    {Math.round(offers?.emi!)}
                                  </span>
                                </p>
                                <p>
                                  Number of Installments{" "}
                                  <span> {offers?.noOfPayment}</span>
                                </p>
                              </div>
                              <div className="loanDetails">
                                <p>
                                  Interest Rate
                                  <span>{offers?.interest}%</span>
                                </p>
                                <p>
                                  Processing Fees{" "}
                                  {/* <span>
                                    ({offers?.interest}% + {offers?.gst}%)
                                  </span> */}
                                  <span>
                                    <i
                                      className="fa fa-inr"
                                      aria-hidden="true"
                                    />
                                    {offers?.processingFee.toFixed(2)}
                                  </span>
                                </p>
                                <p>
                                  Net Disbursed Amount
                                  <span>
                                    <i
                                      className="fa fa-inr"
                                      aria-hidden="true"
                                    />
                                    {offers?.netDisbursement.toFixed(2)}
                                  </span>
                                </p>
                                {/* <p>
                                  GST
                                  <span> {offers?.gst}%</span>
                                </p> */}
                                <p>
                                  Total Paid by Customer
                                  <span>
                                    <i
                                      className="fa fa-inr"
                                      aria-hidden="true"
                                    />
                                    {offers?.totalPaidbyCustomer.toFixed(2)}
                                  </span>
                                </p>
                              </div>
                            </div>
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
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                        {step === 10 && (
                          <div className="page">
                            <div
                              dangerouslySetInnerHTML={{ __html: esignTerms! }}
                              className="main_step_9 col-md-12 pt-2 bg-cover max-h-[32rem]   overflow-auto relative"
                            ></div>

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
                                    dangerouslySetInnerHTML={{
                                      __html: esignTerms2!,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-end rounded-br-[calc(0.3rem_-_1px)] rounded-bl-[calc(0.3rem_-_1px)] p-3 border-t-[#dee2e6] border-t border-solid mx-auto">
                                <div className="container flex justify-center md:justify-end">
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
                              <hr className="my-6 border-gray-300" />
                              {bankList?.[0] && (
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <Icons.BanknoteIcon className="text-[#5322ba] h-6 w-6" />
                                    <div>
                                      <h4 className="font-bold">
                                        {bankList?.[selectedBankID].Bank}
                                      </h4>
                                      <p className="text-sm">
                                        {bankList?.[selectedBankID].AccountType}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Account Number -{" "}
                                      {bankList?.[selectedBankID].AccountNumber}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium">
                                      IFSC Code -{" "}
                                      {bankList?.[selectedBankID].IFSCCode}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 text-center">
                              {/* <p className="text-xs text-gray-500">
                                Lending partner
                              </p> */}
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
                            </div>
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
