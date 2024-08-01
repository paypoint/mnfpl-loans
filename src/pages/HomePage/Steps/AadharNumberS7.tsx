import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/modals/alert-modal";

import { cn, onlyNumberValues } from "@/lib/utils";
import crypto from "@/lib/crypto";
import api from "@/services/api";

import { AadharGetotpAPIRespnseType, OfferDetails } from "@/types";

interface AadharNumberS7Props {
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  merchant_id: string;
  verificationToken: string;
  offers?: OfferDetails;
}

const AadharNumberS7: FC<AadharNumberS7Props> = ({
  handleNext,
  isLoading,
  setIsLoading,
  merchant_id,
  verificationToken,
  offers,
}) => {
  const defaultFormValues = {
    aadhar_no: {
      value: "",
      error: false,
    },
    client_id: {
      value: "",
      error: false,
    },
    aadhar_otp: {
      value: "",
      error: false,
    },
  };

  const [formValues, setFormValues] = useState(defaultFormValues);

  const [showAlert, AlertModal] = useAlert();

  const [aadharOTPcountDownTimer, setAadharOTPcountDownTimer] = useState(60);

  const startAadharOTPTimer = () => {
    setInterval(() => {
      setAadharOTPcountDownTimer((PrevCountDown) => PrevCountDown - 1);
    }, 1000);
  };

  const onInputChange = (id: keyof typeof defaultFormValues, value: string) => {
    let _formValues = { ...formValues };
    _formValues[id].value = value;
    _formValues[id].error = false;
    setFormValues(_formValues);
  };

  const generateAadharOTP = async () => {
    const body = {
      AadhaarNo: formValues.aadhar_no.value,
      MerchantID: merchant_id,
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
    <div className="page pt-2">
      <div className="col-md-12 mt-2">
        <div className="form-group ">
          <label htmlFor="enter_aadhar_number mt-2">Aadhar number *</label>
          <input
            className="form-control"
            type="password"
            name="enter_aadhar_number"
            placeholder="Enter aadhar number"
            id="enter_aadhar_number"
            required
            maxLength={12}
            onKeyDown={(e) => onlyNumberValues(e)}
            onChange={(e) => onInputChange("aadhar_no", e.target.value)}
          />
          {formValues.aadhar_no.error ? (
            <span style={{ color: "red", fontSize: "14px" }}>
              Please enter correct aadhar number
            </span>
          ) : (
            ""
          )}{" "}
          {isLoading && formValues.aadhar_otp.value.length !== 6 && (
            <span className="text-sm">Verifying aadhar number...</span>
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
            onChange={(e) => onInputChange("aadhar_otp", e.target.value)}
          />
          {formValues.aadhar_otp.error ? (
            <span style={{ color: "red", fontSize: "14px" }}>
              Please enter correct otp
            </span>
          ) : (
            ""
          )}
        </div>
      </div>{" "}
      {aadharOTPcountDownTimer < 60 && (
        <div className="flex p-4 justify-end">
          {aadharOTPcountDownTimer < 60 && aadharOTPcountDownTimer > 0 ? (
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
          disabled={isLoading || formValues.aadhar_no.value.length < 12}
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
  );
};

export default AadharNumberS7;
