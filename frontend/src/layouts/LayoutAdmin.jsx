import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LayoutAdmin() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </>
  );
}