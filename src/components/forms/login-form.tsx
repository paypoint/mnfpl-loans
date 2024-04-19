import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { authSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { onlyNumberValues } from "@/lib/utils";
import api from "@/services/api";
import { LoginOTPVerifyAPIResponeType } from "@/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAlert } from "@/components/modals/alert-modal";
import crypto from "@/lib/crypto";
import { useNavigate } from "react-router-dom";

type Inputs = z.infer<typeof authSchema>;

export function LogInForm() {
  const [isPending, startTransition] = React.useTransition();
  const [showAlert, AlertModal] = useAlert();
  const navigate = useNavigate();

  // react-hook-form
  const { formState, ...form } = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      phoneNumber: "",
      otp: "",
    },
  });

  function onSubmit(data: Inputs) {
    //@ts-ignore
    startTransition(async () => {
      await loginOTPVerify();
    });
  }
  const phoneNumberValue = form.watch("phoneNumber");

  React.useEffect(() => {
    if (phoneNumberValue.length === 10) {
      loginSendOTP();
    }
  }, [phoneNumberValue]);

  const loginSendOTP = async () => {
    const body = {
      MobileNumber: phoneNumberValue,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    debugger;
    await api.app
      .post<LoginOTPVerifyAPIResponeType>({
        url: "/api/loginSendOTP",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const loginOTPVerify = async () => {
    const body = {
      MobileNumber: phoneNumberValue,
      OTP: form.getValues("otp"),
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));

    debugger;
    await api.app
      .post<LoginOTPVerifyAPIResponeType>({
        url: "/api/loginOTPVerify",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        navigate("/dashboard", { replace: true });
        // navigate.push("/dashboard")
        // if (data.status === "Success") {
        //   toast.success(data.message);
        // } else {
        //   toast.error(data.message);
        // }
      })
      .catch((error: AxiosError) => {
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      });
  };

  const { isValid } = formState;
  return (
    <>
      {AlertModal({
        title: "",
        description: "",
      })}
      <Form formState={formState} {...form}>
        <form
          className="grid gap-4"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    maxLength={10}
                    onKeyDown={(e) => onlyNumberValues(e)}
                    type="text"
                    placeholder="Please enter phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={phoneNumberValue.length < 10}
                    onKeyDown={(e) => onlyNumberValues(e)}
                    maxLength={6}
                    placeholder="******"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending || !isValid}>
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Log in
            <span className="sr-only">Log in</span>
          </Button>
        </form>
      </Form>
    </>
  );
}
