import React, { useEffect, useState } from 'react';

interface QRScannerComponentProps {
  onScan: (result: string) => void;
}

export default function QRScannerComponent({ onScan }: QRScannerComponentProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [ScannerComp, setScannerComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Check if BarcodeDetector or MediaDevices is available
    const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    
    if (!hasCamera) {
      setIsSupported(false);
      return;
    }

    // Dynamically import the scanner ONLY if camera is available
    import('@yudiel/react-qr-scanner')
      .then((mod) => {
        setScannerComp(() => mod.Scanner);
        setIsSupported(true);
      })
      .catch((err) => {
        console.warn('QR Scanner module failed to load:', err);
        setIsSupported(false);
      });
  }, []);

  if (isSupported === null) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-500 font-black text-xs uppercase tracking-wider">
        <span className="animate-pulse">Menyiapkan kamera...</span>
      </div>
    );
  }

  if (!isSupported || !ScannerComp) {
    return (
      <div className="p-6 text-center text-xs font-black text-[#FF8A80] uppercase tracking-wider flex flex-col items-center gap-2">
        <span>⚠️ Kamera tidak didukung pada browser ini.</span>
        <span className="text-[10px] text-stone-400 normal-case">
          Gunakan tombol simulasi di bawah untuk menguji penukaran kupon.
        </span>
      </div>
    );
  }

  return (
    <ScannerComp
      onScan={(result: any[]) => {
        if (result && result.length > 0 && result[0].rawValue) {
          onScan(result[0].rawValue);
        }
      }}
      onError={(e: any) => console.error('QR Scanner Error:', e)}
      components={{ finder: false, audio: false }}
    />
  );
}
