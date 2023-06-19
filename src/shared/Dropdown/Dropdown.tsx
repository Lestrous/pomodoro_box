import React from 'react';
import styles from './dropdown.scss';
import { useModalClose } from '../hooks/useModalClose';
import { createPortal } from 'react-dom';

interface DropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
  openSide: 'bottom' | 'onElement';
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP = () => {};

export function Dropdown({
  button,
  children,
  isOpen,
  openSide,
  onOpen = NOOP,
  onClose = NOOP,
}: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(isOpen);

  React.useEffect(() => setIsDropdownOpen(isOpen), [isOpen]);
  React.useEffect(
    () => (isDropdownOpen ? onOpen() : onClose()),
    [isDropdownOpen, onOpen, onClose]
  );

  const handleOpen = () => {
    if (isOpen === undefined) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const [ref] = useModalClose({ onClose: () => setIsDropdownOpen(false) });

  const node = document.querySelector('#dropdown_root');

  if (!node) {
    return null;
  }

  const bodyPosition = document.body.getBoundingClientRect();
  const refPosition = ref.current?.getBoundingClientRect();

  const dropdownPositionTop =
    openSide === 'bottom'
      ? Math.abs(bodyPosition.y) + (refPosition?.bottom ?? 0) - 4
      : refPosition?.top ?? 0;
  const dropdownPositionRight =
    openSide === 'bottom'
      ? Math.abs(bodyPosition.x) +
        (refPosition?.left ?? 0) +
        (refPosition?.width ?? 0) / 2
      : refPosition?.left ?? 0;

  return (
    <div className={styles.container} ref={ref}>
      <div onClick={handleOpen}>{button}</div>
      {isDropdownOpen && (
        <div className={styles.listContainer}>
          <div className={styles.list} onClick={() => setIsDropdownOpen(false)}>
            {createPortal(
              <div
                style={{
                  position: 'absolute',
                  top: `${dropdownPositionTop}px`,
                  left: `${dropdownPositionRight}px`,
                }}
              >
                {children}
              </div>,
              node
            )}
          </div>
        </div>
      )}
    </div>
  );
}
