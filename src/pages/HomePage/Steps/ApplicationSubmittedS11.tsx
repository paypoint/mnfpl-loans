import { FC } from "react";
import { Landmark, CircleCheckBig } from "lucide-react";

import { Icons } from "@/components/ui/Icons";

import { baseURL } from "@/services/api";

import { BankList, OfferDetails } from "@/types";

interface ApplicationSubmittedS11Props {
  offers?: OfferDetails;
  eSignUrl?: string;
  bankList?: BankList[];
  selectedBankID: number;
}

const ApplicationSubmittedS11: FC<ApplicationSubmittedS11Props> = ({
  offers,
  eSignUrl,
  bankList,
  selectedBankID,
}) => {
  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex space-x-2 items-center">
          <Icons.AlertCircleIcon className="text-[#5322ba] h-6 w-6" />
          <h2 className="text-xl font-semibold">Application Submitted</h2>
        </div>
      </div>
      <div className="mt-6 p-6 bg-gray-100 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium">Loan amount</h3>
          <p className="text-4xl font-bold mt-2">₹ {offers?.loanAmount}</p>
        </div>
        <hr className="my-6 border-[#5322ba]" />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-medium">EDMI</p>
            <p className="font-bold">₹ {Math.round(offers?.emi!)}</p>
          </div>
          <div>
            <p className="font-medium">Tenure</p>
            <p className="font-bold">{offers?.tenor} days</p>
          </div>
          <div>
            <p className="font-medium">Interest</p>
            <p className="font-bold">{offers?.interest}% p.m</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex space-x-2 items-center">
          <Icons.InfoIcon className="text-[#5322ba] h-6 w-6" />
          <p className="text-sm">
            Your Loan application has been acknowledged. The amount will be
            disbursed within 24 working hours subject to final approval.
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
              Loan disbured will be credited to below bank account
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
                    {bankList?.[selectedBankID].AccountType === "SB"
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
                    {bankList?.[selectedBankID].AccountNumber}
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
  );
};

export default ApplicationSubmittedS11;
