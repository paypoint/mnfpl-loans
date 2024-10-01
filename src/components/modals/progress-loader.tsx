import { useCallback, useEffect } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

/**
 * Progress Loader component that can be used from any page.
 *
 * @component
 * @example
 * <ProgressModal title="Loading..." progress={50} />
 * <Button onClick={() => setShowLoader(true)}>Show Loader</Button>
 * <ProgressModal open={showLoader} progress={progress} onClose={() => setShowLoader(false)} />
 */
const ProgressModal = ({
  title = "Loading...",
  open,
  onClose,
  progress,
}: {
  title?: string;
  open: boolean;
  onClose: () => void;
  progress: number;
}): JSX.Element => {
  const closeLoader = useCallback(() => {
    onClose();
  }, [onClose]);

  //   useEffect(() => {
  //     let timer: NodeJS.Timeout;
  //     if (open) {
  //       timer = setTimeout(closeLoader, 20000);
  //     }
  //     return () => clearTimeout(timer);
  //   }, [open, closeLoader]);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col justify-center items-center max-w-[15rem]">
        {title} <Progress value={progress} className="w-[60%]" />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProgressModal;
