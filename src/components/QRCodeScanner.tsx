import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, Flashlight } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRCodeScannerProps {
  onScanSuccess: (code: string) => void;
  onClose: () => void;
}

const QRCodeScanner = ({ onScanSuccess, onClose }: QRCodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    const initScanner = async () => {
      if (!videoRef.current) return;

      try {
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);
        
        if (!hasCamera) return;

        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            onScanSuccess(result.data);
            qrScanner.stop();
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        qrScannerRef.current = qrScanner;
        
        await qrScanner.start();
        setIsScanning(true);
      } catch (error) {
        console.error('Error starting QR scanner:', error);
        setHasCamera(false);
      }
    };

    initScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [onScanSuccess]);

  const toggleFlash = async () => {
    if (qrScannerRef.current) {
      try {
        if (flashOn) {
          await qrScannerRef.current.turnFlashOff();
        } else {
          await qrScannerRef.current.turnFlashOn();
        }
        setFlashOn(!flashOn);
      } catch (error) {
        console.error('Flash not supported:', error);
      }
    }
  };

  if (!hasCamera) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center">
            <Camera className="h-6 w-6 mr-2" />
            Camera Access Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Camera access is required to scan QR codes. Please enable camera permissions and try again.
          </p>
          <Button onClick={onClose} variant="outline" className="w-full">
            <X className="h-4 w-4 mr-2" />
            Close Scanner
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center">
          <Camera className="h-6 w-6 mr-2" />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video 
            ref={videoRef}
            className="w-full aspect-square object-cover rounded-lg bg-background"
          />
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse" />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={toggleFlash} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <Flashlight className={`h-4 w-4 mr-2 ${flashOn ? 'fill-current' : ''}`} />
            Flash {flashOn ? 'Off' : 'On'}
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Position the QR code within the frame to scan
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCodeScanner;