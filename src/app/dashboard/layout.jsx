// app/dashboard/layout.jsx

import { ValidateUser } from "@/lib/auth/ValidateUser";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/AuthUserContext";

export default async function DashboardLayout({ children }) {
//   const user = await ValidateUser();
// console.log("fdgnmjhngbfvxdzc",user)
//   // 🔐 protect route
//   if (!user) {
//     redirect("http://localhost:3000");
//   }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}