import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
// import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function DrawerDemo() {
  const [goal, setGoal] = React.useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-[90vh] overflow-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Terms And Conditions</DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          <div className="p-4 pb-0 ">
            Please read the following Terms and Conditions of service that you
            agree to, when you access www.paypointz.com ("website"), a service
            offered by Pay Point India Network Private Limited or through the
            assistance of an agent of Pay Point India Network Private Limited.
            The Terms and Conditions (as may be amended from time to time, the
            "Agreement") is a legal contract between you being, an individual
            customer, user, or beneficiary of this service of at least 18 years
            of age, and Pay Point India Network Private Limited (Pay Point
            India) having its registered office at 'A' Wing 203, Supreme
            Business Park, Hiranandani Garden, Powai, Mumbai 400076, Maharashtra
            - India feedback@paypointindia.com | +91 22 4050 8888 / 4068 8088.
            All services are rendered by Pay Point India through its platform
            under the brand name 'PaypointZ' & 'Tatkal Rupya'. Hence all the
            rights, benefits, liabilities & obligations under the following
            terms & conditions shall accrue to the benefit of Pay Point India.
            (together with its subsidiaries and other affiliates, "us", "We",
            "Tatkal Rupya", or "PaypointZ"), regarding your use of our Services
            regarding Semi Closed Wallet of online PaypointZ or such other
            services which may be added from time to time (all such services are
            individually or collectively are referred as Service or Services as
            they case may be). Service can be used by you subject to your
            adherence with the terms and conditions set forth below including
            relevant policies. PaypointZ reserves the right, at its sole
            discretion, to revise, portions of these terms and conditions any
            time without further notice. You shall re-visit the "Terms &
            Conditions" link from time to time to stay abreast of any changes
            that the "Site" may introduce. Quality of Services Pay Point India
            agrees to provide you products at the press of a button. Pay Point
            India is committed to investigate the cause of non-performance with
            all parties involved. However, no refunds will be made to your
            PaypointZ balance unless it is clearly established that Pay Point
            India was responsible. Link to other websites Pay Point India may
            provide links to other websites that are maintained by third
            parties. Pay Point India is not responsible and/or liable for any
            information available on these third party websites. Links to third
            party sites are provided by web site as a convenience to user(s) and
            Pay Point India has not have any control over such sites i.e.
            content and resources provided by them. Pay Point India may allow
            user(s) access to content, products or services offered by third
            parties through hyper links (in the form of word link, banners,
            channels or otherwise) to such Third Party’s web site. You are
            cautioned to read such sites’ terms and conditions and/or privacy
            policies before using such sites in order to be aware of the terms
            and conditions of your use of such sites. Pay Point India believes
            that user(s) acknowledge that it has no control over such third
            party’s site, does not monitor such sites, and Pay Point India shall
            not be responsible or liable to anyone for such third party site, or
            any content, products or services made available on such a site.
            Limited Warranty Pay Point India concedes to provide efficient,
            reliable, timely and satisfactory service to the best of its
            resources and skills. Pay Point India makes no warranty that the
            website will be uninterrupted, error free, and virus free or free
            from any malicious content. The Website is provided on an "as is
            where is" and "as available" basis. In any case of unsatisfactory
            service by Pay Point India, it agrees to take proper corrective
            action on the basis of decision taken by Pay Point India. Limitation
            of Liability and Damages In no event will Pay Point India or its
            contractors, agents, licensors, partners, officers, directors,
            suppliers be liable to you for any special, indirect, incidental,
            consequential, punitive, reliance, or exemplary damages (including
            without limitation lost business opportunities, lost revenues, or
            loss of anticipated profits or any other pecuniary or non-pecuniary
            loss or damage of any nature whatsoever) arising out of or relating
            to (i) this agreement, (ii) the services, the site or any reference
            site, or (iii) your use or inability to use the services, the site
            (including any and all materials) or any reference sites, even if
            Pay Point India or a it’s authorized representative has been advised
            of the possibility of such damages. In no event will Pay Point India
            or any of its contractors, directors, employees, agents, third party
            partners, licensors or suppliers’ total liability to you for all
            damages, liabilities, losses, and causes of action arising out of or
            relating to (i) this Agreement, (ii) the Services, (iii) your use or
            inability to use the Services or the Site (including any and all
            Materials) or any Reference Sites, or. You acknowledge and agree
            that Pay Point India has offered its products and services, set its
            prices, and entered into this agreement in reliance upon the
            warranty disclaimers and the limitations of liability set forth
            herein, that the warranty disclaimers and the limitations of
            liability set forth herein reflect a reasonable and fair allocation
            of risk between you and Pay Point India, and that the warranty
            disclaimers and the limitations of liability set forth herein form
            an essential basis of the bargain between you and Pay Point India.
            It would not be able to provide the services to you on an
            economically reasonable basis without these limitations. Applicable
            law may not allow the limitation or exclusion of liability or
            incidental or consequential damages, so the above limitations or
            exclusions may not apply to you. In such cases, Pay Point India’s
            liability will be limited to the fullest extent permitted by
            applicable law. This paragraph shall survive termination of this
            Agreement. Indemnification You agree to indemnify, save, and hold
            Pay Point India, its affiliates, contractors, employees, officers,
            directors, agents and its third party suppliers, licensors, and
            partners harmless from any and all claims, losses, damages, and
            liabilities, costs and expenses, including without limitation legal
            fees and expenses, arising out of or related to your use or misuse
            of the Services or of the Site, any violation by you of this
            Agreement, or any breach of the representations, warranties, and
            covenants made by you herein. Pay Point India reserves the right, at
            your expense, to assume the exclusive defense and control of any
            matter for which you are required to indemnify Pay Point India,
            including rights to settle, and you agree to cooperate with Pay
            Point India’s defense and settlement of these claims. Pay Point
            India will use reasonable efforts to notify you of any claim,
            action, or proceeding brought by a third party that is subject to
            the foregoing indemnification upon becoming aware of it. This
            paragraph shall survive termination of this Agreement. Ownership;
            Proprietary Rights The Services and the Site are owned and operated
            by Pay Point India and/or third party licensors. The visual
            interfaces, graphics, design, compilation, information, computer
            code (including source code and object code), products, software,
            services, and all other elements of the Services and the Site
            provided by Pay Point India (the “Materials”) are protected by
            Indian copyright, trade dress, patent, and trademark laws,
            international conventions, and all other relevant intellectual
            property and proprietary rights, and applicable laws. As between you
            and Pay Point India, all Materials, trademarks, service marks, and
            trade names contained on the Site are the property of Pay Point
            India and/or third party licensors or suppliers. You agree not to
            remove, obscure, or alter Pay Point India or any third party’s
            copyright, patent, trademark, or other proprietary rights notices
            affixed to or contained within or accessed in conjunction with or
            through the Services. Except as expressly authorized by Pay Point
            India, you agree not to sell, license, distribute, copy, modify,
            publicly perform or display, transmit, publish, edit, adapt, create
            derivative works from, or otherwise make unauthorized use of the
            Materials. Pay Point India reserves all rights not expressly granted
            in this Agreement. If you have comments regarding the Services and
            the Site or ideas on how to improve it, please contact customer
            service. Please note that by doing so, you hereby irrevocably assign
            to Pay Point India, and shall assign to it, all right, title and
            interest in and to all ideas and suggestions and any and all
            worldwide intellectual property rights associated therewith. You
            agree to perform such acts and execute such documents as may be
            reasonably necessary to perfect the foregoing rights. Severability
            The Services and the Site are owned and operated by Pay Point India
            and/or third party If any provision of this Agreement is held to be
            unlawful, void, invalid or otherwise unenforceable, then that
            provision will be limited or eliminated from this Agreement to the
            minimum extent required, and the remaining provisions will remain
            valid and enforceable. Terms and conditions of usage of Prepaid
            Cards: This prepaid payment instrument (Prepaid Card) is governed by
            the Payment and Settlement Systems Act, 2007 & Regulations made
            thereunder, Issuance and Operation of Pre-paid Payment Instruments
            in India (Reserve Bank) Directions, 2009 (“RBI Guidelines”) and is
            also subject to directions / instructions issued by the Reserve Bank
            of India (RBI) from time to time in respect of redemption,
            repayment, usage etc. and Pay Point India Network Private Ltd. (Pay
            Point India) does not hold any responsibility to the cardholder in
            such circumstances. This Prepaid Card should be utilized by
            individuals above 18 years of age. You agree to provide information
            that is true, accurate and complete. You also agree to provide
            correct and accurate credit/ debit card details to the approved
            payment gateway for availing Services on the Website and associated
            Applications. You shall not use a credit/ debit card unlawfully. You
            will be solely responsible for the security and confidentiality of
            your credit/ debit card details. Pay Point India expressly disclaims
            all liabilities that may arise as a consequence of any unauthorized
            use of credit/ debit card. Any suspicious activity may lead to
            blockage of the account. The maximum value of a Prepaid Card is Rs.
            10,000 and Rs. 1,00,000 in case all additional services are enabled
            on it after submitting requisite KYC documents. Pay Point India may
            use the KYC submitted by you for business purposes. You hereby
            consent to (i) receiving e-newsletters as well as other
            communications containing offers etc. and (ii) Pay Point India
            providing your information to sponsor/s and/or companies associated
            with it for the purpose of providing you with offers and/or
            information. You hereby agree to use this Prepaid Card for all
            transactions with prescribed merchants for the products/services as
            mentioned by the merchant on its website and further agree not to
            use it for any unlawful purpose/activities. You will neither abate
            nor be a party to any illegal/criminal/money laundering/terrorist
            activities undertaken by using this Prepaid Card. Pay Point India
            shall not be responsible for any fraud or misuse of this Prepaid
            Card and you agree to be personally liable for any and all costs,
            taxes, charges, claims or liabilities of any nature, arising due to
            any such fraud or misuse of the Prepaid Card. You hereby declare
            that your name does not at anytime appear in the consolidated list
            of Terrorist Individuals / Organisations (Al Qaida or the Taliban)
            as circulated by RBI from time to time. Pay Point India shall not be
            liable / responsible for any defect in the product / merchandise /
            goods or services purchased / availed using this Prepaid Card. Any
            dispute or claim regarding the product / merchandise / goods or
            services purchased / availed on the website of the merchant using
            this Prepaid Card must be resolved with the designated merchants.
            Pay Point India does not own any responsibility to the cardholder in
            such circumstances. Pay Point India may charge payment gateway
            service fees to you for use of this Prepaid Card on the designated
            merchants. The said fees will not exceed 2.5% of the total
            transaction value. Additionally, if used or loaded at a retail agent
            of Pay Point India Network Pvt. Limited, a convenience fee of INR 10
            per transaction will be charged. This Prepaid Card is valid for 18
            months from the date of its first usage or 18 months from date of
            issue, whichever is earlier. Any unutilized balance remaining in
            this Prepaid Card after the date of expiry will stand forfeited as
            per the RBI Guidelines. In case the Prepaid Card is lost or
            misplaced, you shall promptly inform Pay Point India in writing
            (letter/e-mail). The Prepaid Card shall then be blocked and Pay
            Point India may issue new card as per prescribed procedure in this
            regard with the balance amount for a nominal charge as may be
            prescribed by Pay Point India from time to time. Any duplication of
            this Prepaid Card will be subject to cancellation. This Prepaid Card
            cannot be used for transactions in foreign currency. This Prepaid
            Card can be used only for online/on mobile/IVRS transactions with
            the merchants governed by Indian laws. This Prepaid Card is not
            transferable. Pay Point India reserves the right at any time to
            refuse for any reason whatsoever, the use of the Prepaid Card on the
            website/mobile application/IVRS of designated merchants. You shall
            promptly inform Pay Point India of any change of your name, mailing
            address, e-mail address or any other required data provided for the
            issuance of this Prepaid Card and submit the fresh KYC documents in
            respect of such change, as may be demanded by Pay Point India. For
            resolving any dispute, Pay Point India has formalized “Customer
            Grievance Redressal Policy” which is available on the website of All
            disputes arising out of any transaction pertaining to the use of
            this Prepaid Card shall be subject to this policy. Any further
            litigation shall be governed by exclusive jurisdiction of the courts
            in Mumbai. All transactions done by using this Prepaid Card are
            subject to applicable Indian laws. Pay Point India reserves the
            right to amend, alter, delete, insert and revise these terms and
            conditions without any prior notice/intimation to customer. We have
            the right, but not the obligation, to take any of the following
            actions in our sole discretion at any time and for any reason
            without giving you any prior notice: Restrict, suspend, or terminate
            your access to all or any part of our Services; Change, suspend, or
            discontinue all or any part of our Services; Refuse, move, or remove
            any material that you submit to our sites for any reason; Refuse,
            move, or remove any content that is available on our sites;
            Deactivate or delete your accounts and all related information and
            files in your account; Establish general practices and limits
            concerning use of our sites. You agree that we will not be liable to
            you or any third party for taking any of these actions Charges
            Applicable: All the charges as applicable in the usage of Paypointz
            Wallet are available on the link below: Applicable Charges Notices:
            All notices or demands to or upon web site shall be effective if in
            writing and shall be duly made when sent to Pay Point India on the
            following Address: To: Pay Point India Network Pvt. Ltd, A Wing,
            203, Supreme Business Park,Hiranandani Garden, Powai, Mumbai -
            400076 Maharashtra, India. feedback@paypointindia.com | +91 22 4068
            8088 All notices or demands to or upon a User(s) shall be effective
            if either delivered personally, sent by courier, certified mail, by
            facsimile or email to the last-known correspondence, fax or email
            address provided by the User(s) to web site, or by posting such
            notice or demand on an area of the web site that is publicly
            accessible without a charge. Arbitration Pay Point India may elect
            to resolve any dispute, controversy or claim arising out of or
            relating to this Agreement or Service provided in connection with
            this Agreement by binding arbitration in accordance with the
            provisions of the Indian Arbitration & Conciliation Act, 1996. Any
            such dispute, controversy or claim shall be arbitrated on an
            individual basis and shall not be consolidated in any arbitration
            with any claim or controversy of any other party. The arbitration
            shall be conducted in Mumbai, India and judgment on the arbitration
            award may be entered in any court having jurisdiction thereof.
            Either you or We may seek any interim or preliminary relief from a
            court of competent jurisdiction in Mumbai, India, necessary to
            protect the rights or the property of you or PaypointZ (or its
            agents, suppliers, and subcontractors), pending the completion of
            arbitration. Any arbitration shall be confidential, and neither you
            nor we may disclose the existence, content or results of any
            arbitration, except as may be required by law or for purposes of the
            arbitration award. All administrative fees and expenses of
            arbitration will be divided equally between you and us. In all
            arbitrations, each party will bear the expense of its own lawyers
            and preparation. The language of Arbitration shall be English.
            Governing Law: Terms and condition of use shall be governed in all
            respect by the laws of Indian Territory. Pay Point India considers
            itself and intended to be subject to the jurisdiction only of the
            Courts of Mumbai, Maharashtra, India. The parties to these Terms of
            use hereby submit to the exclusive jurisdiction of the courts of
            Mumbai, Maharashtra, India.
            {/* <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <MinusIcon className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">

            </div> */}
          </div>
          <div className="p-4 static  bg-zinc-100 border-t border-zinc-200 mt-auto">
            <div className="flex gap-6 justify-end max-w-md mx-auto">
              <a
                className="text-xs text-zinc-600 flex items-center gap-0.25"
                href="https://github.com/emilkowalski/vaul"
                target="_blank"
              >
                GitHub
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="16"
                  aria-hidden="true"
                  className="w-3 h-3 ml-1"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                </svg>
              </a>
              <a
                className="text-xs text-zinc-600 flex items-center gap-0.25"
                href="https://twitter.com/emilkowalski_"
                target="_blank"
              >
                Twitter
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="16"
                  aria-hidden="true"
                  className="w-3 h-3 ml-1"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                </svg>
              </a>
            </div>
          </div>
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
