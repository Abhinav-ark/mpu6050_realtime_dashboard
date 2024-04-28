import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MPU6050 Sensor Dashboard",
  description: "Real Time Dashboard for MPU6050 Rotation and Acceleration using Websockets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
