import { FC } from "react";

interface StepperProps {
  step: number;
}

const Stepper: FC<StepperProps> = ({ step }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="progress-bar bg-white">
          <div className="step">
            <p>Home</p>
            <div className="bullet">
              <i className="fa fa-home" aria-hidden="true" />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Number</p>
            <div className="bullet">
              <i
                className={`fas fa-mobile-alt ${step > 1 ? "" : "inactive"} `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>OTP</p>
            <div className="bullet">
              <i
                className={`fas fa-key ${step > 2 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Personal Details</p>
            <div className="bullet">
              <i
                className={`fas fa-user ${step > 3 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Selfie</p>
            <div className="bullet">
              <i className={`fas fa-camera ${step > 4 ? "" : "inactive"} `} />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>PAN</p>
            <div className="bullet">
              <i
                className={`fas fa-id-card ${step > 5 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Add. Proof</p>
            <div className="bullet">
              <i
                className={`fas fa-address-card ${step > 6 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>A/c Details</p>
            <div className="bullet">
              <i
                className={`fas fa-user ${step > 7 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>

          <div className="step">
            <p>E-Sign</p>
            <div className="bullet">
              <i
                className={`fas fa-file-signature ${
                  step > 8 ? "" : "inactive"
                } `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Confirm</p>
            <div className="bullet">
              <i
                className={`fas fa-check-double ${step > 9 ? "" : "inactive"} `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
