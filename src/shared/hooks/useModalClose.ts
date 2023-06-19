import { useEffect, useRef } from 'react';

interface UseModalCloseProps {
  onClose?: () => void;
}

export function useModalClose({ onClose }: UseModalCloseProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const { target } = event;

      if (target instanceof Node && !ref.current?.contains(target)) {
        onClose?.();
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return [ref];
}
