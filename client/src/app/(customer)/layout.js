import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CustomerLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}