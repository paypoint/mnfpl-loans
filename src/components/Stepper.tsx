import { FC } from "react";

interface StepperProps {
  activeStep: number;
}

const Stepper: FC<StepperProps> = ({ activeStep }) => {
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
                className={`fas fa-mobile-alt ${
                  activeStep > 1 ? "" : "inactive"
                } `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>OTP</p>
            <div className="bullet">
              <i
                className={`fas fa-key ${activeStep > 2 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Personal Details</p>
            <div className="bullet">
              <i
                className={`fas fa-user ${activeStep > 3 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Selfie</p>
            <div className="bullet">
              <i
                className={`fas fa-camera ${activeStep > 4 ? "" : "inactive"} `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>PAN</p>
            <div className="bullet">
              <i
                className={`fas fa-id-card ${
                  activeStep > 5 ? "" : "inactive"
                } `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Aad. Proof</p>
            <div className="bullet">
              <i
                className={`fas fa-address-card ${
                  activeStep > 6 ? "" : "inactive"
                } `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>A/c Details</p>
            <div className="bullet">
              <i
                className={`fas fa-user ${activeStep > 7 ? "" : "inactive"} `}
                aria-hidden="true"
              />
              <div className="check fas fa-check" />
            </div>
          </div>

          <div className="step">
            <p>KFS</p>
            <div className="bullet">
              <i
                className={`fas fa-sitemap ${
                  activeStep > 8 ? "" : "inactive"
                } `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>

          <div className="step">
            <p>E-Sign</p>
            <div className="bullet">
              <i
                className={`fas fa-file-signature ${
                  activeStep > 9 ? "" : "inactive"
                } `}
              />
              <div className="check fas fa-check" />
            </div>
          </div>
          <div className="step">
            <p>Confirm</p>
            <div className="bullet">
              <i
                className={`fas fa-check-double ${
                  activeStep > 10 ? "" : "inactive"
                } `}
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
