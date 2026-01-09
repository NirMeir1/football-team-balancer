import { useState } from 'react';
import { Modal, ModalHeader, ModalContent } from './Modal';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PIN = '1907';

export function PinModal({ isOpen, onClose, onSuccess }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinChange = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === ADMIN_PIN) {
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 200);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClose = () => {
    setPin('');
    setError(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showCloseButton>
      <ModalHeader
        title="גישת מנהל"
        subtitle="הזן קוד PIN לעריכת דירוגים"
        gradient="from-blue-500 to-indigo-600"
      />
      <ModalContent>
        <div className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  error
                    ? 'border-red-400 bg-red-50 animate-shake'
                    : pin.length > i
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {pin.length > i && (
                  <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-blue-500'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-sm text-red-500 font-medium">
              קוד שגוי, נסה שוב
            </p>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinChange(num.toString())}
                className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-semibold text-gray-700 transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-sm font-medium text-gray-500 transition-colors"
            >
              מחק
            </button>
            <button
              type="button"
              onClick={() => handlePinChange('0')}
              className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-xl font-semibold text-gray-700 transition-colors"
            >
              0
            </button>
            <div className="h-14" />
          </div>

        </div>
      </ModalContent>
    </Modal>
  );
}
