"use client"
import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { toast } from 'react-hot-toast';

export default function ScanQR() {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null); // to hold the code reader instance

  useEffect(() => {
    if (isScanning) {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader; // store the codeReader instance

      codeReader.decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
        if (result) {
          const employeeId = result.getText();
          setScanResult(employeeId);
          setIsScanning(false); // Stop scanning after result
          toast.success('QR Code Scanned!');

          // Trigger check-in/check-out API call
          await handleCheckInOrCheckOut(employeeId);
        }
        if (err) {
          console.error(err); // Log errors, if any occur
        }
      });

      return () => {
        // Check if videoRef.current is defined before accessing its properties
        if (videoRef.current) {
          const stream = videoRef.current.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop()); // stop all tracks (camera)
          }
        }
      };
    }
  }, [isScanning]);

  // Function to handle check-in/check-out based on the scanned employee ID
  const handleCheckInOrCheckOut = async (employeeId) => {
    try {
      const response = await fetch('/api/attendance/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message); // Show success message from server (check-in or check-out)
      } else {
        toast.error(data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error during check-in/check-out:', error);
      toast.error('Failed to mark attendance');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-3xl font-bold text-center">Scan QR Code</h1>

        <div className="video-container">
          {isScanning && <video ref={videoRef} style={{ width: '100%' }} />}
        </div>

        {scanResult && (
          <div className="mt-4 text-center">
            <h2 className="text-lg">Scanned Employee ID:</h2>
            <p className="text-xl font-semibold">{scanResult}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>
      </div>
    </div>
  );
}
