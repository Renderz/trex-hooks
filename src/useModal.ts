import { useState } from 'react';

export interface ModalProps {
  visible: boolean;
  confirmLoading: boolean;
  onOk: () => void;
  onCancel: () => void;
}

interface UseModalProps {
  onOk?: () => Promise<boolean>;
  onCancel?: () => Promise<boolean>;
}

function useModal(props: UseModalProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const { onOk = () => Promise.resolve(true), onCancel = () => Promise.resolve(true) } = props;

  const show = () => {
    setVisible(true);
  };

  const ok = async () => {
    setConfirmLoading(true);

    try {
      const status = await onOk();
      if (status) {
        setVisible(false);
      }
    } catch (e) {
      console.warn(e);
      setConfirmLoading(false);
    }

    setConfirmLoading(false);
  };

  const cancel = async () => {
    try {
      const status = await onCancel();
      if (status) {
        setVisible(false);
        setConfirmLoading(false);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const modalProps = {
    visible,
    confirmLoading,
    onOk: ok,
    onCancel: cancel,
  };

  return {
    modalProps,
    show,
  };
}

export default useModal;
