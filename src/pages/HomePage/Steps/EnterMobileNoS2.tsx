import { onlyNumberValues, cn } from "@/lib/utils";
import { FC } from "react";
import Second_screen from "@/assets/images/Second_screen.jpg";

interface EnterMobileNoS2Props {
  mobile_no: string;
  isLoading: boolean;
  handleNext: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
}

const EnterMobileNoS2: FC<EnterMobileNoS2Props> = ({
  mobile_no,
  isLoading,
  handleNext,
}) => {
  return (
    <div className="page">
      <div className="main_step_2">
        <h4>Enter Your Mobile Number</h4>
        <img src={Second_screen} alt="enter-mobile-number-image" />
      </div>
      <div className="main_step_2 text-left">
        <label htmlFor="number">Mobile Number*</label>
        <input
          readOnly
          value={mobile_no}
          maxLength={10}
          name="number"
          className="form-control"
          placeholder="Enter Mobile Number"
          type="text"
          required
          id="number"
        />
      </div>
      <div className="field btns">
        <button
          disabled={isLoading}
          onClick={(e) => handleNext(e)}
          className={cn(
            "next-2 next disabled:opacity-70 disabled:pointer-events-none",
            isLoading && "animate-pulse"
          )}
        >
          send otp
        </button>
      </div>
    </div>
  );
};

export default EnterMobileNoS2;
