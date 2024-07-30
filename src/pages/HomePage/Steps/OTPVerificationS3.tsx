import { FC, useEffect, useRef, useState } from "react";
import { onlyNumberValues, cn } from "@/lib/utils";
import Second_screen from "@/assets/images/Second_screen.jpg";
import { Button } from "@/components/ui/button";
import crypto from "@/lib/crypto";
import api from "@/services/api";
import { SendOTPAPIResponse } from "@/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAlert } from "@/components/modals/alert-modal";

interface OTPVerificationS3Props {
  setVerificationToken: (token: string) => void;
  mobile_no: string;
  ref_id: string;
  verifyOTP: (otp: string) => Promise<void>;
}

const OTPVerificationS3: FC<OTPVerificationS3Props> = ({
  setVerificationToken,
  mobile_no,
  ref_id,
  verifyOTP,
}) => {
  useEffect(() => {
    setInterval(() => {
      setCountDownTimer((PrevCountDown) => PrevCountDown - 1);
    }, 1000);
  }, []);
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  );

  const [showAlert, AlertModal] = useAlert();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countDownTimer, setCountDownTimer] = useState(120);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [formValues, setFormValues] = useState({
    otp: {
      value: "",
      error: false,
    },
  });

  const digitValidate = (index: number, value: string) => {
    // Update the OTP values in the state
    setOtpValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value.replace(/[^0-9]/g, "");
      return newValues;
    });
    const otp = otpValues.join("");
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

  const sendOTP = async (resend?: boolean) => {
    const body = {
      MobileNumber: mobile_no,
      RefID: ref_id,
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

  const onSubmit = async () => {
    let _formValues = { ...formValues };
    const otp = otpValues.join("");
    if (otp.length === 6 && Number(otp)) {
      _formValues.otp.value = otp;
      _formValues.otp.error = false;
      setFormValues(_formValues);
      await verifyOTP(otp);
    } else {
      _formValues.otp.error = true;
      setFormValues(_formValues);
    }
  };

  return (
    <>
      {" "}
      {AlertModal({
        title: "",
        description: "",
      })}
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
                type="password"
                onChange={(e) => digitValidate(index, e.target.value)}
                onKeyUp={(e) => tabChange(index, e.currentTarget.value)}
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
                {countDownTimer < 10 ? `0${countDownTimer}` : countDownTimer} )
              </h5>
            )
          )}
        </div>
        <div className="field btns">
          <button
            disabled={isLoading}
            onClick={() => onSubmit()}
            className={cn(
              "next-2 next disabled:opacity-70 disabled:pointer-events-none",
              isLoading && "animate-pulse"
            )}
          >
            verify
          </button>
        </div>
      </div>
    </>
  );
};

export default OTPVerificationS3;
