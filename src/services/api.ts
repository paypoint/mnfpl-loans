import { siteConfig } from "@/lib/config";
import axios from "axios";

const baseURL = siteConfig.API_STAGE_URL;

const client = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RequestBody = { requestBody: string };

class App {
  getOffers({ requestBody }: RequestBody) {
    return client.post("/GetOffers", {
      requestBody,
    });
  }

  sendOTP({ requestBody }: RequestBody) {
    return client.post("/SendOTP", {
      requestBody,
    });
  }

  verifyOTP({ requestBody }: RequestBody) {
    return client.post("/OTPVerify", {
      requestBody,
    });
  }

  businessBankDetails({ requestBody }: RequestBody) {
    return client.post("/BusinessBankDetails", {
      requestBody,
    });
  }

  businessAddressDetails({ requestBody }: RequestBody) {
    return client.post("/BusinessAddressDetails", {
      requestBody,
    });
  }

  businessMerchantDetails({ requestBody }: RequestBody) {
    return client.post("/BusinessMerchantDetails", {
      requestBody,
    });
  }

  updateBusinessMerchantDetails({ requestBody }: RequestBody) {
    return client.post("/update_businessMerchantDetails", {
      requestBody,
    });
  }

  savekycdocuments({ requestBody }: RequestBody) {
    return client.post("/savekycdocuments", {
      requestBody,
    });
  }
}

let app = new App();

export default {
  app,
};
