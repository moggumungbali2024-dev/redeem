import React from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerComponentProps {
  onScan: (result: string) => void;
}

export default function QRScannerComponent({ onScan }: QRScannerComponentProps) {
  return (
    <Scanner 
      onScan={(result) => {
        if (result && result.length > 0 && result[0].rawValue) {
          onScan(result[0].rawValue);
        }
      }} 
      onError={(e) => console.error("QR Scanner Error:", e)} 
      components={{ finder: false, audio: false }}
    />
  );
}
