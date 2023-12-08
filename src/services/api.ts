import { siteConfig } from "@/lib/config";
import axios from "axios";

const baseURL = siteConfig.API_STAGE_URL;

const client = axios.create({
  baseURL: baseURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

class App {
  getOffers({ RefID }: { RefID: string }) {
    return client.post("/GetOffers", {
      RefID,
    });
  }

  sendOTP({ MobileNumber }: { MobileNumber: string }) {
    return client.post("/SendOTP", {
      MobileNumber,
    });
  }

  verifyOTP({ MobileNumber, OTP }: { MobileNumber: string; OTP: string }) {
    return client.post("/OTPVerify", {
      MobileNumber,
      OTP,
    });
  }

  businessBankDetails({ MerchantID }: { MerchantID: string }) {
    return client.post("/BusinessBankDetails", {
      MerchantID,
    });
  }

  businessAddressDetails({ MerchantID }: { MerchantID: string }) {
    return client.post("/BusinessAddressDetails", {
      MerchantID,
    });
  }

  businessMerchantDetails({ MerchantID }: { MerchantID: string }) {
    return client.post("/BusinessMerchantDetails", {
      MerchantID,
    });
  }
}

let app = new App();

export default {
  app,
};
