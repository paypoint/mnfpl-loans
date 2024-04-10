import { siteConfig } from "@/lib/config";
import { APIEndPoints } from "@/types";
import axios from "axios";

const baseURL = siteConfig.API_LIVE_URL;

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
      "https://preprod.mnfpl.com/getesignrequestpackets",
      {
        requestBody,
      }
    );
  }

  postKFS<TResponse>({ url, requestBody }: Request) {
    return axios.post<TResponse>(
      "https://preprod.mnfpl.com/gettermsconditions",
      {
        requestBody,
      }
    );
  }

  agreeKFS<TResponse>({ url, requestBody }: Request) {
    return axios.post<TResponse>("https://preprod.mnfpl.com/agreekfs", {
      requestBody,
    });
  }

  get<TResponse>({ url }: Request) {
    return client.get<TResponse>(url, {
      data: {},
    });
  }
}

const app = new App();

export default {
  app,
};
