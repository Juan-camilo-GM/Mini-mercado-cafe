// src/layouts/LayoutPublic.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import BannerTiendaCerrada from "../components/BannerTiendaCerrada";

export default function LayoutPublic() {
  return (
    <BannerTiendaCerrada>
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </BannerTiendaCerrada>
  );
}