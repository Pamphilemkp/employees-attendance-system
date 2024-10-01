/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader'; // Import loader
import Link from 'next/link'; // For navigation to the home page

export default function ScanQR() {
  const [scanResult, setScanResult] = useState(''); // Store scanned employee ID
  const [isScanning, setIsScanning] = useState(true); // Scanning state
  const [devices, setDevices] = useState([]); // Available cameras
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Selected camera ID
  const [loading, setLoading] = useState(false); // Loader state
  const videoRef = useRef(null); // Video reference for the camera stream
  const codeReaderRef = useRef(new BrowserMultiFormatReader()); // QR code reader instance

  // Request camera permissions and get available video input devices
  useEffect(() => {
    const getPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error accessing cameras:', error);
        toast.error('Camera access denied. Please enable it in browser settings.');
      }
    };

    getPermissions();

    // Cleanup when component unmounts or when navigation happens
    return () => {
      stopCameraStream();
    };
  }, []);

  // Stop the camera stream
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Re-initialize scanning when the component is re-mounted or when the route changes
  useEffect(() => {
    if (isScanning && selectedDeviceId) {
      stopCameraStream(); // Stop any previous stream
      codeReaderRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, async (result, err) => {
        if (result) {
          const employeeId = result.getText();
          setScanResult(employeeId); // Set the scanned employee ID
          setIsScanning(false); // Stop scanning
          setLoading(true); // Show loader
          toast.success('QR Code Scanned! Processing...');

          // Trigger check-in/check-out API call
          await handleCheckInOrCheckOut(employeeId);

          // Reload the scanner after processing
          setTimeout(() => {
            setScanResult(''); // Clear the result for a new scan
            setIsScanning(true); // Re-enable scanning
          }, 2000); // Add 2-second delay before allowing new scan
        }
        if (err && err.name !== 'NotFoundException') {
          console.error(err); // Log errors but ignore "not found" exceptions
        }
      });

      return () => {
        stopCameraStream(); // Stop the camera stream on cleanup
      };
    }
  }, [isScanning, selectedDeviceId]);

  // Handle check-in/check-out based on the scanned employee ID
  const handleCheckInOrCheckOut = async (employeeId) => {
    try {
      const cyprusTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Nicosia',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const response = await fetch('/api/attendance/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, time: cyprusTime }), // Send employee ID and Cyprus time
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message); // Success message for check-in or check-out
      } else {
        toast.error(data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error during check-in/check-out:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false); // Hide loader after response
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-3xl font-bold text-center">Scan QR Code</h1>

        {/* Show loader when processing */}
        {loading && (
          <div className="flex justify-center mb-4">
            <ClipLoader size={50} color="#123abc" loading />
          </div>
        )}

        {/* Dropdown to select camera */}
        <div className="mb-4">
          <label htmlFor="cameraSelect" className="block mb-2 text-sm font-bold">
            Select Camera:
          </label>
          <select
            id="cameraSelect"
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            value={selectedDeviceId}
            className="w-full p-2 border rounded"
          >
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))
            ) : (
              <option disabled>No cameras available</option>
            )}
          </select>
        </div>

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

        {/* Button to go to Home page */}
        <div className="mt-4 text-center">
          <Link href="/" passHref>
            <a className="px-4 py-2 text-white bg-gray-600 rounded">Go to Home</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
