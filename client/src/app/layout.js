// E-Commerce_Fashion-main/client/src/app/layout.js
import "./global.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./_contexts/AuthContext"; // Import AuthProvider

export const metadata = {
  title: "Fashion E-Commerce",
  description: "Discover the latest trends in fashion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}> 
      <body>
        <AuthProvider> {/* Bungkus dengan AuthProvider */}
          <ToastContainer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}