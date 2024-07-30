import KFSDetailsCard from "@/components/KFSDetailsCard";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { onlyNumberValues, cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { FC, useState } from "react";

import coin from "@/assets/images/coin.png";
import MonarchLogo from "@/assets/images/monarch-logo.png";
import validations from "@/lib/validations";
import api from "@/services/api";
import { GetRegenerateloanoffersResponseType, OfferDetails } from "@/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import crypto from "@/lib/crypto";
import { useAlert } from "@/components/modals/alert-modal";

interface OfferedLoanAmountS1Props {
  offers: OfferDetails | undefined;
  handleNext: () => void;
}

const OfferedLoanAmountS1: FC<OfferedLoanAmountS1Props> = ({
  offers,
  handleNext,
}) => {
  const defaultFormValues = {
    //step-1
    termsCondition1: {
      value: false,
      error: false,
    },
    termsCondition2: {
      value: false,
      error: false,
    },
    edit_loan_amount: {
      value: "",
      error: false,
    },
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, AlertModal] = useAlert();
  const [openDrawer, setOpenDrawer] = useState(false);

  const onInputChange = (
    id: keyof typeof defaultFormValues,
    value: string | boolean
  ) => {
    let _formValues = { ...formValues };
    _formValues[id].value = value;
    _formValues[id].error = false;
    setFormValues(_formValues);
  };

  const onEditAmount = async () => {
    let _formValues = { ...formValues };

    let formObjectHasError = false;
    Object.keys(_formValues).forEach((key) => {
      if (key === "edit_loan_amount") {
        let hasError =
          !validations.isRequired(_formValues[key].value) ||
          Number(_formValues[key].value) > Number(offers?.LoanOffered);
        _formValues[key].error =
          !validations.isRequired(_formValues[key].value) ||
          Number(_formValues[key].value) > Number(offers?.LoanOffered);
        if (hasError) {
          formObjectHasError = true;
        }
      }
    });
    if (!formObjectHasError) {
      setOpen(false);
      regenerateloanoffers();
    } else {
      setFormValues(_formValues);
    }
  };

  const regenerateloanoffers = async () => {
    const body = {
      MerchantID: offers?.Merchant_Id,
      LoanAmount: formValues.edit_loan_amount.value,
      ProductId: offers?.ProductId,
      LoanOffered: offers?.LoanOffered,
    };
    const encryptedBody = crypto.CryptoGraphEncrypt(JSON.stringify(body));
    setIsLoading(true);
    await api.app
      .post<GetRegenerateloanoffersResponseType>({
        url: "/api/regenerateloanoffers",
        requestBody: encryptedBody,
      })
      .then(async (res) => {
        const { data } = res;
        if (data.status === "Success") {
          let offerDetails = {
            ...data.data,
            LoanOffered: offers?.LoanOffered,
            MobileNumber: offers?.MobileNumber,
            ProductId: offers?.ProductId,
            ApplicationID: offers?.ApplicationID,
            ExpiryDate: offers?.ExpiryDate,
          };
          offerDetails.loanAmount = Math.round(Number(offerDetails.loanAmount));
          offerDetails.tenor = Math.round(Number(offerDetails.tenor));

          //@ts-ignore
          setOffers(offerDetails);
          // setKFSDetails(data.data);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error: AxiosError) => {
        showAlert({
          title: error.message,
          description: "Please try after some time",
        });
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      {" "}
      {AlertModal({
        title: "",
        description: "",
      })}
      <div className="page slide-page">
        <div className="main_step_1 form-card overflow-auto max-h-[600px]">
          {offers ? (
            <div className="step_1">
              <div className="coin_img">
                <img src={coin} alt="coin-image" />
              </div>
              <div className="contenttext">
                {/* <label>Your loan amount</label> */}
                <p>
                  Offered loan amount <br />
                  <i className="fa fa-inr" aria-hidden="true" />
                  {" " + offers.loanAmount + " "}{" "}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size={"rounded"} variant={"ghost"} type="button">
                        <i
                          style={{ fontSize: "20px" }}
                          className="fa fa-pen"
                          aria-hidden="true"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit loan amount</DialogTitle>
                        <DialogDescription>
                          <b className="text-black/70">
                            Edited amount should not be greater than ₹
                            {offers.LoanOffered}
                          </b>
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          onEditAmount();
                        }}
                      >
                        <div className="grid gap-2">
                          <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input
                              className="form-control"
                              type="text"
                              name="amount"
                              placeholder="Enter amount"
                              id="amount"
                              value={formValues.edit_loan_amount.value}
                              required
                              maxLength={12}
                              onKeyDown={(e) => onlyNumberValues(e)}
                              onChange={(e) =>
                                onInputChange(
                                  "edit_loan_amount",
                                  e.target.value
                                )
                              }
                            />
                            {formValues.edit_loan_amount.error ? (
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "14px",
                                }}
                              >
                                Amount should not be less than offered amount
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <Button
                          disabled={
                            formValues.edit_loan_amount.error ||
                            formValues.edit_loan_amount.value === ""
                          }
                          className="w-full"
                          type="submit"
                        >
                          Save changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </p>
                <strong>Tenor: {offers.tenor} days</strong>
                <span>
                  Offer Expriy Date:
                  {" " + format(new Date(offers.ExpiryDate), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          ) : (
            <Skeleton className="bg-cover min-h-[480px] relative shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] m-[15px] rounded-[15px]" />
          )}
          {offers ? <KFSDetailsCard offers={offers} /> : ""}
        </div>
        <div className="check_box">
          <div className="check">
            <div className="form-check form-check-inline">
              <Checkbox
                disabled={offers ? false : true}
                checked={formValues.termsCondition1.value}
                id="termsCondition1"
                className="form-check-input"
                name="termsCondition1"
                defaultValue="true"
                required
                onCheckedChange={(checked) => {
                  onInputChange("termsCondition1", checked);
                  if (checked) {
                    setOpenDrawer(true);
                  }
                }}
              />
              <label htmlFor="termsCondition1" className="form-check-label">
                Accept terms and conditions.
              </label>
            </div>
          </div>
        </div>
        <div className="field">
          <button
            disabled={
              !offers || !formValues.termsCondition1.value
              // || !formValues.termsCondition2.value
            }
            onClick={() => handleNext()}
            className={cn(
              "firstNext next disabled:opacity-70 disabled:pointer-events-none",
              !offers && "animate-pulse"
            )}
          >
            Next
          </button>

          {/* First Drawer  */}
          <Drawer
            onOpenChange={(open) => {
              setOpenDrawer(open);
            }}
            open={openDrawer}
            shouldScaleBackground
          >
            <DrawerContent>
              <div className="mx-auto h-[85vh] overflow-auto w-full">
                <DrawerHeader>
                  <DrawerTitle>Terms And Conditions</DrawerTitle>
                  {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                </DrawerHeader>
                <div className="modal-body p-0">
                  <div
                    className="col-sm-12"
                    id="staticBackdropAadharWrap"
                    style={{
                      padding: "10px 50px",
                      height: 590,
                      minHeight: 200,
                      overflowY: "scroll",
                      textAlign: "justify",
                    }}
                  >
                    {" "}
                    <div>
                      <div className="container">
                        <div style={{ textAlign: "right" }}>
                          <img src={MonarchLogo} alt="Monarch" />
                        </div>
                        <div>
                          <h3 style={{ textAlign: "center" }}>
                            <strong>
                              <u>Monarch Networth Finserve Pvt Ltd</u>
                            </strong>
                          </h3>
                          <h3 style={{ textAlign: "center" }}>
                            <strong>
                              <u>General Terms &amp; Conditions</u>
                            </strong>
                          </h3>
                          <p>
                            This Agreement sets forth the terms and conditions
                            that apply to the access and use of the Monarch
                            Networth Finserve Pvt Ltd’s Website, Mobile
                            Application (collectively be referred to as
                            "Website") which is managed and operated by Monarch
                            Networth Finserve Pvt Ltd&nbsp;(hereinafter
                            collectively be referred to as "Company"/ "Monarch
                            Networth Finserve Pvt Ltd"), incorporated under the
                            laws of India and registered under the Companies
                            Act, 1956.
                          </p>
                          <p>
                            This document/agreement (referred to as “Agreement”)
                            is an electronic record in terms of Information
                            Technology Act, 2000 and generated by a computer
                            system and does not require any physical or digital
                            signatures. This document is published in accordance
                            with the provisions of Rule 3 of the Information
                            Technology (Intermediaries guidelines) 2011, that
                            provides for the due diligence to be exercised for
                            the access or usage of this Website.
                          </p>
                          <p>
                            PLEASE READ THE FOLLOWING TERMS AND CONDITIONS
                            CAREFULLY. YOUR ACCEPTANCE OF TERMS CONTAINED HEREIN
                            CONSTITUTES THE AGREEMENT BETWEEN YOU AND THE
                            COMPANY FOR THE PURPOSE AS DEFINED HEREUNDER.
                          </p>
                          <h4>
                            <strong>Customer Due Diligence</strong>
                          </h4>
                          <p>
                            Company may undertake client/customer due diligence
                            measures and seek mandatory information required for
                            KYC purpose which as a customer you are obliged to
                            give while facilitating your request of loan/credit
                            card/mutual fund and other financial product
                            requirements with the banks/financial institutions,
                            in accordance with applicable Prevention of Money
                            Laundering Act (“PMLA”) and rules.
                          </p>
                          <p>
                            You agree and authorize the Company to share your
                            data with Statutory bodies /rating agencies/ credit
                            bureaus /banks/financial institutions,
                            governmental/regulatory authorities.
                          </p>
                          <h4>
                            <strong>Fees, Charges and taxes</strong>
                          </h4>
                          <p>
                            Company may charge up to 3% facilitation
                            fee/processing fee/platform/convenience fee to
                            provide services requested by you. Details of the
                            same shall be available during the completion of the
                            customer journey on the website.
                          </p>
                          <p>
                            You shall bear all applicable taxes if the Fees are
                            subject to any type of goods and sales tax, income
                            tax, duty or other governmental tax or levy.
                          </p>
                          <h4>
                            <strong>Eligibility</strong>
                          </h4>
                          <p>
                            You confirm that you are a resident of India, above
                            18 (Eighteen) years of age, and have the capacity to
                            contract as specified under the Indian Contract Act,
                            1872, while availing the Services offered by the
                            Company.
                          </p>
                          <h4>
                            <strong>KEY FACT STATEMENT</strong>
                          </h4>
                          <h4>
                            <strong>Annual Percentage Rate</strong>
                          </h4>
                          <p>
                            The Services offered by the Company shall attract
                            the Annual Percentage Rate (APR) which includes but
                            not limited to
                            Processing/Facilitation/Platform/Convenience Fee,
                            Group Insurance Premium, applicable taxes subject to
                            any types of Goods &amp; Sales Tax, Income Tax,
                            Duty, or other Governmental Tax.
                          </p>
                          <p>
                            You agree and consent the acceptance of the APR
                            displayed to you while completing the journey on the
                            Website for the Application of Services.
                          </p>
                          <h4>
                            <strong>Recovery Mechanism</strong>
                          </h4>
                          <p>
                            Customer agrees and consents the acceptance of the
                            following terms &amp; conditions of the recovery
                            &amp; repayment.
                          </p>
                          <ol>
                            <li>
                              Term/Frequency of the repayment of Equal
                              installments which has been displayed during the
                              journey on the Website for Application of Services
                            </li>
                            <li>
                              Receive the notifications in relation to the
                              repayment schedule via various modes of
                              communication.
                            </li>
                            <li>
                              Reporting of credit records of the Customer to the
                              Credit Information Companies (CIC)
                            </li>
                            <li>
                              Share information with the third-party websites,
                              applications, partners or associates to facilitate
                              the various modes of payments.
                            </li>
                            <li>
                              Late Payment Fee of Rs. 10 per day may be levied
                              in case of delay of repayment from the due date
                              according to defined repayment schedule.
                            </li>
                            <li>
                              Cash Handling Fee of Rs.250 and Rs.25 per visit
                              may be levied in case if repayments collected from
                              Home or Shop location and via the modes of cash at
                              Centres respectively.
                            </li>
                          </ol>
                          <p>
                            Company does not intend to involve or get into the
                            association with the third-party websites,
                            applications, partners, or associates for the
                            purpose of the recovery, however Customer shall be
                            notified in advance in case of future involvement.
                          </p>
                          <p>
                            Dedicated Customer Support Desk for Queries,
                            Request, and Complaints is operational for Customers
                            through below mentioned modes.
                          </p>
                          <ol>
                            <li>Email at support@mnclgroup.com</li>
                            <li>
                              “Write to us” at Monarch Networth Finserve Pvt Ltd
                              Website - &nbsp;
                              <a
                                href="https://www.mnclgroup.com/"
                                target="_blank"
                              >
                                <u>www.mnclgroup.com</u>
                              </a>
                            </li>
                            <li>Customer Support Helpline - +91 9033839897</li>
                          </ol>
                          <p>
                            Customer may reach out to Grievance Officer in case
                            not satisfied with the resolution offered by the
                            dedicated Customer Support Desk through below
                            mentioned means.
                          </p>
                          <ol>
                            <li>Email at anshit.acharya@mnclgroup.com</li>
                            <li>
                              “Escalate you query” at Monarch Networth Finserve
                              Pvt Ltd Website -{" "}
                              <a
                                href="https://www.mnclgroup.com/"
                                target="_blank"
                              >
                                <u>www.mnclgroup.com</u>
                              </a>
                            </li>
                            <li>Grievance Support Helpline - +91 9033839897</li>
                          </ol>
                          <p>
                            Assistance from the Customer Support and the
                            Grievance Officer shall be subject to Customer
                            Grievance Redressal Policy of the Company, more
                            details of the same is available on the Website{" "}
                            <a
                              href="https://www.mnclgroup.com/"
                              target="_blank"
                            >
                              <u>www.mnclgroup.com</u>
                            </a>
                          </p>
                          <h4>
                            <strong>Look Up Period</strong>
                          </h4>
                          <p>
                            Customer had been facilitated with the Look Up
                            period of Three (3) Days during which Customer can
                            revoke the Services availed.
                          </p>
                          <p>
                            Customer shall be required to repay the Principal
                            &amp; Proportionate Interest (from the date of
                            disbursement till the date of the repayment)
                            according to the Annual Percentage Rate (APR).
                          </p>
                          <p>
                            Customer may reach out dedicated Customer Support
                            Desk of the Company for requesting to revoke the
                            Services , response to which shall be provided
                            according to the to Customer Grievance Redressal
                            Policy of the Company, more details of the same
                            shall be available on the Website{" "}
                            <a
                              href="https://www.mnclgroup.com/"
                              target="_blank"
                            >
                              <u>www.mnclgroup.com</u>
                            </a>
                          </p>
                          <h4>
                            <strong>Group Insurance Policy</strong>
                          </h4>
                          <p>
                            The company may further offer you group insurance
                            coverage from Insurance partners for which Monarch
                            Networth Finserve Pvt Ltd&nbsp;. shall be the Master
                            Policy Holder ("MPH") provided you are a customer of
                            the Company. Such insurance coverage shall be
                            governed by terms &amp; conditions of Insurer and as
                            per the guidelines issued by the Insurance
                            Regulatory and Development Authority of India
                            ("IRDAI").
                          </p>
                          <h4>
                            <strong>Indemnity</strong>
                          </h4>
                          <p>
                            You indemnify and hold Company (and its affiliates,
                            officers, directors, agents and employees) harmless
                            from any and against any claims, causes of action,
                            demands, recoveries, losses, damages, fines,
                            penalties or other costs or expenses of any kind or
                            nature, including reasonable attorneys' fees, or
                            arising out of or related to your breach of Terms
                            &amp; Conditions, your violation of any law or the
                            rights of a third party, or your use of the Website.
                          </p>
                          <h4>
                            <strong>License and Access</strong>
                          </h4>
                          <p>
                            You acknowledge and agree that the Company owns all
                            legal right, title and interest in and to the
                            Services, including any intellectual property rights
                            which subsist in the Services (whether those rights
                            are registered or not). You further acknowledge that
                            the Services may contain information which is
                            designated confidential by Company and that you
                            shall not disclose such information without
                            Company`s prior written consent.
                          </p>
                          <p>
                            By sharing or submitting any content including any
                            data and information on the Website, you agree that
                            you shall be solely responsible for all content you
                            post on the Website and Company shall not be
                            responsible for any content you make available on or
                            through the Website. At Company`s sole discretion,
                            such content may be included in the Service and
                            ancillary services (in whole or in part or in a
                            modified form). With respect to such content, you
                            submit or make available on the Website, you grant
                            Company a perpetual, irrevocable, non-terminable,
                            worldwide, royalty-free and non-exclusive license to
                            use, copy, distribute, publicly display, modify,
                            create derivative works, and sublicense such
                            materials or any part of such content. You agree
                            that you are fully responsible for the content you
                            submit. You are prohibited from posting or
                            transmitting to or from this Website: (i) any
                            unlawful, threatening, libelous, defamatory,
                            obscene, pornographic, or other material or content
                            that would violate rights of publicity and/or
                            privacy or that would violate any law; (ii) any
                            commercial material or content (including, but not
                            limited to, solicitation of funds, advertising, or
                            marketing of any good or services); and (iii) any
                            material or content that infringes, misappropriates
                            or violates any copyright, trademark, patent right
                            or other proprietary right of any third party.
                            Youshall be solely liable for any damages resulting
                            from any violation of the foregoing restrictions, or
                            any other harm resulting from your posting of
                            content to this Website.
                          </p>
                          <h4>
                            <strong>Limitation of Liability</strong>
                          </h4>
                          <p>
                            You expressly understand and agree that the Company
                            (including its subsidiaries, affiliates, directors,
                            officers, employees, representatives and providers)
                            shall not be liable for any direct, indirect,
                            incidental, special, consequential or exemplary
                            damages, including but not limited to damages for
                            loss of profits, opportunity, goodwill, use, data or
                            other intangible losses, even if Company has been
                            advised of the possibility of such damages,
                            resulting from (i) any failure or delay (including
                            without limitation the use of or inability to use
                            any component of the Website), or (ii) any use of
                            the Website or content, or (iii) the performance or
                            non-performance by us or any provider, even if we
                            have been advised of the possibility of damages to
                            such parties or any other party, or (b) any damages
                            to or viruses that may infect your computer
                            equipment or other property as the result of your
                            access to the Website or your downloading of any
                            content from the Website.
                          </p>
                          <p>
                            Notwithstanding the above, if the Company is found
                            liable for any proven and actual loss or damage
                            which arises out of or in any way connected with any
                            of the occurrences described above, then you agree
                            that the liability of Company shall be restricted
                            to, in the aggregate, any Facilitation/
                            Processing/Convenience/Platform fees paid by you to
                            the Company in connection with such transaction(s)/
                            Services on this Website, if applicable.
                          </p>
                          <h4>
                            <strong>Privacy Policy</strong>
                          </h4>
                          <p>
                            By using the Website, you hereby consent to the use
                            of your information as we have outlined in our
                            Privacy Policy. This Privacy Policy explains how
                            Company treats your personal information when you
                            access the Website and use other ancillary Services.
                            You can access the Privacy policy by visiting the
                            company’s official website.
                          </p>
                          <h4>
                            <strong>Third-Party Links</strong>
                          </h4>
                          <p>
                            The company’s Platform may refer to or may contain,
                            links to third-party websites, applications,
                            services and resources but it does not mean we are
                            endorsing such channels. We provide these links only
                            as a convenience to You to avail certain services,
                            the Company makes no representation or warranty of
                            any kind regarding the accuracy, reliability,
                            effectiveness, or correctness of any aspect of any
                            third-party services, and consequently, the Company
                            is not responsible for the content, products or
                            services that are available from third-party
                            services. You are responsible for reading and
                            understanding the terms and conditions and privacy
                            policy that applies to the use of any third-party
                            services, and You acknowledge sole responsibility
                            and assume all risk arising from use of any
                            third-party services.
                          </p>
                          <h4>
                            <strong>Consent</strong>
                          </h4>
                          <p>
                            The consent for the collection of Data and also for
                            the subsequent use of the Data is deemed to be given
                            by You when You decide to avail yourself of the
                            Services.
                          </p>
                          <p>
                            You are authorizing Company to share/disclose,
                            any/all information, documents including KYC and any
                            other document which has been provided on Company’s
                            platform with third party for KYC verification,
                            including its subsidiaries, affiliates or partners
                            for related purposes that Company may deem fit to
                            offer services.
                          </p>
                          <p>
                            You consent that you yourself or with the assistance
                            from the Company, at your own discretion had
                            initiated the journey on the Website for availing
                            the Services.
                          </p>
                          <p>
                            You consent that information furnished while
                            completing the journey on the Website for the
                            Application of Services are true &amp; accurate and
                            no material information has been withheld or
                            suppressed. In case any information is found to be
                            false or untrue or misleading or misrepresenting,
                            the Customer might be held liable for it.
                          </p>
                          <p>
                            Company may enter into the agreement with the third
                            party for facilitation of the Services (hereinafter
                            may be referred to as “Partner”), Customer hereby
                            agrees to avail the Services without any objection
                            to the involvement of the Partner(s). Customer
                            agrees that information disclosed by the Customer
                            including KYC may also be rendered and stored with
                            the Partner(s) for facilitation of the Services.
                          </p>
                          <p>
                            You understand that that Company and the Partner(s)
                            are entitled to reject the application submitted for
                            the Services at their sole discretion, further
                            disbursement and transactions will be governed by
                            the rules of the Company which may be in force from
                            time to time.
                          </p>
                          <p>
                            You agree that Loan shall be disbursed in the Bank
                            Account registered by you while submitting the
                            application for this loan on the Website.
                          </p>
                          <p>
                            You agree to enroll &amp; sign for National
                            Automated Clearing House (NACH) Mandate as
                            prescribed and implemented by the National Payments
                            Corporate of India (NPCI) during the journey for the
                            Application of Services, authorizing the Company to
                            deduct the Equated installment from the Bank Account
                            registered by you during the journey for the
                            Application of Services.
                          </p>
                          <p>
                            You agree that Services shall be used for the stated
                            purpose and will not be used for any speculative,
                            antisocial, or illegal purpose.
                          </p>
                          <p>
                            You consent that the Document, KYC &amp; Information
                            submitted for the application of the Services shall
                            not be returned, under any circumstances.
                            <strong>&nbsp;Communication Policy</strong>
                          </p>
                          <p>
                            As part of use of the Services, you may receive
                            notifications, reminder, offers, discounts and
                            general information from Company and the Partner(s)
                            via text messages, WhatsApp messages, Calls, or by
                            emails, for the purpose of facilitating the Services
                            offered by the Company or the Partner, or for the
                            information or reminders for the repayments or for
                            collecting feedback regarding services. The User
                            acknowledges that the SMS service provided by
                            Company is an additional facility provided for the
                            User’s convenience and that it may be susceptible to
                            error, omission and/ or inaccuracy. You agree and
                            accept that this consent overwrites the restrictions
                            applicable according to registration with DNC or
                            NDNC Registry laid down by the telecom service
                            providers or Telecom Regulatory Authority of India
                            (TRAI).
                          </p>
                          <p>
                            You agree and authorize Company to share your
                            information with its group companies and other third
                            parties, in so far as required for joint marketing
                            purposes/offering various services/report
                            generations and/or to similar services to provide
                            you with various value-added services, in
                            association with the Services selected by you or
                            otherwise.
                          </p>
                          <h4>
                            <strong>Bureau Consent</strong>
                          </h4>
                          <p>
                            You agree and authorise company to pull your cibil
                            bureau status and detailed report.
                          </p>
                          <h4>
                            <strong>GOVERNING LAW</strong>
                          </h4>
                          <p>
                            This Terms of Use shall be governed by and construed
                            in accordance with the laws of India, without regard
                            to its conflict of law provisions and the exclusive
                            jurisdiction of competent courts in Mumbai, India.
                          </p>
                          <h4>
                            <strong>FORCE MAJEURE</strong>
                          </h4>
                          <p>
                            The company shall not be liable for failure to
                            perform its obligations under these Terms of Use to
                            the extent such failure is due to causes beyond its
                            reasonable control. In the event of a force majeure,
                            the Company if unable to perform shall notify the
                            User in writing of the events creating the force
                            majeure. For the purposes of these Terms of Use,
                            force majeure events shall include, but not be
                            limited to, acts of God, failures or disruptions,
                            orders or restrictions, war or warlike conditions,
                            hostilities, sanctions, mobilizations, blockades,
                            embargoes, detentions, revolutions, riots, looting,
                            strikes, stoppages of labor, lockouts or other labor
                            troubles, earthquakes, fires or accidents and
                            epidemics.
                          </p>
                          <h4>
                            <strong>Customer Grievance Redressal</strong>
                          </h4>
                          <p>
                            You may contact us with any enquiry, complaints or
                            concerns by reaching to our customer care at:
                          </p>
                          <ul>
                            <li>Customer care number: +91 9033839897</li>
                            <li>Customer Care Email- cs@mnclgroup.com</li>
                          </ul>
                          <p>&nbsp;</p>
                          <h4>
                            <strong>ACCEPTANCE</strong>
                          </h4>
                          <ol>
                            <li>
                              I declare that I from my own judgment and wisdom
                              had agreed to the Terms and Conditions of the
                              Services detailed herein this document, in no
                              matter the Company or the Partner has influenced
                              you for availing the Services or agree to the
                              Terms and Conditions detailed herein this
                              document.
                            </li>
                            <li>
                              I declare that I have duly read the document and
                              fully understand the Terms and Conditions detailed
                              herein.
                            </li>
                            <li>
                              I understand by completing the journey for the
                              Application for the Loan/Credit/Financial Services
                              on the Website, I am signing this document
                              electronically.
                            </li>
                          </ol>
                        </div>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <div>
                          <strong>Registered office - </strong>
                          Office no.901/902, 9th Floor, Atlanta Centre,
                          Opp.Udyog Bhavan, Sonawala Lane, Goregaon (East),
                          Mumbai City, &nbsp;Maharashtra, India, 400063
                          <br /> <strong>Website</strong>
                          &nbsp;–{" "}
                          <a href="https://www.mnclgroup.com/" target="_blank">
                            <u>www.mnclgroup.com</u>
                          </a>
                          <br /> <strong>Telephone-</strong> +91 -22-6202 1600
                          <br /> <strong>Email </strong>
                          <a href="mailto:Id-cs@mnclgroup.com">
                            <strong>
                              <u>Id-cs@mnclgroup.com</u>
                            </strong>
                          </a>
                          <br /> <strong>CIN-</strong> U65900MH1996PTC100919
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end rounded-br-[calc(0.3rem_-_1px)] rounded-bl-[calc(0.3rem_-_1px)] p-3 border-t-[#dee2e6] border-t border-solid mx-auto">
                  <div className="container space-x-2 flex ">
                    <Button
                      onClick={() => {
                        onInputChange("termsCondition1", true);
                        setOpenDrawer(false);
                      }}
                      type="button"
                    >
                      Agree
                    </Button>
                    <Button
                      onClick={() => {
                        onInputChange("termsCondition1", false);
                        setOpenDrawer(false);
                      }}
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
        </div>
      </div>
    </>
  );
};

export default OfferedLoanAmountS1;
