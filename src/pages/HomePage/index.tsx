import { FC, useEffect, useRef, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

import coin from "../../assets/images/coin.png";
import Second_screen from "../../assets/images/Second_screen.jpg";
import Screen_5 from "../../assets/images/Screen_5.jpg";
import Screen_6 from "../../assets/images/Screen_6.jpg";

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

const index: FC = () => {
  const [step, setStep] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [countDownTimer, setCountDownTimer] = useState(120);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [bankList, setBankList] = useState<[BankList]>();
  const [isLoading, setIsLoading] = useState(false);
  const [selfieImage, setSelfieImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [panCardImage, setPanCardImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [addressProof, setAddressProof] = useState<FileWithPreview[] | null>(
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
      value: "Father",
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
    bank_account: {
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
      let termsCondition2HasError = !_formValues.termsCondition2.value;
      if (termsCondition1HasError) {
        _formValues.termsCondition1.error = true;
        setFormValues(_formValues);
      } else if (termsCondition2HasError) {
        _formValues.termsCondition2.error = true;
        setFormValues(_formValues);
      } else if (!termsCondition1HasError && !termsCondition2HasError) {
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
          key === "nominee" ||
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
        // setStep((prevStep) => prevStep + 1);
        updateBusinessMerchantDetails();
        console.log(formValues);
      } else {
        setFormValues(_formValues);
      }
    } else if (step === 5) {
      if (selfieImage) {
        // setStep((prevStep) => prevStep + 1);

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
        validateAadharOTP();
      } else {
        setFormValues(_formValues);
      }

      // if (addressProof) {
      //   await getBase64(addressProof[0])
      //     .then(
      //       async (res) =>
      //         await uploadDocument("3", res as string, addressProof[0].name)
      //     )
      //     .catch((err) => console.log(err));
      // } else {
      //   alert("Please upload address proof image");
      // }
    } else if (step === 8) {
      let formObjectHasError = false;
      Object.keys(_formValues).forEach((key) => {
        if (
          key === "account_holder_name" ||
          key === "account_number" ||
          key === "ifsc_code"
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
        setStep((prevStep) => prevStep + 1);
      } else {
        setFormValues(_formValues);
      }
    } else if (step === 10) {
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
  const bankDropDown = [
    "HDFC Bank",
    "State Bank of India Bank",
    "Bank of India",
  ];
  const relationDropDown = ["Father", "Mother", "Daughter"];

  useEffect(() => {
    getIPAddress();
    getOffers();
    getSteps();

    // getPersonalDetails();
  }, []);

  const getIPAddress = async () => {
    const response = await fetch("https://geolocation-db.com/json/");
    const data: GeoLocationAPIResponeObject = await response.json();
    let _formValues = { ...formValues };
    _formValues.ip_address.value = data.IPv4;
    setFormValues(_formValues);
  };

  const getOffers = async () => {
    const body = {
      RefID: "1334338946318021960dbc7fc4-aa0d-4b49-8f46-ee03dc2260ac", // get this from url
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));

    await api.app
      .post({
        url: "/GetOffers",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<APIResponseType>) => {
        const { data } = res;
        if (data.status === "Success") {
          let offerDetails: OfferDetails = JSON.parse(data.message);
          offerDetails.LoanAmount = Math.round(Number(offerDetails.LoanAmount));
          offerDetails.Tenor = Math.round(Number(offerDetails.Tenor));
          setOffers(offerDetails);
          let _formValues = { ...formValues };
          _formValues.mobile_no.value = offerDetails.MobileNumber;
          _formValues.merchant_id.value = offerDetails.MerchantID;
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
      });
  };

  const sendOTP = async (resend?: boolean) => {
    const body = { MobileNumber: formValues.mobile_no.value };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app

      .post({
        url: "/SendOTP",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<APIResponseType>) => {
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
      .post({
        url: "/OTPVerify",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<APIResponseType>) => {
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
      .post({
        url: "/BusinessMerchantDetails",
        requestBody: encryptedBody,
      })
      .then(
        async (
          res: AxiosResponse<GetBusinessMerchantDetailsAPIResponseType>
        ) => {
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
            _formValues.full_name.value =
              BusinessDetailsResEntity.FirstName.trim() +
              " " +
              BusinessDetailsResEntity.MiddleName.trim() +
              " " +
              BusinessDetailsResEntity.LastName.trim();
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
        }
      )
      .catch((error: AxiosError) => {
        setIsLoading(false);
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const getBusinessBankDetails = async () => {
    const body = {
      // hcoded
      MerchantID: "7e77a7d4" || formValues.merchant_id.value,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app

      .post({
        url: "/BusinessBankDetails",
        requestBody: encryptedBody,
      })
      .then(async (res: AxiosResponse<any>) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          const _banklist: [BankList] = JSON.parse(data.data);
          setBankList(_banklist);
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

  const updateBusinessMerchantDetails = async () => {
    const body = {
      MerchantID: formValues.merchant_id.value,
      customer_name: formValues.full_name.value,
      mobile_no: formValues.mobile_no.value,
      pan: formValues.pan_number.value,
      loan_amount: offers?.LoanAmount,
      dob: formValues.dob.value,
      gender: formValues.gender.value,
      house: formValues.house.value,
      emergency: formValues.emergency_contact_number.value,
      email: formValues.email.value,
      nomineeName: formValues.nominee.value,
      nomineeRelation: formValues.nominee_relation.value,
      bPinCode: formValues.business_address_pincode.value,
      bAddress1: formValues.business_address.value,
      bAddress2: "",
      cPinCode: formValues.current_pincode.value,
      cAddress1: formValues.current_address.value,
      cAddress2: "",
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    debugger;
    setIsLoading(true);
    await api.app
      .post({
        url: "/update_businessMerchantDetails",
        requestBody: encryptedBody,
      })
      .then(async (res: AxiosResponse<APIResponseType>) => {
        const { data } = res;
        setIsLoading(false);
        if (data.status === "Success") {
          setStep((prevStep) => prevStep + 1);
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

  // const getBusinessAddressDetails = async () => {
  //   const body = {
  //     MerchantID: formValues.merchant_id.value,
  //   };
  //   const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
  //   setIsLoading(true);
  //   await api.app
  //     .post({
  //       url: "/BusinessAddressDetails",
  //       requestBody: encryptedBody,
  //     })
  //     .then(
  //       async (
  //         res: AxiosResponse<GetBusinessMerchantDetailsAPIResponseType>
  //       ) => {
  //         const { data } = res;
  //         setIsLoading(false);
  //         if (data.status === "Success") {
  //           const details: ParsedMerchantAddressDetails = JSON.parse(data.data);
  //           let _formValues = { ...formValues };
  //           _formValues.business_address_pincode.value = details.PinCode;
  //           _formValues.business_address.value =
  //             details.Address1 + details.Address2;

  //           setFormValues(_formValues);
  //         } else {
  //           toast.error(data.message);
  //         }
  //       }
  //     )
  //     .catch((error: AxiosError) => {
  //       setIsLoading(false);
  //       showAlert({
  //         title: error.message,
  //         description: "Please try after some time",
  //       });
  //     });
  // };

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
      // hcoded
      MerchantID: "7e77a7d4" || formValues.merchant_id.value,
      Application_ID: "123",
      DocumentFileImage: image,
      DocumentFilename: imagename,
      DocID: id,
    };

    debugger;
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post({
        url: "/savekycdocuments",
        requestBody: encryptedBody,
      })
      .then(
        async (
          res: AxiosResponse<GetBusinessMerchantDetailsAPIResponseType>
        ) => {
          const { data } = res;
          setIsLoading(false);
          if (data.status === "Success") {
            toast.success(
              `${
                id === "1" ? "Pancard" : id === "2" ? "Selfie" : "Adress proof"
              } uploaded successfully`
            );
            if (id === "3") {
              getBusinessBankDetails();
            }
            setStep((prevStep) => prevStep + 1);
          } else {
            toast.error(data.message);
          }
        }
      )
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
      // hcoded
      MerchantID: "7e77a7d4" || formValues.merchant_id.value,
      ApplicantID: "",
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post({
        url: "/aadhargetotp",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<AadharGetotpAPIRespnseType>) => {
        const { data } = res;
        if (data.status === "Success") {
          toast.success("OTP sent");
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
      // hcoded
      MerchantID: "7e77a7d4" || formValues.merchant_id.value,
      ApplicantID: "",
      MobileNo: "",
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post({
        url: "/aadharotpvalidate",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<AadharGetotpAPIRespnseType>) => {
        const { data } = res;
        if (data.status === "Success") {
          toast.success("Aadhar verified successfully");
          getBusinessBankDetails();

          setStep((prevStep) => prevStep + 1);
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

  const getSteps = async () => {
    const body = {
      // hcoded
      MerchantID: "7e77a7d4" || formValues.merchant_id.value,
      ApplicationID: "M0000000001",
      LoanAmount: "9000" || offers?.LoanAmount,
    };
    debugger;
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post({
        url: "/getapplicantmerchantdetails",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<AadharGetotpAPIRespnseType>) => {
        const { data } = res;
        if (data.status === "Success") {
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

  const getLoanEDI = async () => {
    const body = {
      // hcoded
      LoanAmount: formValues.edit_loan_amount.value,
      ProductId: "",
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .get({
        url: "/getloanedi",
        requestBody: encryptedBody,
      })
      .then((res: AxiosResponse<AadharGetotpAPIRespnseType>) => {
        const { data } = res;
        if (data.status === "Success") {
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

  const onEditAmount = async () => {
    let _formValues = { ...formValues };

    let formObjectHasError = false;
    Object.keys(_formValues).forEach((key) => {
      if (key === "edit_loan_amount") {
        let hasError =
          !validations.isRequired(_formValues[key].value) ||
          Number(_formValues[key].value) > Number(offers?.LoanAmount);
        _formValues[key].error =
          !validations.isRequired(_formValues[key].value) ||
          Number(_formValues[key].value) > Number(offers?.LoanAmount);
        if (hasError) {
          formObjectHasError = true;
        }
      }
    });
    if (!formObjectHasError) {
      setOpen(false);
      getLoanEDI();
    } else {
      setFormValues(_formValues);
    }
  };
  return (
    <>
      {AlertModal({
        title: "",
        description: "",
      })}
      <div className="container">
        {/* steps */}
        <div className="row">
          <div className="col-md-12">
            <div className="progress-bar bg-white">
              <div className="step">
                <p>Home</p>
                <div className="bullet">
                  <i className="fa fa-home" aria-hidden="true" />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>Number</p>
                <div className="bullet">
                  <i
                    className={`fas fa-mobile-alt ${
                      step > 1 ? "" : "inactive"
                    } `}
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>OTP</p>
                <div className="bullet">
                  <i
                    className={`fas fa-key ${step > 2 ? "" : "inactive"} `}
                    aria-hidden="true"
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>Personal Details</p>
                <div className="bullet">
                  <i
                    className={`fas fa-user ${step > 3 ? "" : "inactive"} `}
                    aria-hidden="true"
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>Selfie</p>
                <div className="bullet">
                  <i
                    className={`fas fa-camera ${step > 4 ? "" : "inactive"} `}
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>PAN</p>
                <div className="bullet">
                  <i
                    className={`fas fa-id-card ${step > 5 ? "" : "inactive"} `}
                    aria-hidden="true"
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>Add. Proof</p>
                <div className="bullet">
                  <i
                    className={`fas fa-address-card ${
                      step > 6 ? "" : "inactive"
                    } `}
                    aria-hidden="true"
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>A/c Details</p>
                <div className="bullet">
                  <i
                    className={`fas fa-user ${step > 7 ? "" : "inactive"} `}
                    aria-hidden="true"
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>

              <div className="step">
                <p>E-Sign</p>
                <div className="bullet">
                  <i
                    className={`fas fa-file-signature ${
                      step > 8 ? "" : "inactive"
                    } `}
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
              <div className="step">
                <p>Confirm</p>
                <div className="bullet">
                  <i
                    className={`fas fa-check-double ${
                      step > 9 ? "" : "inactive"
                    } `}
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* main page */}
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="form-outer">
              <form action="#">
                {step === 1 && (
                  <div className="page slide-page">
                    <div className="form-card">
                      {offers ? (
                        <div className="step_1">
                          <div className="coin_img">
                            <img src={coin} alt="coin-image" />
                          </div>
                          <div className="contenttext">
                            {/* <label>Your loan amount</label> */}
                            <p>
                              Your loan amount <br />
                              <i className="fa fa-inr" aria-hidden="true" />
                              {" " + offers.LoanAmount + " "}{" "}
                              <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size={"rounded"}
                                    variant={"ghost"}
                                    type="button"
                                  >
                                    <i
                                      style={{ fontSize: "22px" }}
                                      className="fa fa-pen"
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Edit loan amount</DialogTitle>
                                    <DialogDescription>
                                      Edited amount should not be greater than
                                      <b className="text-black/70">
                                        {" " + offers.LoanAmount}
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
                                        <label htmlFor="amount">Amount</label>
                                        <input
                                          className="form-control"
                                          type="text"
                                          name="amount"
                                          placeholder="Enter amount"
                                          id="amount"
                                          value={
                                            formValues.edit_loan_amount.value
                                          }
                                          required
                                          maxLength={12}
                                          onKeyDown={(e) => onlyNumberValues(e)}
                                          onChange={(e) =>
                                            onInputChange(
                                              "edit_loan_amount",
                                              e.target.value
                                            )
                                          }
                                        />
                                        {formValues.edit_loan_amount.error ? (
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Amount should not be less than
                                            offered amount
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>

                                    <Button
                                      disabled={
                                        formValues.edit_loan_amount.error ||
                                        formValues.edit_loan_amount.value === ""
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
                            <strong>Tenor: {offers.Tenor} days</strong>
                            <span>
                              Expriy Date:
                              {" " +
                                format(
                                  new Date(offers.ExpiryDate),
                                  "dd/MM/yyyy"
                                )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <Skeleton className="bg-cover min-h-[470px] relative shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] m-[15px] rounded-[15px]" />
                      )}

                      <div className="check_box">
                        <div className="check">
                          <div className="form-check form-check-inline">
                            <Checkbox
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
                          <div className="form-check form-check-inline mb-3">
                            <Checkbox
                              id="termsCondition2"
                              className="form-check-input"
                              name="termsCondition2"
                              defaultValue="true"
                              required
                              onCheckedChange={(checked) => {
                                onInputChange("termsCondition2", checked);
                                if (checked) {
                                  setOpenDrawer(true);
                                }
                              }}
                            />
                            <label
                              htmlFor="termsCondition2"
                              className="form-check-label"
                            >
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Nobis ev
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      <button
                        disabled={
                          !offers ||
                          !formValues.termsCondition1.value ||
                          !formValues.termsCondition2.value
                        }
                        onClick={(e) => handleNext(e)}
                        className={cn(
                          "firstNext next disabled:opacity-70 disabled:pointer-events-none",
                          !offers && "animate-pulse"
                        )}
                      >
                        Apply Now
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
                          <div className="mx-auto h-[90vh] overflow-auto w-full">
                            <DrawerHeader>
                              <DrawerTitle>Terms And Conditions</DrawerTitle>
                              {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                            </DrawerHeader>
                            <div className="p-4 pb-0 max-w-4xl mx-auto">
                              Please read the following Terms and Conditions of
                              service that you agree to, when you access
                              www.paypointz.com ("website"), a service offered
                              by Pay Point India Network Private Limited or
                              through the assistance of an agent of Pay Point
                              India Network Private Limited. The Terms and
                              Conditions (as may be amended from time to time,
                              the "Agreement") is a legal contract between you
                              being, an individual customer, user, or
                              beneficiary of this service of at least 18 years
                              of age, and Pay Point India Network Private
                              Limited (Pay Point India) having its registered
                              office at 'A' Wing 203, Supreme Business Park,
                              Hiranandani Garden, Powai, Mumbai 400076,
                              Maharashtra - India feedback@paypointindia.com |
                              +91 22 4050 8888 / 4068 8088. All services are
                              rendered by Pay Point India through its platform
                              under the brand name 'PaypointZ' & 'Tatkal Rupya'.
                              Hence all the rights, benefits, liabilities &
                              obligations under the following terms & conditions
                              shall accrue to the benefit of Pay Point India.
                              (together with its subsidiaries and other
                              affiliates, "us", "We", "Tatkal Rupya", or
                              "PaypointZ"), regarding your use of our Services
                              regarding Semi Closed Wallet of online PaypointZ
                              or such other services which may be added from
                              time to time (all such services are individually
                              or collectively are referred as Service or
                              Services as they case may be). Service can be used
                              by you subject to your adherence with the terms
                              and conditions set forth below including relevant
                              policies. PaypointZ reserves the right, at its
                              sole discretion, to revise, portions of these
                              terms and conditions any time without further
                              notice. You shall re-visit the "Terms &
                              Conditions" link from time to time to stay abreast
                              of any changes that the "Site" may introduce.
                              Quality of Services Pay Point India agrees to
                              provide you products at the press of a button. Pay
                              Point India is committed to investigate the cause
                              of non-performance with all parties involved.
                              However, no refunds will be made to your PaypointZ
                              balance unless it is clearly established that Pay
                              Point India was responsible. Link to other
                              websites Pay Point India may provide links to
                              other websites that are maintained by third
                              parties. Pay Point India is not responsible and/or
                              liable for any information available on these
                              third party websites. Links to third party sites
                              are provided by web site as a convenience to
                              user(s) and Pay Point India has not have any
                              control over such sites i.e. content and resources
                              provided by them. Pay Point India may allow
                              user(s) access to content, products or services
                              offered by third parties through hyper links (in
                              the form of word link, banners, channels or
                              otherwise) to such Third Party’s web site. You are
                              cautioned to read such sites’ terms and conditions
                              and/or privacy policies before using such sites in
                              order to be aware of the terms and conditions of
                              your use of such sites. Pay Point India believes
                              that user(s) acknowledge that it has no control
                              over such third party’s site, does not monitor
                              such sites, and Pay Point India shall not be
                              responsible or liable to anyone for such third
                              party site, or any content, products or services
                              made available on such a site. Limited Warranty
                              Pay Point India concedes to provide efficient,
                              reliable, timely and satisfactory service to the
                              best of its resources and skills. Pay Point India
                              makes no warranty that the website will be
                              uninterrupted, error free, and virus free or free
                              from any malicious content. The Website is
                              provided on an "as is where is" and "as available"
                              basis. In any case of unsatisfactory service by
                              Pay Point India, it agrees to take proper
                              corrective action on the basis of decision taken
                              by Pay Point India. Limitation of Liability and
                              Damages In no event will Pay Point India or its
                              contractors, agents, licensors, partners,
                              officers, directors, suppliers be liable to you
                              for any special, indirect, incidental,
                              consequential, punitive, reliance, or exemplary
                              damages (including without limitation lost
                              business opportunities, lost revenues, or loss of
                              anticipated profits or any other pecuniary or
                              non-pecuniary loss or damage of any nature
                              whatsoever) arising out of or relating to (i) this
                              agreement, (ii) the services, the site or any
                              reference site, or (iii) your use or inability to
                              use the services, the site (including any and all
                              materials) or any reference sites, even if Pay
                              Point India or a it’s authorized representative
                              has been advised of the possibility of such
                              damages. In no event will Pay Point India or any
                              of its contractors, directors, employees, agents,
                              third party partners, licensors or suppliers’
                              total liability to you for all damages,
                              liabilities, losses, and causes of action arising
                              out of or relating to (i) this Agreement, (ii) the
                              Services, (iii) your use or inability to use the
                              Services or the Site (including any and all
                              Materials) or any Reference Sites, or. You
                              acknowledge and agree that Pay Point India has
                              offered its products and services, set its prices,
                              and entered into this agreement in reliance upon
                              the warranty disclaimers and the limitations of
                              liability set forth herein, that the warranty
                              disclaimers and the limitations of liability set
                              forth herein reflect a reasonable and fair
                              allocation of risk between you and Pay Point
                              India, and that the warranty disclaimers and the
                              limitations of liability set forth herein form an
                              essential basis of the bargain between you and Pay
                              Point India. It would not be able to provide the
                              services to you on an economically reasonable
                              basis without these limitations. Applicable law
                              may not allow the limitation or exclusion of
                              liability or incidental or consequential damages,
                              so the above limitations or exclusions may not
                              apply to you. In such cases, Pay Point India’s
                              liability will be limited to the fullest extent
                              permitted by applicable law. This paragraph shall
                              survive termination of this Agreement.
                              Indemnification You agree to indemnify, save, and
                              hold Pay Point India, its affiliates, contractors,
                              employees, officers, directors, agents and its
                              third party suppliers, licensors, and partners
                              harmless from any and all claims, losses, damages,
                              and liabilities, costs and expenses, including
                              without limitation legal fees and expenses,
                              arising out of or related to your use or misuse of
                              the Services or of the Site, any violation by you
                              of this Agreement, or any breach of the
                              representations, warranties, and covenants made by
                              you herein. Pay Point India reserves the right, at
                              your expense, to assume the exclusive defense and
                              control of any matter for which you are required
                              to indemnify Pay Point India, including rights to
                              settle, and you agree to cooperate with Pay Point
                              India’s defense and settlement of these claims.
                              Pay Point India will use reasonable efforts to
                              notify you of any claim, action, or proceeding
                              brought by a third party that is subject to the
                              foregoing indemnification upon becoming aware of
                              it. This paragraph shall survive termination of
                              this Agreement. Ownership; Proprietary Rights The
                              Services and the Site are owned and operated by
                              Pay Point India and/or third party licensors. The
                              visual interfaces, graphics, design, compilation,
                              information, computer code (including source code
                              and object code), products, software, services,
                              and all other elements of the Services and the
                              Site provided by Pay Point India (the “Materials”)
                              are protected by Indian copyright, trade dress,
                              patent, and trademark laws, international
                              conventions, and all other relevant intellectual
                              property and proprietary rights, and applicable
                              laws. As between you and Pay Point India, all
                              Materials, trademarks, service marks, and trade
                              names contained on the Site are the property of
                              Pay Point India and/or third party licensors or
                              suppliers. You agree not to remove, obscure, or
                              alter Pay Point India or any third party’s
                              copyright, patent, trademark, or other proprietary
                              rights notices affixed to or contained within or
                              accessed in conjunction with or through the
                              Services. Except as expressly authorized by Pay
                              Point India, you agree not to sell, license,
                              distribute, copy, modify, publicly perform or
                              display, transmit, publish, edit, adapt, create
                              derivative works from, or otherwise make
                              unauthorized use of the Materials. Pay Point India
                              reserves all rights not expressly granted in this
                              Agreement. If you have comments regarding the
                              Services and the Site or ideas on how to improve
                              it, please contact customer service. Please note
                              that by doing so, you hereby irrevocably assign to
                              Pay Point India, and shall assign to it, all
                              right, title and interest in and to all ideas and
                              suggestions and any and all worldwide intellectual
                              property rights associated therewith. You agree to
                              perform such acts and execute such documents as
                              may be reasonably necessary to perfect the
                              foregoing rights. Severability The Services and
                              the Site are owned and operated by Pay Point India
                              and/or third party If any provision of this
                              Agreement is held to be unlawful, void, invalid or
                              otherwise unenforceable, then that provision will
                              be limited or eliminated from this Agreement to
                              the minimum extent required, and the remaining
                              provisions will remain valid and enforceable.
                              Terms and conditions of usage of Prepaid Cards:
                              This prepaid payment instrument (Prepaid Card) is
                              governed by the Payment and Settlement Systems
                              Act, 2007 & Regulations made thereunder, Issuance
                              and Operation of Pre-paid Payment Instruments in
                              India (Reserve Bank) Directions, 2009 (“RBI
                              Guidelines”) and is also subject to directions /
                              instructions issued by the Reserve Bank of India
                              (RBI) from time to time in respect of redemption,
                              repayment, usage etc. and Pay Point India Network
                              Private Ltd. (Pay Point India) does not hold any
                              responsibility to the cardholder in such
                              circumstances. This Prepaid Card should be
                              utilized by individuals above 18 years of age. You
                              agree to provide information that is true,
                              accurate and complete. You also agree to provide
                              correct and accurate credit/ debit card details to
                              the approved payment gateway for availing Services
                              on the Website and associated Applications. You
                              shall not use a credit/ debit card unlawfully. You
                              will be solely responsible for the security and
                              confidentiality of your credit/ debit card
                              details. Pay Point India expressly disclaims all
                              liabilities that may arise as a consequence of any
                              unauthorized use of credit/ debit card. Any
                              suspicious activity may lead to blockage of the
                              account. The maximum value of a Prepaid Card is
                              Rs. 10,000 and Rs. 1,00,000 in case all additional
                              services are enabled on it after submitting
                              requisite KYC documents. Pay Point India may use
                              the KYC submitted by you for business purposes.
                              You hereby consent to (i) receiving e-newsletters
                              as well as other communications containing offers
                              etc. and (ii) Pay Point India providing your
                              information to sponsor/s and/or companies
                              associated with it for the purpose of providing
                              you with offers and/or information. You hereby
                              agree to use this Prepaid Card for all
                              transactions with prescribed merchants for the
                              products/services as mentioned by the merchant on
                              its website and further agree not to use it for
                              any unlawful purpose/activities. You will neither
                              abate nor be a party to any illegal/criminal/money
                              laundering/terrorist activities undertaken by
                              using this Prepaid Card. Pay Point India shall not
                              be responsible for any fraud or misuse of this
                              Prepaid Card and you agree to be personally liable
                              for any and all costs, taxes, charges, claims or
                              liabilities of any nature, arising due to any such
                              fraud or misuse of the Prepaid Card. You hereby
                              declare that your name does not at anytime appear
                              in the consolidated list of Terrorist Individuals
                              / Organisations (Al Qaida or the Taliban) as
                              circulated by RBI from time to time. Pay Point
                              India shall not be liable / responsible for any
                              defect in the product / merchandise / goods or
                              services purchased / availed using this Prepaid
                              Card. Any dispute or claim regarding the product /
                              merchandise / goods or services purchased /
                              availed on the website of the merchant using this
                              Prepaid Card must be resolved with the designated
                              merchants. Pay Point India does not own any
                              responsibility to the cardholder in such
                              circumstances. Pay Point India may charge payment
                              gateway service fees to you for use of this
                              Prepaid Card on the designated merchants. The said
                              fees will not exceed 2.5% of the total transaction
                              value. Additionally, if used or loaded at a retail
                              agent of Pay Point India Network Pvt. Limited, a
                              convenience fee of INR 10 per transaction will be
                              charged. This Prepaid Card is valid for 18 months
                              from the date of its first usage or 18 months from
                              date of issue, whichever is earlier. Any
                              unutilized balance remaining in this Prepaid Card
                              after the date of expiry will stand forfeited as
                              per the RBI Guidelines. In case the Prepaid Card
                              is lost or misplaced, you shall promptly inform
                              Pay Point India in writing (letter/e-mail). The
                              Prepaid Card shall then be blocked and Pay Point
                              India may issue new card as per prescribed
                              procedure in this regard with the balance amount
                              for a nominal charge as may be prescribed by Pay
                              Point India from time to time. Any duplication of
                              this Prepaid Card will be subject to cancellation.
                              This Prepaid Card cannot be used for transactions
                              in foreign currency. This Prepaid Card can be used
                              only for online/on mobile/IVRS transactions with
                              the merchants governed by Indian laws. This
                              Prepaid Card is not transferable. Pay Point India
                              reserves the right at any time to refuse for any
                              reason whatsoever, the use of the Prepaid Card on
                              the website/mobile application/IVRS of designated
                              merchants. You shall promptly inform Pay Point
                              India of any change of your name, mailing address,
                              e-mail address or any other required data provided
                              for the issuance of this Prepaid Card and submit
                              the fresh KYC documents in respect of such change,
                              as may be demanded by Pay Point India. For
                              resolving any dispute, Pay Point India has
                              formalized “Customer Grievance Redressal Policy”
                              which is available on the website of All disputes
                              arising out of any transaction pertaining to the
                              use of this Prepaid Card shall be subject to this
                              policy. Any further litigation shall be governed
                              by exclusive jurisdiction of the courts in Mumbai.
                              All transactions done by using this Prepaid Card
                              are subject to applicable Indian laws. Pay Point
                              India reserves the right to amend, alter, delete,
                              insert and revise these terms and conditions
                              without any prior notice/intimation to customer.
                              We have the right, but not the obligation, to take
                              any of the following actions in our sole
                              discretion at any time and for any reason without
                              giving you any prior notice: Restrict, suspend, or
                              terminate your access to all or any part of our
                              Services; Change, suspend, or discontinue all or
                              any part of our Services; Refuse, move, or remove
                              any material that you submit to our sites for any
                              reason; Refuse, move, or remove any content that
                              is available on our sites; Deactivate or delete
                              your accounts and all related information and
                              files in your account; Establish general practices
                              and limits concerning use of our sites. You agree
                              that we will not be liable to you or any third
                              party for taking any of these actions Charges
                              Applicable: All the charges as applicable in the
                              usage of Paypointz Wallet are available on the
                              link below: Applicable Charges Notices: All
                              notices or demands to or upon web site shall be
                              effective if in writing and shall be duly made
                              when sent to Pay Point India on the following
                              Address: To: Pay Point India Network Pvt. Ltd, A
                              Wing, 203, Supreme Business Park,Hiranandani
                              Garden, Powai, Mumbai - 400076 Maharashtra, India.
                              feedback@paypointindia.com | +91 22 4068 8088 All
                              notices or demands to or upon a User(s) shall be
                              effective if either delivered personally, sent by
                              courier, certified mail, by facsimile or email to
                              the last-known correspondence, fax or email
                              address provided by the User(s) to web site, or by
                              posting such notice or demand on an area of the
                              web site that is publicly accessible without a
                              charge. Arbitration Pay Point India may elect to
                              resolve any dispute, controversy or claim arising
                              out of or relating to this Agreement or Service
                              provided in connection with this Agreement by
                              binding arbitration in accordance with the
                              provisions of the Indian Arbitration &
                              Conciliation Act, 1996. Any such dispute,
                              controversy or claim shall be arbitrated on an
                              individual basis and shall not be consolidated in
                              any arbitration with any claim or controversy of
                              any other party. The arbitration shall be
                              conducted in Mumbai, India and judgment on the
                              arbitration award may be entered in any court
                              having jurisdiction thereof. Either you or We may
                              seek any interim or preliminary relief from a
                              court of competent jurisdiction in Mumbai, India,
                              necessary to protect the rights or the property of
                              you or PaypointZ (or its agents, suppliers, and
                              subcontractors), pending the completion of
                              arbitration. Any arbitration shall be
                              confidential, and neither you nor we may disclose
                              the existence, content or results of any
                              arbitration, except as may be required by law or
                              for purposes of the arbitration award. All
                              administrative fees and expenses of arbitration
                              will be divided equally between you and us. In all
                              arbitrations, each party will bear the expense of
                              its own lawyers and preparation. The language of
                              Arbitration shall be English. Governing Law: Terms
                              and condition of use shall be governed in all
                              respect by the laws of Indian Territory. Pay Point
                              India considers itself and intended to be subject
                              to the jurisdiction only of the Courts of Mumbai,
                              Maharashtra, India. The parties to these Terms of
                              use hereby submit to the exclusive jurisdiction of
                              the courts of Mumbai, Maharashtra, India.
                            </div>
                            <div className="p-4   bg-zinc-100 border-t border-zinc-200 mt-auto">
                              <div className="flex flex-col gap-6 justify-between max-w-xl mx-auto">
                                <Button className="w-full">Agree</Button>

                                <Button className="w-full" variant="outline">
                                  Cancel
                                </Button>
                                {/* <a
                                  className="text-xs text-zinc-600 flex items-center gap-0.25"
                                  href="https://github.com/emilkowalski/vaul"
                                  target="_blank"
                                >
                                  GitHub
                                  <svg
                                    fill="none"
                                    height="16"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    aria-hidden="true"
                                    className="w-3 h-3 ml-1"
                                  >
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    <path d="M15 3h6v6"></path>
                                    <path d="M10 14L21 3"></path>
                                  </svg>
                                </a>
                                <a
                                  className="text-xs text-zinc-600 flex items-center gap-0.25"
                                  href="https://twitter.com/emilkowalski_"
                                  target="_blank"
                                >
                                  Twitter
                                  <svg
                                    fill="none"
                                    height="16"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    aria-hidden="true"
                                    className="w-3 h-3 ml-1"
                                  >
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    <path d="M15 3h6v6"></path>
                                    <path d="M10 14L21 3"></path>
                                  </svg>
                                </a> */}
                              </div>
                            </div>
                            {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
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
                        <span style={{ color: "red", fontSize: "14px" }}>
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
                      <h5>We Have Sent OTP on your given Mobile Number</h5>
                      <img src={Second_screen} alt="enter-mobile-otp-image" />
                      <div className="mt-5 otp_box col-md-8 mx-auto">
                        {[...Array(6)].map((_, index) => (
                          <input
                            key={index}
                            className="otp"
                            type="text"
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
                      <h4 className="mt-4">Did't Recieved OTP ?</h4>
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
                    <div className="main_step_4">
                      <h4>Personal Details</h4>
                      <h5 className="detailsAdditional">
                        Click From The Dropdown to View More Employment Status
                      </h5>
                    </div>
                    <div
                      className="main_step_4"
                      style={{ height: 350, overflow: "auto" }}
                    >
                      <div className="Detail_Form">
                        <div className="row">
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="name">Full Name</label>
                              <input
                                className="form-control"
                                type="text"
                                name="name"
                                defaultValue=""
                                placeholder="Enter Full Name"
                                id="name"
                                required
                                value={formValues.full_name.value}
                                onChange={(e) =>
                                  onInputChange("full_name", e.target.value)
                                }
                              />
                              {formValues.full_name.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
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
                              <label>DOB</label>
                              <input
                                className="form-control"
                                type="date"
                                name=""
                                defaultValue=""
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
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Please enter valid age
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          {/* <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="pannumber">PAN</label>
                              <input
                                style={{
                                  textTransform: "uppercase",
                                }}
                                className="form-control"
                                type="text"
                                name=""
                                defaultValue=""
                                placeholder="Enter Enter PAN Number"
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
                          </div> */}
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="business_address">
                                Business Address
                              </label>
                              <textarea
                                id="business_address"
                                className="form-control"
                                rows={1}
                                cols={50}
                                name="business_address"
                                placeholder="Address Business"
                                value={formValues.business_address.value}
                                onChange={(e) =>
                                  onInputChange(
                                    "business_address",
                                    e.target.value
                                  )
                                }
                              />
                              {formValues.business_address.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
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
                                Business Address Pincode
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                onKeyDown={(e) => onlyNumberValues(e)}
                                name="postal-code"
                                defaultValue=""
                                placeholder="Please Enter Pincode"
                                id="postal-code"
                                required
                                value={
                                  formValues.business_address_pincode.value
                                }
                                maxLength={6}
                                onChange={(e) =>
                                  onInputChange(
                                    "business_address_pincode",
                                    e.target.value
                                  )
                                }
                              />
                              {formValues.business_address_pincode.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Please enter valid business_address_pincode
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="street-address">
                                Current Address
                              </label>
                              <textarea
                                id="street-address"
                                className="form-control"
                                rows={1}
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
                                  style={{ color: "red", fontSize: "14px" }}
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
                                    onSameAsAboveClick(checked as boolean);
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
                                Current Address Pincode
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
                                  style={{ color: "red", fontSize: "14px" }}
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
                              <label htmlFor="Gender">Gender</label>

                              <select
                                id="my-select"
                                className="form-control"
                                name=""
                                onChange={(e) =>
                                  onInputChange("gender", e.target.value)
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
                              <label htmlFor="house">House</label>

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
                                Emergency Contact Number
                              </label>
                              <input
                                className="form-control"
                                maxLength={10}
                                type="text"
                                onKeyDown={(e) => onlyNumberValues(e)}
                                name="number"
                                defaultValue=""
                                placeholder="Emergency Contact Number"
                                id="number"
                                required
                                value={
                                  formValues.emergency_contact_number.value
                                }
                                onChange={(e) =>
                                  onInputChange(
                                    "emergency_contact_number",
                                    e.target.value
                                  )
                                }
                              />
                              {formValues.emergency_contact_number.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
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
                              <label htmlFor="email">Please Enter Email</label>
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                defaultValue=""
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
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Please enter valid email
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="nominee">Nominee Name</label>
                              <input
                                className="form-control"
                                type="text"
                                name="nominee"
                                defaultValue=""
                                placeholder="Nominee Name"
                                id="nominee"
                                required
                                value={formValues.nominee.value}
                                onChange={(e) =>
                                  onInputChange("nominee", e.target.value)
                                }
                              />
                              {formValues.nominee.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
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
                              <label htmlFor="relation">Nominee Relation</label>

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
                          </div>
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
                        Proceed
                      </button>
                    </div>
                  </div>
                )}
                {step === 5 && (
                  <div className="page">
                    <FileDialog
                      files={selfieImage}
                      setFiles={setSelfieImage}
                      image={Screen_5}
                      title={"Click Your Selfie"}
                      description={"Capture Clear Image of Yourself"}
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
                        Proceed
                      </button>
                    </div>
                  </div>
                )}
                {step === 6 && (
                  <div className="page">
                    <FileDialog
                      files={panCardImage}
                      setFiles={setPanCardImage}
                      image={Screen_6}
                      title={"PAN Card"}
                      description={"Capture Clear Image of Your PAN Card"}
                    />
                    <div className="field btns">
                      <button
                        disabled={isLoading}
                        onClick={(e) => handleNext(e)}
                        className={cn(
                          "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                          isLoading && "animate-pulse"
                        )}
                      >
                        capture
                      </button>
                    </div>
                  </div>
                )}
                {step === 7 && (
                  <div className="page">
                    <div className="col-md-12 mt-2">
                      <div className="form-group">
                        <label htmlFor="enter_aadhar_number">
                          Aadhar number
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="enter_aadhar_number"
                          defaultValue=""
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
                          <span style={{ color: "red", fontSize: "14px" }}>
                            Please enter correct aadhar number
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-md-12 mt-2">
                      <div className="form-group">
                        <label htmlFor="aadhar_otp">Aadhar OTP</label>
                        <input
                          readOnly={
                            formValues.aadhar_no.error ||
                            formValues.aadhar_no.value.length < 12
                          }
                          className="form-control"
                          type="text"
                          name="aadhar_otp"
                          defaultValue=""
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
                          <span style={{ color: "red", fontSize: "14px" }}>
                            Please enter correct otp
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {/* <FileDialog
                      files={addressProof}
                      setFiles={setAddressProof}
                      image={Screen_7}
                      title={"Proof of Address (Front)"}
                      description={"Capture Clear Image of Your Voter ID"}
                    /> */}

                    <div className="field btns">
                      <button
                        disabled={
                          isLoading || formValues.aadhar_no.value.length < 12
                        }
                        onClick={(e) => handleNext(e)}
                        className={cn(
                          "next-4 next disabled:opacity-70 disabled:pointer-events-none",
                          isLoading && "animate-pulse"
                        )}
                      >
                        capture
                      </button>
                    </div>
                  </div>
                )}
                {step === 8 && (
                  <div className="page">
                    <div className="main_step_8">
                      <h4>Enter Your Account Details</h4>
                      <img
                        // style={{ width: "60%" }}
                        src={Second_screen}
                        alt="enter-account-details-image"
                      />
                    </div>
                    <div
                      className="main_step_8"
                      style={{ height: 350, overflow: "auto" }}
                    >
                      {/* <table className="table table-light">
                        <tbody>
                          {bankList?.map((i, id) => {
                            return (
                              <tr key={id}>
                                <td>
                                  <div className="form-check">
                                    <label className="form-check-label">
                                      <input
                                        type="radio"
                                        className="form-check-input"
                                        name=""
                                        id=""
                                        defaultValue="checkedValue"
                                      />
                                      {i.AccountHolderName}
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table> */}
                      <RadioGroup>
                        {bankList?.map((i, id) => (
                          <article
                            key={id}
                            className="flex items-start space-x-6 p-6"
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
                                    value={i.AccountNumber}
                                    id={i.AccountNumber}
                                  />
                                </div>
                                <div>
                                  <dt className="sr-only">Bank name</dt>
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
                                  <dt className="sr-only">Ifsc code</dt>
                                  <dd className="text-slate-400">
                                    {i.IFSCCode}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </article>
                        ))}
                      </RadioGroup>
                      <h5>
                        Only Banks That Support Auto repayments will Show up
                      </h5>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="my-select">Select Your Bank</label>
                            <select
                              id="my-select"
                              className="form-control"
                              name=""
                              onChange={(e) =>
                                onInputChange("bank_account", e.target.value)
                              }
                            >
                              {bankDropDown.map((i, id) => (
                                <option key={id} value={i}>
                                  {i}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 mt-2">
                          <div className="form-group">
                            <label htmlFor="ifsc_code">Bank IFSC Code</label>
                            <input
                              className="form-control"
                              type="text"
                              name="ifsc_code"
                              defaultValue=""
                              placeholder="Bank IFSC Code"
                              id="ifsc_code"
                              required
                              onChange={(e) =>
                                onInputChange("ifsc_code", e.target.value)
                              }
                            />
                            {formValues.ifsc_code.error ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
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
                            {formValues.account_holder_name.error ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
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
                              defaultValue=""
                              placeholder="Account Number"
                              id="account_number"
                              required
                              maxLength={20}
                              onKeyDown={(e) => onlyNumberValues(e)}
                              onChange={(e) =>
                                onInputChange("account_number", e.target.value)
                              }
                            />
                            {formValues.account_number.error ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
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
                              defaultValue=""
                              placeholder="Confirm Account Number"
                              id="confirm_account_number"
                              required
                              maxLength={20}
                              onKeyDown={(e) => onlyNumberValues(e)}
                              onChange={(e) =>
                                onInputChange(
                                  "confirm_account_number",
                                  e.target.value
                                )
                              }
                            />
                            {formValues.confirm_account_number.error ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
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
                        confirm
                      </button>
                    </div>
                  </div>
                )}
                {step === 9 && (
                  <div className="page">
                    <div
                      className="main_step_9 col-md-12 pt-2"
                      style={{ height: 350, overflow: "auto" }}
                    >
                      Please read the following Terms and Conditions of service
                      that you agree to, when you access www.paypointz.com
                      ("website"), a service offered by Pay Point India Network
                      Private Limited or through the assistance of an agent of
                      Pay Point India Network Private Limited. The Terms and
                      Conditions (as may be amended from time to time, the
                      "Agreement") is a legal contract between you being, an
                      individual customer, user, or beneficiary of this service
                      of at least 18 years of age, and Pay Point India Network
                      Private Limited (Pay Point India) having its registered
                      office at 'A' Wing 203, Supreme Business Park, Hiranandani
                      Garden, Powai, Mumbai 400076, Maharashtra - India
                      feedback@paypointindia.com | +91 22 4050 8888 / 4068 8088.
                      All services are rendered by Pay Point India through its
                      platform under the brand name 'PaypointZ' &amp; 'Tatkal
                      Rupya'. Hence all the rights, benefits, liabilities &amp;
                      obligations under the following terms &amp; conditions
                      shall accrue to the benefit of Pay Point India. (together
                      with its subsidiaries and other affiliates, "us", "We",
                      "Tatkal Rupya", or "PaypointZ"), regarding your use of our
                      Services regarding Semi Closed Wallet of online PaypointZ
                      or such other services which may be added from time to
                      time (all such services are individually or collectively
                      are referred as Service or Services as they case may be).
                      Service can be used by you subject to your adherence with
                      the terms and conditions set forth below including
                      relevant policies. PaypointZ reserves the right, at its
                      sole discretion, to revise, portions of these terms and
                      conditions any time without further notice. You shall
                      re-visit the "Terms &amp; Conditions" link from time to
                      time to stay abreast of any changes that the "Site" may
                      introduce. Quality of Services Pay Point India agrees to
                      provide you products at the press of a button. Pay Point
                      India is committed to investigate the cause of
                      non-performance with all parties involved. However, no
                      refunds will be made to your PaypointZ balance unless it
                      is clearly established that Pay Point India was
                      responsible. Link to other websites Pay Point India may
                      provide links to other websites that are maintained by
                      third parties. Pay Point India is not responsible and/or
                      liable for any information available on these third party
                      websites. Links to third party sites are provided by web
                      site as a convenience to user(s) and Pay Point India has
                      not have any control over such sites i.e. content and
                      resources provided by them. Pay Point India may allow
                      user(s) access to content, products or services offered by
                      third parties through hyper links (in the form of word
                      link, banners, channels or otherwise) to such Third
                      Party’s web site. You are cautioned to read such sites’
                      terms and conditions and/or privacy policies before using
                      such sites in order to be aware of the terms and
                      conditions of your use of such sites. Pay Point India
                      believes that user(s) acknowledge that it has no control
                      over such third party’s site, does not monitor such sites,
                      and Pay Point India shall not be responsible or liable to
                      anyone for such third party site, or any content, products
                      or services made available on such a site. Limited
                      Warranty Pay Point India concedes to provide efficient,
                      reliable, timely and satisfactory service to the best of
                      its resources and skills. Pay Point India makes no
                      warranty that the website will be uninterrupted, error
                      free, and virus free or free from any malicious content.
                      The Website is provided on an "as is where is" and "as
                      available" basis. In any case of unsatisfactory service by
                      Pay Point India, it agrees to take proper corrective
                      action on the basis of decision taken by Pay Point India.
                      Limitation of Liability and Damages In no event will Pay
                      Point India or its contractors, agents, licensors,
                      partners, officers, directors, suppliers be liable to you
                      for any special, indirect, incidental, consequential,
                      punitive, reliance, or exemplary damages (including
                      without limitation lost business opportunities, lost
                      revenues, or loss of anticipated profits or any other
                      pecuniary or non-pecuniary loss or damage of any nature
                      whatsoever) arising out of or relating to (i) this
                      agreement, (ii) the services, the site or any reference
                      site, or (iii) your use or inability to use the services,
                      the site (including any and all materials) or any
                      reference sites, even if Pay Point India or a it’s
                      authorized representative has been advised of the
                      possibility of such damages. In no event will Pay Point
                      India or any of its contractors, directors, employees,
                      agents, third party partners, licensors or suppliers’
                      total liability to you for all damages, liabilities,
                      losses, and causes of action arising out of or relating to
                      (i) this Agreement, (ii) the Services, (iii) your use or
                      inability to use the Services or the Site (including any
                      and all Materials) or any Reference Sites, or. You
                      acknowledge and agree that Pay Point India has offered its
                      products and services, set its prices, and entered into
                      this agreement in reliance upon the warranty disclaimers
                      and the limitations of liability set forth herein, that
                      the warranty disclaimers and the limitations of liability
                      set forth herein reflect a reasonable and fair allocation
                      of risk between you and Pay Point India, and that the
                      warranty disclaimers and the limitations of liability set
                      forth herein form an essential basis of the bargain
                      between you and Pay Point India. It would not be able to
                      provide the services to you on an economically reasonable
                      basis without these limitations. Applicable law may not
                      allow the limitation or exclusion of liability or
                      incidental or consequential damages, so the above
                      limitations or exclusions may not apply to you. In such
                      cases, Pay Point India’s liability will be limited to the
                      fullest extent permitted by applicable law. This paragraph
                      shall survive termination of this Agreement.
                      Indemnification You agree to indemnify, save, and hold Pay
                      Point India, its affiliates, contractors, employees,
                      officers, directors, agents and its third party suppliers,
                      licensors, and partners harmless from any and all claims,
                      losses, damages, and liabilities, costs and expenses,
                      including without limitation legal fees and expenses,
                      arising out of or related to your use or misuse of the
                      Services or of the Site, any violation by you of this
                      Agreement, or any breach of the representations,
                      warranties, and covenants made by you herein. Pay Point
                      India reserves the right, at your expense, to assume the
                      exclusive defense and control of any matter for which you
                      are required to indemnify Pay Point India, including
                      rights to settle, and you agree to cooperate with Pay
                      Point India’s defense and settlement of these claims. Pay
                      Point India will use reasonable efforts to notify you of
                      any claim, action, or proceeding brought by a third party
                      that is subject to the foregoing indemnification upon
                      becoming aware of it. This paragraph shall survive
                      termination of this Agreement. Ownership; Proprietary
                      Rights The Services and the Site are owned and operated by
                      Pay Point India and/or third party licensors. The visual
                      interfaces, graphics, design, compilation, information,
                      computer code (including source code and object code),
                      products, software, services, and all other elements of
                      the Services and the Site provided by Pay Point India (the
                      “Materials”) are protected by Indian copyright, trade
                      dress, patent, and trademark laws, international
                      conventions, and all other relevant intellectual property
                      and proprietary rights, and applicable laws. As between
                      you and Pay Point India, all Materials, trademarks,
                      service marks, and trade names contained on the Site are
                      the property of Pay Point India and/or third party
                      licensors or suppliers. You agree not to remove, obscure,
                      or alter Pay Point India or any third party’s copyright,
                      patent, trademark, or other proprietary rights notices
                      affixed to or contained within or accessed in conjunction
                      with or through the Services. Except as expressly
                      authorized by Pay Point India, you agree not to sell,
                      license, distribute, copy, modify, publicly perform or
                      display, transmit, publish, edit, adapt, create derivative
                      works from, or otherwise make unauthorized use of the
                      Materials. Pay Point India reserves all rights not
                      expressly granted in this Agreement. If you have comments
                      regarding the Services and the Site or ideas on how to
                      improve it, please contact customer service. Please note
                      that by doing so, you hereby irrevocably assign to Pay
                      Point India, and shall assign to it, all right, title and
                      interest in and to all ideas and suggestions and any and
                      all worldwide intellectual property rights associated
                      therewith. You agree to perform such acts and execute such
                      documents as may be reasonably necessary to perfect the
                      foregoing rights. Severability The Services and the Site
                      are owned and operated by Pay Point India and/or third
                      party If any provision of this Agreement is held to be
                      unlawful, void, invalid or otherwise unenforceable, then
                      that provision will be limited or eliminated from this
                      Agreement to the minimum extent required, and the
                      remaining provisions will remain valid and enforceable.
                      Terms and conditions of usage of Prepaid Cards: This
                      prepaid payment instrument (Prepaid Card) is governed by
                      the Payment and Settlement Systems Act, 2007 &amp;
                      Regulations made thereunder, Issuance and Operation of
                      Pre-paid Payment Instruments in India (Reserve Bank)
                      Directions, 2009 (“RBI Guidelines”) and is also subject to
                      directions / instructions issued by the Reserve Bank of
                      India (RBI) from time to time in respect of redemption,
                      repayment, usage etc. and Pay Point India Network Private
                      Ltd. (Pay Point India) does not hold any responsibility to
                      the cardholder in such circumstances. This Prepaid Card
                      should be utilized by individuals above 18 years of age.
                      You agree to provide information that is true, accurate
                      and complete. You also agree to provide correct and
                      accurate credit/ debit card details to the approved
                      payment gateway for availing Services on the Website and
                      associated Applications. You shall not use a credit/ debit
                      card unlawfully. You will be solely responsible for the
                      security and confidentiality of your credit/ debit card
                      details. Pay Point India expressly disclaims all
                      liabilities that may arise as a consequence of any
                      unauthorized use of credit/ debit card. Any suspicious
                      activity may lead to blockage of the account. The maximum
                      value of a Prepaid Card is Rs. 10,000 and Rs. 1,00,000 in
                      case all additional services are enabled on it after
                      submitting requisite KYC documents. Pay Point India may
                      use the KYC submitted by you for business purposes. You
                      hereby consent to (i) receiving e-newsletters as well as
                      other communications containing offers etc. and (ii) Pay
                      Point India providing your information to sponsor/s and/or
                      companies associated with it for the purpose of providing
                      you with offers and/or information. You hereby agree to
                      use this Prepaid Card for all transactions with prescribed
                      merchants for the products/services as mentioned by the
                      merchant on its website and further agree not to use it
                      for any unlawful purpose/activities. You will neither
                      abate nor be a party to any illegal/criminal/money
                      laundering/terrorist activities undertaken by using this
                      Prepaid Card. Pay Point India shall not be responsible for
                      any fraud or misuse of this Prepaid Card and you agree to
                      be personally liable for any and all costs, taxes,
                      charges, claims or liabilities of any nature, arising due
                      to any such fraud or misuse of the Prepaid Card. You
                      hereby declare that your name does not at anytime appear
                      in the consolidated list of Terrorist Individuals /
                      Organisations (Al Qaida or the Taliban) as circulated by
                      RBI from time to time. Pay Point India shall not be liable
                      / responsible for any defect in the product / merchandise
                      / goods or services purchased / availed using this Prepaid
                      Card. Any dispute or claim regarding the product /
                      merchandise / goods or services purchased / availed on the
                      website of the merchant using this Prepaid Card must be
                      resolved with the designated merchants. Pay Point India
                      does not own any responsibility to the cardholder in such
                      circumstances. Pay Point India may charge payment gateway
                      service fees to you for use of this Prepaid Card on the
                      designated merchants. The said fees will not exceed 2.5%
                      of the total transaction value. Additionally, if used or
                      loaded at a retail agent of Pay Point India Network Pvt.
                      Limited, a convenience fee of INR 10 per transaction will
                      be charged. This Prepaid Card is valid for 18 months from
                      the date of its first usage or 18 months from date of
                      issue, whichever is earlier. Any unutilized balance
                      remaining in this Prepaid Card after the date of expiry
                      will stand forfeited as per the RBI Guidelines. In case
                      the Prepaid Card is lost or misplaced, you shall promptly
                      inform Pay Point India in writing (letter/e-mail). The
                      Prepaid Card shall then be blocked and Pay Point India may
                      issue new card as per prescribed procedure in this regard
                      with the balance amount for a nominal charge as may be
                      prescribed by Pay Point India from time to time. Any
                      duplication of this Prepaid Card will be subject to
                      cancellation. This Prepaid Card cannot be used for
                      transactions in foreign currency. This Prepaid Card can be
                      used only for online/on mobile/IVRS transactions with the
                      merchants governed by Indian laws. This Prepaid Card is
                      not transferable. Pay Point India reserves the right at
                      any time to refuse for any reason whatsoever, the use of
                      the Prepaid Card on the website/mobile application/IVRS of
                      designated merchants. You shall promptly inform Pay Point
                      India of any change of your name, mailing address, e-mail
                      address or any other required data provided for the
                      issuance of this Prepaid Card and submit the fresh KYC
                      documents in respect of such change, as may be demanded by
                      Pay Point India. For resolving any dispute, Pay Point
                      India has formalized “Customer Grievance Redressal Policy”
                      which is available on the website of All disputes arising
                      out of any transaction pertaining to the use of this
                      Prepaid Card shall be subject to this policy. Any further
                      litigation shall be governed by exclusive jurisdiction of
                      the courts in Mumbai. All transactions done by using this
                      Prepaid Card are subject to applicable Indian laws. Pay
                      Point India reserves the right to amend, alter, delete,
                      insert and revise these terms and conditions without any
                      prior notice/intimation to customer. We have the right,
                      but not the obligation, to take any of the following
                      actions in our sole discretion at any time and for any
                      reason without giving you any prior notice: Restrict,
                      suspend, or terminate your access to all or any part of
                      our Services; Change, suspend, or discontinue all or any
                      part of our Services; Refuse, move, or remove any material
                      that you submit to our sites for any reason; Refuse, move,
                      or remove any content that is available on our sites;
                      Deactivate or delete your accounts and all related
                      information and files in your account; Establish general
                      practices and limits concerning use of our sites. You
                      agree that we will not be liable to you or any third party
                      for taking any of these actions Charges Applicable: All
                      the charges as applicable in the usage of Paypointz Wallet
                      are available on the link below: Applicable Charges
                      Notices: All notices or demands to or upon web site shall
                      be effective if in writing and shall be duly made when
                      sent to Pay Point India on the following Address: To: Pay
                      Point India Network Pvt. Ltd, A Wing, 203, Supreme
                      Business Park,Hiranandani Garden, Powai, Mumbai - 400076
                      Maharashtra, India. feedback@paypointindia.com | +91 22
                      4068 8088 All notices or demands to or upon a User(s)
                      shall be effective if either delivered personally, sent by
                      courier, certified mail, by facsimile or email to the
                      last-known correspondence, fax or email address provided
                      by the User(s) to web site, or by posting such notice or
                      demand on an area of the web site that is publicly
                      accessible without a charge. Arbitration Pay Point India
                      may elect to resolve any dispute, controversy or claim
                      arising out of or relating to this Agreement or Service
                      provided in connection with this Agreement by binding
                      arbitration in accordance with the provisions of the
                      Indian Arbitration &amp; Conciliation Act, 1996. Any such
                      dispute, controversy or claim shall be arbitrated on an
                      individual basis and shall not be consolidated in any
                      arbitration with any claim or controversy of any other
                      party. The arbitration shall be conducted in Mumbai, India
                      and judgment on the arbitration award may be entered in
                      any court having jurisdiction thereof. Either you or We
                      may seek any interim or preliminary relief from a court of
                      competent jurisdiction in Mumbai, India, necessary to
                      protect the rights or the property of you or PaypointZ (or
                      its agents, suppliers, and subcontractors), pending the
                      completion of arbitration. Any arbitration shall be
                      confidential, and neither you nor we may disclose the
                      existence, content or results of any arbitration, except
                      as may be required by law or for purposes of the
                      arbitration award. All administrative fees and expenses of
                      arbitration will be divided equally between you and us. In
                      all arbitrations, each party will bear the expense of its
                      own lawyers and preparation. The language of Arbitration
                      shall be English. Governing Law: Terms and condition of
                      use shall be governed in all respect by the laws of Indian
                      Territory. Pay Point India considers itself and intended
                      to be subject to the jurisdiction only of the Courts of
                      Mumbai, Maharashtra, India. The parties to these Terms of
                      use hereby submit to the exclusive jurisdiction of the
                      courts of Mumbai, Maharashtra, India.
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
                        confirm
                      </button>
                    </div>
                  </div>
                )}
                {step === 10 && (
                  <div className="page">
                    <div className="main_step_10">
                      <div className="last_screen_coin">
                        <img src={coin} alt="coin-image" />
                      </div>
                      <div className="last_content">
                        <h4>
                          <i className="fa fa-inr" aria-hidden="true" /> 50,000
                        </h4>
                        <p>INSTANT HAPPYNESS</p>
                      </div>
                    </div>
                    <div className="main_step_10bottom">
                      <div className="loanDetails">
                        <p>
                          Tenure <span>180 days</span>
                        </p>
                        <p>
                          Installment Amount
                          <span>
                            <i className="fa fa-inr" aria-hidden="true" />
                            25,000
                          </span>
                        </p>
                        <p>
                          Number Installments <span> 10</span>
                        </p>
                      </div>
                      <div className="loanDetails">
                        <p>
                          Interest Rate
                          <span>
                            <i className="fa fa-inr" aria-hidden="true" />
                            3,125
                          </span>
                        </p>
                        <p>
                          Processing Fees
                          <span>
                            <i className="fa fa-inr" aria-hidden="true" /> 0
                          </span>
                        </p>
                        <p>
                          Net Disbursed Amount
                          <span>
                            <i className="fa fa-inr" aria-hidden="true" />
                            21,500
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="field btns">
                      <button
                        disabled={isLoading}
                        onClick={(e) => handleNext(e)}
                        className="submit disabled:opacity-70 disabled:pointer-events-none"
                      >
                        i accept
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
