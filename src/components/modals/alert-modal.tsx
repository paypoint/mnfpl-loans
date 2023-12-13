import { useState, useCallback } from "react";

import { Modal } from "@/components/ui/modal";

export const useAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
  });

  const showAlert = useCallback(
    ({ title, description }: typeof alertContent) => {
      setAlertContent({ title, description });
      setIsOpen(true);
    },
    []
  );

  const dismissAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  const AlertModal = () => (
    <Modal
      title={alertContent?.title!}
      description={alertContent?.description!}
      isOpen={isOpen}
      onClose={dismissAlert}
    ></Modal>
  );

  return [showAlert, AlertModal];
};
