import { FC, useState } from "react";

import Screen_6 from "@/assets/images/Screen_6.jpg";

import { FileDialog } from "@/components/ui/file-dialog";

import { cn } from "@/lib/utils";

import { FileWithPreview } from "@/types";

interface UploadPanCardS6Props {
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pan_number: string;
}

const UploadPanCardS6: FC<UploadPanCardS6Props> = ({
  handleNext,
  isLoading,
  setIsLoading,
  pan_number,
}) => {
  const defaultFormValues = {
    pan_number: {
      value: pan_number,
      error: false,
    },
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

  const [panCardImage, setPanCardImage] = useState<FileWithPreview[] | null>(
    null
  );

  const onInputChange = (id: keyof typeof defaultFormValues, value: string) => {
    let _formValues = { ...formValues };
    _formValues[id].value = value;
    _formValues[id].error = false;
    setFormValues(_formValues);
  };

  return (
    <div className="page">
      <FileDialog
        files={panCardImage}
        setFiles={setPanCardImage}
        image={Screen_6}
        title={"PAN Card"}
        description={"Click here to upload pan card"}
      />
      <div className="col-md-12 mt-2">
        <div className="form-group">
          <label htmlFor="pannumber">Enter PAN number *</label>
          <input
            style={{
              textTransform: "uppercase",
            }}
            className="form-control"
            type="password"
            name=""
            placeholder="Enter PAN Number"
            id="pannumber"
            required
            value={pan_number}
            maxLength={10}
            onChange={(e) => onInputChange("pan_number", e.target.value)}
          />
          {formValues.pan_number.error ? (
            <span style={{ color: "red", fontSize: "14px" }}>
              Please enter valid pan number
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="field btns">
        <button
          disabled={isLoading}
          onClick={(e) => handleNext(e)}
          className={cn(
            "next-4 next disabled:opacity-70 disabled:pointer-events-none",
            isLoading && "animate-pulse"
          )}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default UploadPanCardS6;
