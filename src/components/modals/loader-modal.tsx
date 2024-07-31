import { useState, useCallback, useEffect } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import Loader from "@/components/ui/loader";

/**
 * Loader component that can be used from any page.
 *
 * @component
 * @example
 * <LoaderModal title="Loading..." />
 * <Button onClick={() => setShowLoader(true)}>Show Loader</Button>
 * <LoaderModal open={showLoader} onClose={() => setShowLoader(false)} />
 */
const LoaderModal = ({
  title = "Loading...",
  open,
  onClose,
}: {
  title?: string;
  open: boolean;
  onClose: () => void;
}): JSX.Element => {
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);

  const closeLoader = useCallback(() => {
    onClose();
    setIsTimeoutRunning(false);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      if (!isTimeoutRunning) {
        setIsTimeoutRunning(true);
        setTimeout(closeLoader, 20000);
      }
    } else {
      setIsTimeoutRunning(false);
    }
  }, [open, closeLoader, isTimeoutRunning]);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-row justify-center items-center max-w-[15rem] h-20">
        <Loader /> {title}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoaderModal;
