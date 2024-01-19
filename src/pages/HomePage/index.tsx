import { FC, useEffect, useRef, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

import coin from "../../assets/images/coin.png";
import Second_screen from "../../assets/images/Second_screen.jpg";
import Screen_5 from "../../assets/images/Screen_5.jpg";
import Screen_6 from "../../assets/images/Screen_6.jpg";
import Screen_7 from "../../assets/images/Screen_7.jpg";

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
  ParsedMerchantAddressDetails,
  ParsedMerchantDetails,
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
import { Input } from "@/components/ui/input";
import { DrawerDemo } from "@/components/DrawerDemo";

const index: FC = () => {
  const [step, setStep] = useState(1);
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
    } else if (step === 9) {
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
          const offerDetails: OfferDetails = JSON.parse(data.message);
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
            const details: ParsedMerchantDetails = JSON.parse(data.data);
            const inputDate = new Date(details.DateOfBirth);
            const formattedDate = format(inputDate, "yyyy-MM-dd");
            let _formValues = { ...formValues };
            _formValues.dob.value = formattedDate;
            _formValues.email.value = details.EmailId;
            _formValues.pan_number.value = details.PANNo;
            _formValues.full_name.value =
              details.FirstName.trim() +
              " " +
              details.MiddleName.trim() +
              " " +
              details.LastName.trim();
            setFormValues(_formValues);
            await getBusinessAddressDetails();
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
      MerchantID: "7e77a7d4" || formValues.merchant_id.value,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app

      .post({
        url: "/BusinessBankDetails",
        requestBody: encryptedBody,
      })
      .then(
        async (
          res: AxiosResponse<GetBusinessMerchantDetailsAPIResponseType>
        ) => {
          const { data } = res;
          setIsLoading(false);
          if (data.status === "Success") {
            const _banklist: [BankList] = JSON.parse(data.data);
            setBankList(_banklist);
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

  const getBusinessAddressDetails = async () => {
    const body = {
      MerchantID: formValues.merchant_id.value,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post({
        url: "/BusinessAddressDetails",
        requestBody: encryptedBody,
      })
      .then(
        async (
          res: AxiosResponse<GetBusinessMerchantDetailsAPIResponseType>
        ) => {
          const { data } = res;
          setIsLoading(false);
          if (data.status === "Success") {
            const details: ParsedMerchantAddressDetails = JSON.parse(data.data);
            let _formValues = { ...formValues };
            _formValues.business_address_pincode.value = details.PinCode;
            _formValues.business_address.value =
              details.Address1 + details.Address2;

            setFormValues(_formValues);
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
      AadhaarNo: "852156641623",
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

  return (
    <>
      {AlertModal({
        title: "",
        description: "",
      })}
      <div className="container">
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
                <p>Confirm</p>
                <div className="bullet">
                  <i
                    className={`fas fa-check-double ${
                      step > 8 ? "" : "inactive"
                    } `}
                  />
                  <div className="check fas fa-check" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
                              {" " + Math.round(Number(offers.LoanAmount))}
                            </p>
                            <strong>
                              Tenor: {Math.round(offers.Tenor)} days
                            </strong>
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
                      <DrawerDemo />
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
                    <div className="main_step_9">
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
                    <div className="main_step_9bottom">
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
