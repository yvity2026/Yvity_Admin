import Image from "next/image";
import Sidebar from "./components/layout/Sidebar";
import { redirect } from "next/navigation";

export default function Home() {
  // return (
  //   <>
  //   <Sidebar />
  //   </>
  // );
  redirect("/advisor/dashboard");
}
