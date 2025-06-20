// client/src/app/layout.js

import "./global.css"; // Pastikan path ini sudah benar
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: "Fashion E-Commerce",
  description: "Discover the latest trends in fashion.",
};

export default function RootLayout({ children }) {
  return (

    <html lang="en" suppressHydrationWarning={true}> 
      <body>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}