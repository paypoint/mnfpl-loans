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
  post({ url, requestBody }: Request) {
    return client.post(url, {
      requestBody,
    });
  }
}

let app = new App();

export default {
  app,
};
