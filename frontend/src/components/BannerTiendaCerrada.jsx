import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function BannerTiendaCerrada({ children }) {
  const [cerrada, setCerrada] = useState(false);
  const location = useLocation();

  const rutasExcluidas = ["/admin", "/admin/login"];
  const esRutaExcluida = rutasExcluidas.some((ruta) =>
    location.pathname.startsWith(ruta)
  );

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from("tienda_estado")
        .select("cerrada")
        .single();
      setCerrada(data?.cerrada || false);
    };
    cargar();

    const channel = supabase
      .channel("tienda_cerrada")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tienda_estado" },
        (payload) => setCerrada(payload.new.cerrada)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Si está abierta o es ruta admin → mostrar web normal
  if (!cerrada || esRutaExcluida) return <>{children}</>;

  // Banner cuando está cerrada
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center px-6 relative overflow-hidden">

      {/* Fondo sutil con ondas modernas */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path
            fill="url(#gradient)"
            d="M0,100 C360,300 1080,0 1440,150 L1440,800 L0,800 Z"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative text-center text-white max-w-4xl z-10">

        {/* Nombre del negocio – grande y elegante */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Mini Market
          </span>{" "}
          <span className="text-white">del</span>{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Café
          </span>
        </h1>

        {/* Icono moderno de tienda cerrada */}
        <div className="inline-flex items-center justify-center w-40 h-40 md:w-56 md:h-56 bg-white/10 backdrop-blur-xl rounded-full border-8 border-white/20 mb-12 animate-pulse">
          <svg className="w-24 h-24 md:w-32 md:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M18 11V7a6 6 0 00-12 0v4M5 11h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
            <path strokeLinecap="round" strokeWidth={3} d="M15 15l-6 6m0-6l6 6" className="text-pink-400" />
          </svg>
        </div>

        {/* Título principal */}
        <h2 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter drop-shadow-2xl">
          CERRADO
        </h2>

        <p className="text-3xl md:text-5xl font-bold text-indigo-200 mb-8">
          Volvemos en un momento
        </p>

        <p className="text-xl md:text-3xl font-medium text-purple-200 max-w-2xl mx-auto leading-relaxed">
          Estamos preparando todo para atenderte con la mejor calidad y rapidez.
        </p>

        {/* Detalle final */}
        <div className="mt-16">
          <p className="text-2xl md:text-4xl font-bold text-pink-300 animate-pulse">
            ¡Gracias por elegirnos!
          </p>
        </div>

      </div>
    </div>
  );
}