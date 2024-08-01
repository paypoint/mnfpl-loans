import { FC, useRef, useState } from "react";
import { X } from "lucide-react";

import Screen_5 from "@/assets/images/Screen_5.png";

import { Button } from "@/components/ui/button";
import { FileDialog } from "@/components/ui/file-dialog";

import { cn } from "@/lib/utils";

import { FileWithPreview } from "@/types";

interface UploadSelfieS5Props {
  handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadSelfieS5: FC<UploadSelfieS5Props> = ({
  handleNext,
  isLoading,
  setIsLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selfieImage, setSelfieImage] = useState<FileWithPreview[] | null>(
    null
  );
  const onSelfieClick = () => {
    fileInputRef.current?.click();
  };

  const handleCapture = (target: HTMLInputElement) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl: FileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setSelfieImage([newUrl]);
        if (newUrl.size >= 1024 * 1024 * 2) {
          const blobURL = newUrl.preview;
          const img = new Image();
          img.src = blobURL;
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          //@ts-ignore
          const mimeType = img.mimeType;
          const quality = 50;

          canvas.toBlob(
            function (blob) {
              const _newUrl: FileWithPreview = Object.assign({}, newUrl, {
                preview: URL.createObjectURL(blob!),
              });
              // Handle the compressed image
              setSelfieImage([_newUrl]);
              // uploadToServer(blob);
            },
            mimeType,
            quality
          );
        }
      }
    }
  };
  return (
    <>
      <div className="md:hidden page">
        <h4>Click Your Selfie</h4>
        <h5 onClick={onSelfieClick}>Click here to capture your selfie</h5>
        <img
          onClick={onSelfieClick}
          src={Screen_5}
          alt="clear-selfie-instructions"
        />
        <input
          ref={fileInputRef}
          hidden
          accept="image/*"
          type="file"
          capture="user"
          onChange={(e) => handleCapture(e.target)}
        />
        {selfieImage?.[0] && (
          <div className="relative p-2 sm:p-0 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <img
                src={selfieImage[0].preview}
                alt={selfieImage[0].name}
                className="h-10 w-10 shrink-0 rounded-md"
                width={40}
                height={40}
                loading="lazy"
              />
              <div className="flex flex-col">
                <p className="line-clamp-1  text-xs md:text-sm font-medium text-muted-foreground">
                  {selfieImage[0].name.substring(0, 30)}
                </p>
                <p className="text-xs text-slate-500">
                  {(selfieImage[0].size / 1024 / 1024).toFixed(2)}
                  MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  if (!selfieImage) return;
                  setSelfieImage(null);
                }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          </div>
        )}

        <div className="field btns">
          <button
            className={cn(
              "next-4 next disabled:opacity-70 disabled:pointer-events-none",
              isLoading && "animate-pulse"
            )}
            disabled={isLoading}
            onClick={(e) => handleNext(e)}
          >
            next
          </button>
        </div>
      </div>
      <div className="hidden md:block page">
        <FileDialog
          files={selfieImage}
          setFiles={setSelfieImage}
          image={Screen_5}
          title={"Click Your Selfie"}
          description={"Click here to upload your selfie"}
        />

        <div className="field btns">
          <button
            className={cn(
              "next-4 next disabled:opacity-70 disabled:pointer-events-none",
              isLoading && "animate-pulse"
            )}
            disabled={isLoading}
            onClick={(e) => handleNext(e)}
          >
            next
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadSelfieS5;
