
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    IoPersonOutline,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoTrashBin,
    IoChevronDown,
    IoChevronUp
} from "react-icons/io5";
import PedidoDetails from "./PedidoDetails";

export default function PedidoMobileCard({ pedido, onEstadoChange, onEliminar }) {
    const [expandido, setExpandido] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div
                className="p-4 flex flex-col gap-3 cursor-pointer"
                onClick={() => setExpandido(!expandido)}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${expandido ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
                            <IoPersonOutline />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{pedido.cliente_nombre || "Sin nombre"}</p>
                            <p className="text-xs text-slate-500 font-medium">
                                {format(new Date(pedido.created_at), "d MMM yyyy • HH:mm", { locale: es })}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${pedido.estado === "confirmado"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : pedido.estado === "pendiente"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                    >
                        {pedido.estado?.toUpperCase() || "SIN ESTADO"}
                    </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <p className="font-bold text-slate-700 text-lg">
                        ${parseInt(pedido.total || 0).toLocaleString("es-CO")}
                    </p>
                    <button className="text-slate-400">
                        {expandido ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="px-4 py-3 bg-slate-50 flex justify-end gap-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                {pedido.estado !== "confirmado" && (
                    <button
                        onClick={() => onEstadoChange(pedido.id, "confirmado")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-emerald-600 bg-white border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-colors font-medium text-sm"
                    >
                        <IoCheckmarkCircle size={18} />
                        Confirmar
                    </button>
                )}
                {pedido.estado !== "cancelado" && (
                    <button
                        onClick={() => onEstadoChange(pedido.id, "cancelado")}
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-rose-600 bg-white border border-rose-100 shadow-sm hover:bg-rose-50 transition-colors font-medium text-sm"
                    >
                        <IoCloseCircle size={18} />
                        Cancelar
                    </button>
                )}
                <button
                    onClick={() => onEliminar(pedido.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Eliminar"
                >
                    <IoTrashBin size={20} />
                </button>
            </div>

            {expandido && (
                <div className="border-t border-slate-100">
                    <PedidoDetails pedido={pedido} />
                </div>
            )}
        </div>
    );
}
