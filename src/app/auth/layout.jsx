import { Toaster } from "react-hot-toast";

export default function AuthLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              zIndex: 99999,
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
