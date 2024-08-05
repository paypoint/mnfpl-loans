import { FC, useEffect, useState } from "react";
import { AxiosError } from "axios";

import Second_screen from "@/assets/images/Second_screen.jpg";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { cn, onlyNumberValues } from "@/lib/utils";
import api from "@/services/api";
import crypto from "@/lib/crypto";

import { BankList, GetBankListAPI, OfferDetails } from "@/types";

interface UpdateBankS8Props {
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  merchant_id: string;
  offers?: OfferDetails;
  verificationToken: string;
}

const UpdateBankS8: FC<UpdateBankS8Props> = ({
  handleNext,
  isLoading,
  setIsLoading,
  merchant_id,
  verificationToken,
  offers,
}) => {
  const defaultFormValues = {
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
  };
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [selectedBankID, setSelectedBankID] = useState(0);
  const [bankList, setBankList] = useState<BankList[]>([]);

  const onInputChange = (id: keyof typeof defaultFormValues, value: string) => {
    let _formValues = { ...formValues };
    _formValues[id].value = value;
    _formValues[id].error = false;
    setFormValues(_formValues);
  };

  useEffect(() => {
    getBusinessBankDetails();
  }, []);

  const getBusinessBankDetails = async () => {
    const body = {
      MerchantID: merchant_id,
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

  return (
    <div className="page">
      <div className="main_step_8">
        <h4>Specify bank account for loan disbursement</h4>
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
              onValueChange={(id) => setSelectedBankID(Number(id))}
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
            <h5> No bank details found please add bank account</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="bank_name">Enter Bank name</label>

                  <input
                    className="form-control"
                    type="text"
                    name="bank_name"
                    defaultValue=""
                    placeholder="Bank bank name"
                    id="bank_name"
                    required
                    onChange={(e) => onInputChange("bank_name", e.target.value)}
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
                  <label htmlFor="my-select">Select Your Bank</label>
                  <select
                    id="my-select"
                    className="form-control"
                    name=""
                    onChange={(e) =>
                      onInputChange("bank_account_type", e.target.value)
                    }
                    value={"SA"}
                  >
                    <option value={"SA"}>Savings Account</option>
                    <option value={"CA"}>Current Account</option>
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
                    onChange={(e) => onInputChange("ifsc_code", e.target.value)}
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
                      onInputChange("account_holder_name", e.target.value)
                    }
                  />
                  {formValues.account_holder_name.error ? (
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
                  <label htmlFor="account_number">Account Number</label>
                  <input
                    className="form-control"
                    type="password"
                    name="account_number"
                    onKeyDown={(e) => onlyNumberValues(e)}
                    placeholder="Account Number"
                    id="account_number"
                    required
                    onChange={(e) =>
                      onInputChange("account_number", e.target.value)
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
                      onInputChange("confirm_account_number", e.target.value)
                    }
                  />
                  {formValues.confirm_account_number.error ? (
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
  );
};
export default UpdateBankS8;

function showAlert(arg0: { title: string; description: string }) {
  throw new Error("Function not implemented.");
}
