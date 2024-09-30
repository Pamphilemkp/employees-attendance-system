'use client';
import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader'; // Import loader

export default function ScanQR() {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [devices, setDevices] = useState([]); // Store available cameras
  const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Store selected camera ID
  const [loading, setLoading] = useState(false); // Track loading state
  const videoRef = useRef(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader()); // Code reader initialized here
  
  // Get available video input devices on component mount
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first camera
      }
    });
  }, []);

  // Function to stop the camera stream
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Start scanning when the camera is available
  useEffect(() => {
    if (isScanning && selectedDeviceId) {
      // Stop any existing stream before starting a new one
      stopCameraStream();

      codeReaderRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, async (result, err) => {
        if (result) {
          const employeeId = result.getText();
          setScanResult(employeeId);
          setIsScanning(false); // Stop scanning after result
          setLoading(true); // Show loader while processing
          toast.success('QR Code Scanned! Processing...');

          // Trigger check-in/check-out API call
          await handleCheckInOrCheckOut(employeeId);

          // Reload the page after processing
          setTimeout(() => {
            window.location.reload(); // Reload the page to enable new scan
          }, 2000); // Add a 2-second delay before reload
        }
        if (err && err.name !== 'NotFoundException') {
          console.error(err); // Log errors, but ignore not found exception
        }
      });

      return () => {
        stopCameraStream(); // Stop the camera stream when component unmounts or scanning stops
      };
    }
  }, [isScanning, selectedDeviceId]);

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
            <ClipLoader size={50} color={"#123abc"} loading={true} />
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
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
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
      </div>
    </div>
  );
}
