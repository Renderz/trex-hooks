import { useState } from 'react';

export interface ModalProps {
  visible: boolean;
  confirmLoading: boolean;
  onOk: () => void;
  onCancel: () => void;
}

interface UseModalProps {
  onOk?: () => Promise<boolean>;
}

function useModal(props: UseModalProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const { onOk = () => Promise.resolve(true) } = props;

  const show = () => {
    setVisible(true);
  };

  const ok = async () => {
    const status = await onOk();
    if (status) {
      setVisible(false);
      setConfirmLoading(false);
    }
  };

  const cancel = () => {
    setVisible(false);
    setConfirmLoading(false);
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
