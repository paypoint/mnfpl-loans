import { format } from "date-fns";
import toast from "react-hot-toast";
import { FC, useState } from "react";
import { AxiosError } from "axios";

import { Checkbox } from "@/components/ui/checkbox";

import { cn, onlyNumberValues } from "@/lib/utils";
import crypto from "@/lib/crypto";
import api from "@/services/api";

import {
  GeolocationData,
  GetBusinessMerchantDetailsAPIResponseType,
  OfferDetails,
} from "@/types";

interface PersonalDetailsS4Props {
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  position: GeolocationData;
  verificationToken: string;
  offers?: OfferDetails;
  merchant_id: string;
}

const PersonalDetailsS4: FC<PersonalDetailsS4Props> = ({
  handleNext,
  isLoading,
  setIsLoading,
  offers,
  merchant_id,
  verificationToken,
}) => {
  const defaultFormValues = {
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
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const onInputChange = (id: keyof typeof defaultFormValues, value: string) => {
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

  const getPersonalDetails = async () => {
    const body = {
      MerchantID: merchant_id,
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
  return (
    <div className="page">
      {/* <div className="main_step_4">
<h4>Personal Details</h4>
<h5 className="detailsAdditional">
Click From The Dropdown to View More Employment Status
</h5>
</div> */}
      <div className="main_step_4" style={{ height: 550, overflow: "auto" }}>
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
                  onChange={(e) => onInputChange("full_name", e.target.value)}
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
                  onChange={(e) => onInputChange("dob", e.target.value)}
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
                <label htmlFor="business_address">Business Address *</label>
                <textarea
                  id="business_address"
                  className="form-control"
                  rows={2}
                  cols={50}
                  name="business_address"
                  placeholder="Address Business"
                  value={formValues.business_address.value}
                  onChange={(e) =>
                    onInputChange("business_address", e.target.value)
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
                <label htmlFor="postal-code">Business Address Pincode *</label>
                <input
                  className="form-control"
                  type="text"
                  onKeyDown={(e) => onlyNumberValues(e)}
                  name="postal-code"
                  placeholder="Please Enter Pincode"
                  id="postal-code"
                  required
                  value={formValues.business_address_pincode.value}
                  maxLength={6}
                  onChange={(e) =>
                    onInputChange("business_address_pincode", e.target.value)
                  }
                />
                {formValues.business_address_pincode.error ? (
                  <span
                    style={{
                      color: "red",
                      fontSize: "14px",
                    }}
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
                <label htmlFor="street-address">Current Address *</label>
                <textarea
                  id="street-address"
                  className="form-control"
                  rows={2}
                  cols={50}
                  name="street-address"
                  placeholder="Current Address"
                  value={formValues.current_address.value}
                  onChange={(e) =>
                    onInputChange("current_address", e.target.value)
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
                    onInputChange("current_pincode", e.target.value)
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
                  onChange={(e) => onInputChange("gender", e.target.value)}
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
                  onChange={(e) => onInputChange("house", e.target.value)}
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
                <label htmlFor="number">Emergency Contact Number *</label>
                <input
                  className="form-control"
                  maxLength={10}
                  type="text"
                  onKeyDown={(e) => onlyNumberValues(e)}
                  name="number"
                  placeholder="Emergency Contact Number"
                  id="number"
                  required
                  value={formValues.emergency_contact_number.value}
                  onChange={(e) =>
                    onInputChange("emergency_contact_number", e.target.value)
                  }
                />
                {formValues.emergency_contact_number.error ? (
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
                <label htmlFor="email">Please Enter Email *</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="Please Enter Email"
                  id="email"
                  required
                  value={formValues.email.value}
                  onChange={(e) => onInputChange("email", e.target.value)}
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
  );
};

export default PersonalDetailsS4;
