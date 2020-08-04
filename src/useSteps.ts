import { useState } from 'react';

function useSteps(total: number) {
  const [current, setCurrenct] = useState<number>(0);

  const jump = (location: number) => {
    if (location <= total - 1 && location >= 0) {
      setCurrenct(location);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrenct(current - 1);
    }
  };

  const next = () => {
    if (current < total - 1) {
      setCurrenct(current + 1);
    }
  };

  const reset = () => {
    setCurrenct(0);
  };

  return {
    current,
    prev,
    next,
    jump,
    reset,
  };
}

export default useSteps;
