## Attendance System Documentation

### Overview

This Attendance System allows employees to check in and check out by simply entering their employee ID. The system automatically records the current time for both check-in and check-out. Only the admin has the capability to manage, edit, and view all attendance records.

### Features

- **Employee Attendance**: Employees can check in and check out by entering their employee ID. No sign-in is required for this.
- **Admin Dashboard**: The admin can view, edit, and manage all attendance records.
- **Time Tracking**: The system automatically calculates the time worked, including hours, minutes, and seconds.

### Prerequisites

- **Node.js** (v14 or later)
- **MongoDB**: Ensure you have a MongoDB instance running, either locally or via a cloud service like MongoDB Atlas.
- **Next.js** (App Router)
- **Tailwind CSS** for styling

### Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd attendance-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add the following environment variables:
   ```bash
   MONGODB_URI=your_mongodb_uri_here
   NEXTAUTH_SECRET=your_secret_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

### Usage

#### 1. **Employee Attendance**

Employees can mark their attendance by navigating to the `/attendance` page:

- **Check-In**: Enter your Employee ID and click the "Check In" button. The system records the current date and time as your check-in time.
- **Check-Out**: Enter your Employee ID again and click the "Check Out" button. The system records the current date and time as your check-out time.

#### 2. **Admin Dashboard**

Admins can manage attendance records by navigating to the `/admin` page:

- **View Records**: See all employees' attendance records, including check-in and check-out times.
- **Edit Records**: Click the "Edit" button next to any record to modify the check-in or check-out time. You can adjust the times using a datetime picker and save the changes.
- **Time Worked**: The system automatically calculates the total time worked by an employee based on their check-in and check-out times.

### API Routes

- **Check-In**: `POST /api/attendance/checkin`
  - **Request Body**: `{ "employeeId": "12345" }`
  - **Response**: `{ "success": true, "message": "Check-in successful!" }`
  
- **Check-Out**: `POST /api/attendance/checkout`
  - **Request Body**: `{ "employeeId": "12345" }`
  - **Response**: `{ "success": true, "message": "Check-out successful!" }`
  
- **Update Attendance**: `POST /api/attendance/update`
  - **Request Body**: `{ "id": "attendance_id", "checkIn": "2023-01-01T08:00:00Z", "checkOut": "2023-01-01T17:00:00Z" }`
  - **Response**: `{ "success": true, "message": "Attendance updated successfully!" }`

### Deployment

You can deploy this application to any platform that supports Node.js, such as Vercel:

1. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel.
   - Set up your environment variables (`MONGODB_URI` and `NEXTAUTH_SECRET`) in the Vercel dashboard.
   - Deploy the application.

### Conclusion

This Attendance System is designed to be simple yet powerful, enabling seamless attendance management. Employees can easily check in and out without needing to log in, while the admin can manage the records efficiently.