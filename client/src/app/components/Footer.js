export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-secondary-light">
          © {new Date().getFullYear()} MDG Fashion. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}