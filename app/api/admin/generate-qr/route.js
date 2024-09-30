/* eslint-disable */
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get('employeeId');

  if (!employeeId) {
    return NextResponse.json({ success: false, message: 'Employee ID is required' });
  }

  try {
    // Generate QR code data URL
    const qrCodeDataURL = await QRCode.toDataURL(employeeId);
    return NextResponse.json({ success: true, qrCode: qrCodeDataURL });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate QR code' });
  }
}
