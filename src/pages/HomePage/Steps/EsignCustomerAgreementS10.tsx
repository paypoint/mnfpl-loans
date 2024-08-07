import { AxiosError } from "axios";
import { FC, useState } from "react";
import toast from "react-hot-toast";

import EsignSteps from "@/assets/images/Esign_steps.png";

import { useAlert } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import crypto from "@/lib/crypto";
import api from "@/services/api";

import { ESignPacketsAPI, GeolocationData, OfferDetails } from "@/types";

interface EsignCustomerAgreementS10Props {
  handleNext: (event: any) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  position?: GeolocationData;
  verificationToken: string;
  offers?: OfferDetails;
  merchant_id: string;
}

// <EsignCustomerAgreementS10 handleNext={handleNext } isLoading={isLoading} setIsLoading={setIsLoading } position={position} verificationToken={verificationToken} merchant_id={formValues.merchant_id.value}  />
const EsignCustomerAgreementS10: FC<EsignCustomerAgreementS10Props> = ({
  handleNext,
  isLoading,
  setIsLoading,
  position,
  verificationToken,
  offers,
  merchant_id,
}) => {
  const defaultFormValues = {
    esign_terms: {
      value: false,
      error: false,
    },
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [openTermsDrawer, setOpenTermsDrawer] = useState(false);
  const [alreadyRequest, setAlreadyRequest] = useState(false);
  const [showAlert, AlertModal] = useAlert();

  const onInputChange = (
    id: keyof typeof defaultFormValues,
    value: boolean
  ) => {
    let _formValues = { ...formValues };
    _formValues[id].value = value;
    _formValues[id].error = false;
    setFormValues(_formValues);
  };

  const getEsignRequestPackets = async () => {
    if (alreadyRequest) return;
    setAlreadyRequest(true);
    const body = {
      LATLNG: `${position?.latitude}~${position?.longitude}`,
      IPAddress: "",
      MerchantID: merchant_id,
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
          const msg = JSON.parse(data.data);
          const resultMessage = msg;
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
                  if (checked !== "indeterminate")
                    onInputChange("esign_terms", checked);
                }}
              />
              <label htmlFor="esign_terms" className="form-check-label">
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
            disabled={isLoading || !formValues.esign_terms.value}
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
              <DrawerTitle>E-sign Terms And Conditions</DrawerTitle>
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
                <div className="container">
                  <div className="col-sm-12 tca">
                    <p>
                      I hereby authorize Protean eGov Technologies Limited
                      (Protean) to -
                    </p>
                    <ul className="list-decimal pl-3 mt-4 space-y-2 ">
                      <li>
                        {" "}
                        Use my Aadhaar / Virtual ID details (as applicable) for
                        the purpose of e sign of Loan Agreement &nbsp;with
                        Monarch Networth Finserve Private Limited) authenticate
                        my identity through the Aadhaar Authentication system
                        (Aadhaar based e-KYC services of UIDAI) in accordance
                        with the provisions of the Aadhaar (Targeted Delivery of
                        Financial and other Subsidies, Benefits and Services)
                        Act, 2016 and the allied rules and regulations notified
                        thereunder and for no other purpose.
                      </li>
                      <li>
                        Authenticate my Aadhaar/Virtual ID through OTP or
                        Biometric for authenticating my identity through the
                        Aadhaar Authentication system for obtaining my e-KYC
                        through Aadhaar based e-KYC services of UIDAI and use my
                        Photo and Demographic details (Name, Gender, Date of
                        Birth and Address) for the purpose of e sign of Loan
                        Agreement with&nbsp;&nbsp;Monarch Networth Finserve
                        Private Limited&nbsp;
                      </li>
                      <li>
                        I understand that Security and confidentiality of
                        personal identity data provided, for the purpose of
                        Aadhaar based authentication is ensured by Protean and
                        the data will be stored by Protean till such time as
                        mentioned in guidelines from UIDAI from time to time.
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
    </>
  );
};

export default EsignCustomerAgreementS10;
