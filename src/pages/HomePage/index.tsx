import { FC, useEffect, useRef, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

import coin from "../../assets/images/coin.png";
import Second_screen from "../../assets/images/Second_screen.jpg";
import Screen_5 from "../../assets/images/Screen_5.jpg";
import Screen_6 from "../../assets/images/Screen_6.jpg";
import Screen_7 from "../../assets/images/Screen_7.jpg";

import validations from "@/lib/validations";
import api from "@/services/api";
import { FileDialog } from "@/components/ui/file-dialog";
import { FileWithPreview, GetOffersAPIResponseType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertModal } from "@/components/modals/alert-modal";

import "./style.css";

const index: FC = () => {
  const [step, setStep] = useState(1);
  const [countDownTimer, setCountDownTimer] = useState(50);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [selfieImage, setSelfieImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [panCardImage, setPanCardImage] = useState<FileWithPreview[] | null>(
    null
  );
  const [addressProof, setAddressProof] = useState<FileWithPreview[] | null>(
    null
  );
  const [open, setOpen] = useState(false);

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
      value: "",
      error: false,
    },
    pan_number: {
      value: "",
      error: false,
    },
    pincode: {
      value: "",
      error: false,
    },
    address_business: {
      value: "",
      error: false,
    },
    address_current: {
      value: "",
      error: false,
    },
    address_kyc: {
      value: "",
      error: false,
    },
    email: {
      value: "",
      error: false,
    },
    house: {
      value: "",
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
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  type offerType = Omit<GetOffersAPIResponseType["Message"], "Status">;
  const [offers, setOffers] = useState<offerType>();

  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  );

  const digitValidate = (index: number, value: string) => {
    console.log(value);
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

  const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        setStep((prevStep) => prevStep + 1);
        setInterval(() => {
          setCountDownTimer((PrevCountDown) => PrevCountDown - 1);
        }, 1000);
      }
    } else if (step === 3) {
      let otp = otpValues.join("");
      if (otp.length === 6 && Number(otp)) {
        _formValues.otp.value = otp;
        _formValues.otp.error = false;
        setFormValues(_formValues);
        setStep((prevStep) => prevStep + 1);
      } else {
        _formValues.otp.error = true;
        setFormValues(_formValues);
      }
    } else if (step === 4) {
      let formObjectHasError = false;
      Object.keys(_formValues).forEach((key) => {
        if (
          // key === "house" ||
          key === "nominee" ||
          key === "gender" ||
          key === "address_business" ||
          key === "address_current" ||
          key === "address_kyc" ||
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
        if (key === "pincode") {
          let hasError = !validations.isPINValid(_formValues[key].value);
          _formValues[key].error = !validations.isPINValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }
        if (key === "pan_number") {
          let hasError = !validations.isPANCardValid(_formValues[key].value);
          _formValues[key].error = !validations.isPANCardValid(
            _formValues[key].value
          );
          if (hasError) {
            formObjectHasError = true;
          }
        }

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
        setStep((prevStep) => prevStep + 1);
        console.log(formValues);
      } else {
        setFormValues(_formValues);
      }
    } else if (step === 5) {
      if (selfieImage) {
        setStep((prevStep) => prevStep + 1);
      } else {
        alert("Please upload selfie");
      }
    } else if (step === 6) {
      if (panCardImage) {
        setStep((prevStep) => prevStep + 1);
      } else {
        alert("Please upload pan card image");
      }
    } else if (step === 7) {
      if (addressProof) {
        setStep((prevStep) => prevStep + 1);
      } else {
        alert("Please upload address proof image");
      }
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
  const houseDropDown = ["crib", "hood", "streets"];
  const bankDropDown = [
    "HDFC Bank",
    "State Bank of India Bank",
    "Bank of India",
  ];

  useEffect(() => {
    getOffers();
  }, []);

  const getOffers = async () => {
    await api.app
      .getOffers({
        RefID: "1334338946318021960dbc7fc4-aa0d-4b49-8f46-ee03dc2260ac",
      })
      .then((res: AxiosResponse<GetOffersAPIResponseType>) => {
        let { data } = res;
        if (data.Status === "S") {
          setOffers(data.Message);
        } else {
          toast.error(data.Message.toString());
        }
      })
      .catch((error) => {
        setOpen(true);
        const err = error as AxiosError;
        toast.error(err.message, { duration: 2000 });
      });
  };

  const onlyNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = event.which || event.keyCode;
    const isValid = /^[0-9]+$/.test(String.fromCharCode(keyCode));
    return isValid;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Delete" || event.key === "Backspace") {
    } else if (!onlyNumber(event)) {
      event.preventDefault();
    }
  };

  return (
    <body>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={"Something went wrong"}
        description={"Please retry after some time"}
      />
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
                            <p>
                              <i className="fa fa-inr" aria-hidden="true" />{" "}
                              {offers.loanAmt}
                            </p>
                            <strong>{offers.Tenor}</strong>
                            <span>{offers.ExpiryDate}</span>
                          </div>
                        </div>
                      ) : (
                        <Skeleton className="bg-cover min-h-[450px] relative shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] m-[15px] rounded-[15px]" />
                      )}

                      <div className="check_box">
                        <div className="check">
                          <div className="form-check form-check-inline">
                            <input
                              id="termsCondition1"
                              className="form-check-input"
                              type="checkbox"
                              name="termsCondition1"
                              defaultValue="true"
                              required
                              onChange={(e) => {
                                onInputChange(
                                  "termsCondition1",
                                  e.target.checked
                                );
                              }}
                            />
                            <label
                              htmlFor="termsCondition1"
                              className="form-check-label"
                            >
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit.
                            </label>
                          </div>
                          <div className="form-check form-check-inline mb-3">
                            <input
                              id="termsCondition2"
                              className="form-check-input"
                              type="checkbox"
                              name="termsCondition2"
                              defaultValue="true"
                              required
                              onChange={(e) => {
                                onInputChange(
                                  "termsCondition2",
                                  e.target.checked
                                );
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
                        disabled={!offers}
                        style={{ opacity: offers ? "" : "0.7" }}
                        onClick={(e) => handleNext(e)}
                        className="firstNext next"
                      >
                        Apply Now
                      </button>
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
                        // readOnly

                        maxLength={10}
                        name="number"
                        className="form-control"
                        placeholder="Enter Mobile Number"
                        type="text"
                        onKeyDown={(e) => handleKeyPress(e)}
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
                        onClick={(e) => handleNext(e)}
                        className="next-1 next"
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
                      <h5>We Have Sent OTP on Your Registred Mobile Number</h5>
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
                            onKeyDown={(e) => handleKeyPress(e)}
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

                      <h5>
                        Please Wait ( 00:
                        {countDownTimer < 0 ? "00" : countDownTimer} )
                      </h5>
                    </div>
                    <div className="field btns">
                      <button
                        onClick={(e) => handleNext(e)}
                        className="next-2 next"
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
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="sex">Gender</label>
                              <input
                                className="form-control"
                                type="text"
                                name="sex"
                                defaultValue=""
                                placeholder="Please Enter Gender"
                                id="sex"
                                required
                                onChange={(e) =>
                                  onInputChange("gender", e.target.value)
                                }
                              />
                              {formValues.gender.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Gender should not be empty
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mt-2">
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
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="postal-code">Pincode</label>
                              <input
                                className="form-control"
                                type="text"
                                onKeyDown={(e) => handleKeyPress(e)}
                                name="postal-code"
                                defaultValue=""
                                placeholder="Please Enter Pincode"
                                id="postal-code"
                                required
                                maxLength={6}
                                onChange={(e) =>
                                  onInputChange("pincode", e.target.value)
                                }
                              />
                              {formValues.pincode.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Please enter valid pincode
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="address_business">
                                Address Business
                              </label>
                              <textarea
                                id="address_business"
                                className="form-control"
                                rows={1}
                                cols={50}
                                name="address_business"
                                placeholder="Address Business"
                                defaultValue={""}
                                onChange={(e) =>
                                  onInputChange(
                                    "address_business",
                                    e.target.value
                                  )
                                }
                              />
                              {formValues.address_business.error ? (
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
                              <label htmlFor="street-address">
                                Address Current
                              </label>
                              <textarea
                                id="street-address"
                                className="form-control"
                                rows={1}
                                cols={50}
                                name="street-address"
                                placeholder="Address Current"
                                defaultValue={""}
                                onChange={(e) =>
                                  onInputChange(
                                    "address_current",
                                    e.target.value
                                  )
                                }
                              />
                              {formValues.address_current.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  Current address should not be empty
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="address_kyc">Address KYC</label>
                              <textarea
                                id="address_kyc"
                                className="form-control"
                                rows={1}
                                cols={50}
                                name="address_kyc"
                                placeholder="Address KYC"
                                defaultValue={""}
                                onChange={(e) =>
                                  onInputChange("address_kyc", e.target.value)
                                }
                              />
                              {formValues.address_kyc.error ? (
                                <span
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  KYC address should not be empty
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mt-2">
                            <div className="form-group">
                              <label htmlFor="house">
                                House – Owned/Rented
                              </label>

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
                                onKeyDown={(e) => handleKeyPress(e)}
                                name="number"
                                defaultValue=""
                                placeholder="Emergency Contact Number"
                                id="number"
                                required
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
                              <label htmlFor="">
                                Nominee Name and Relation
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name=""
                                defaultValue=""
                                placeholder="Nominee Name and Relation"
                                id=""
                                required
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
                        </div>
                      </div>
                    </div>
                    <div className="field btns">
                      <button
                        onClick={(e) => handleNext(e)}
                        className="next-2 next"
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
                        className="next-4 next"
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
                        onClick={(e) => handleNext(e)}
                        className="next-4 next"
                      >
                        capture
                      </button>
                    </div>
                  </div>
                )}
                {step === 7 && (
                  <div className="page">
                    <FileDialog
                      files={addressProof}
                      setFiles={setAddressProof}
                      image={Screen_7}
                      title={"Proof of Address (Front)"}
                      description={"Capture Clear Image of Your Voter ID"}
                    />

                    <div className="field btns">
                      <button
                        onClick={(e) => handleNext(e)}
                        className="next-4 next"
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
                      <table className="table table-light">
                        <tbody>
                          <tr>
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
                                  Display value
                                </label>
                              </div>
                            </td>
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
                                  Display value
                                </label>
                              </div>
                            </td>
                          </tr>
                          <tr>
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
                                  Display value
                                </label>
                              </div>
                            </td>
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
                                  Display value
                                </label>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                              onKeyDown={(e) => handleKeyPress(e)}
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
                              onKeyDown={(e) => handleKeyPress(e)}
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
                        onClick={(e) => handleNext(e)}
                        className="next-4 next"
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
                      <button onClick={(e) => handleNext(e)} className="submit">
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
    </body>
  );
};

export default index;
