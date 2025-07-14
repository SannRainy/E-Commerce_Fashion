// E-Commerce_Fashion-main/client/src/app/admin/layout.js
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}