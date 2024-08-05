import { FC, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import KFSDetailsCard from "@/components/KFSDetailsCard";
import { useAlert } from "@/components/modals/alert-modal";

import api from "@/services/api";
import crypto from "@/lib/crypto";

import { EsignResponseType, OfferDetails } from "@/types";

interface KFSHTMLS9Props {
  offers?: OfferDetails;
  isLoading?: boolean;
  handleNext: (e: any) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  merchant_id: string;
  verificationToken: string;
}

const KFSHTMLS9: FC<KFSHTMLS9Props> = ({
  offers,
  isLoading,
  handleNext,
  setIsLoading,
  merchant_id,
  verificationToken,
}) => {
  const [KFSHTML, setKFSHTML] = useState<string>();
  const [showAlert, AlertModal] = useAlert();

  useEffect(() => {
    getKFSHTML();
  }, []);
  const getKFSHTML = async () => {
    const body = {
      ApplicationID: offers?.ApplicationID,
      MerchantID: merchant_id,
      MobileNo: offers?.MobileNumber,
      Token: verificationToken,
    };

    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<EsignResponseType>({
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
  return (
    <div className="page overflow-auto max-h-[600px]">
      {offers ? <KFSDetailsCard offers={offers} /> : ""}

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
          Agree
        </button>
      </div>
    </div>
  );
};

export default KFSHTMLS9;
