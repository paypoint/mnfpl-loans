import { OfferDetails } from "@/types";
import { format } from "date-fns";
import { FC } from "react";

interface KFSDetailsCardProps {
  offers: OfferDetails;
}

const KFSDetailsCard: FC<KFSDetailsCardProps> = ({ offers }) => {
  return (
    <div className="main_step_10bottom">
      <div className="grid grid-cols-2 gap-y-4">
        <div className="KFSDetailsKey">Tenor</div>
        <div className="KFSDetailsValue">{offers.tenor} days</div>
        <div className="KFSDetailsKey">Offer Expiry Date</div>
        <div className="KFSDetailsValue">
          {" "}
          {format(new Date(offers?.ExpiryDate!), "dd/MM/yyyy")}
        </div>
        <div className="KFSDetailsKey">Daily Installment Amount</div>
        <div className="KFSDetailsValue">₹{Math.round(offers?.emi!)}</div>
        <div className="KFSDetailsKey">Number of Installments</div>
        <div className="KFSDetailsValue">{offers?.noOfPayment}</div>
        <div className="KFSDetailsKey">Interest Rate</div>
        <div className="KFSDetailsValue">{offers?.interest}%</div>
        <div className="KFSDetailsKey">
          Processing Fees{" "}
          <span className="text-gray-400 font-medium">
            ({offers?.interest}% + {offers?.gst}%)
          </span>
        </div>
        <div className="KFSDetailsValue">
          ₹{offers?.processingFee.toFixed(2)}
        </div>
        <div className="KFSDetailsKey">Net Disbursed Amount</div>
        <div className="KFSDetailsValue">
          ₹{offers?.netDisbursement.toFixed(2)}
        </div>
        <div className="KFSDetailsKey">Total Paid by Customer</div>
        <div className="KFSDetailsValue">
          ₹{offers?.totalPaidbyCustomer.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default KFSDetailsCard;
