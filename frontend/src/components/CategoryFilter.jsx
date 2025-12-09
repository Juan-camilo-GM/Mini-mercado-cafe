import { useRef, useState, useEffect } from "react";

export default function CategoryFilter({ categorias, filtroCategoria, setFiltroCategoria }) {
    const scrollRef = useRef(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(true);

    // Monitor scroll to toggle fade effects
    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftFade(scrollLeft > 10);
        setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    return (
        <div className="relative z-40 w-full bg-transparent">
            <div className="relative w-full"> {/* Removed max-w-7xl constraint to match full width request */}

                {/* Gradient Fade Left */}
                <div
                    className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-purple-700 to-transparent pointer-events-none z-10 transition-opacity duration-300
          ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="overflow-x-auto pt-6 pb-4 scrollbar-hide overscroll-contain w-full"
                >
                    <div className="flex items-center gap-3 min-w-full px-4 md:px-8">
                        {/* Chip 'Todas' */}
                        <button
                            onClick={() => setFiltroCategoria("")}
                            className={`
              cursor-pointer whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform active:scale-95 flex-shrink-0
              ${filtroCategoria === ""
                                    ? "bg-white text-purple-700 shadow-lg scale-100 ring-2 ring-white ring-offset-2 ring-offset-purple-700"
                                    : "bg-white/10 text-white hover:bg-white/20"}
            `}
                        >
                            Todas
                        </button>

                        {/* Chips Dinámicos */}
                        {categorias.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setFiltroCategoria(c.id.toString())}
                                className={`
                cursor-pointer whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform active:scale-95 flex-shrink-0
                ${filtroCategoria === c.id.toString() || filtroCategoria === c.id
                                        ? "bg-white text-purple-700 shadow-lg scale-100 ring-2 ring-white ring-offset-2 ring-offset-purple-700"
                                        : "bg-white/10 text-white hover:bg-white/20"}
              `}
                            >
                                {c.nombre}
                            </button>
                        ))}

                        {/* Spacer removed as px handles it */}
                    </div>
                </div>

                {/* Gradient Fade Right */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-purple-800 to-transparent pointer-events-none z-10 transition-opacity duration-300
          ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>
        </div>
    );
}
