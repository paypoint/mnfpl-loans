import { siteConfig } from "@/lib/config";
import { APIEndPoints } from "@/types";
import axios from "axios";

const baseURL = siteConfig.API_STAGE_URL;

const client = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

type Request = { url: APIEndPoints; requestBody: string };

class App {
  post<TResponse>({ url, requestBody }: Request) {
    return client.post<TResponse>(url, {
      requestBody,
    });
  }

  postEsign<TResponse>({ url, requestBody }: Request) {
    return axios.post<TResponse>(
      "http://uat-applyv2.mnfpl.com/getesignrequestpackets",
      {
        requestBody,
      }
    );
  }

  get<TResponse>({ url }: Request) {
    return client.get<TResponse>(url, {
      data: {},
    });
  }
}

let app = new App();

export default {
  app,
};
