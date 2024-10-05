import { siteConfig } from "@/lib/config";
import { APIEndPoints } from "@/types";
import axios from "axios";

export const baseURL = siteConfig.API_LIVE_URL;
export const vhostURL = siteConfig.VHOST_LIVE_URL;

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
