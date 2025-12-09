
import { IoCartOutline } from "react-icons/io5";

export default function PedidoDetails({ pedido }) {
    return (
        <div className="bg-indigo-50/30 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-2">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <IoCartOutline className="text-indigo-500" />
                        Detalle del Pedido #{pedido.id}
                    </h4>
                    <span className="text-sm text-slate-500">{pedido.productos?.length || 0} productos</span>
                </div>

                {/* INFO EXTRA DEL PEDIDO */}
                <div className="px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 bg-indigo-50/10">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Tipo de Entrega</p>
                        <p className="text-slate-800 font-medium capitalize flex items-center gap-2">
                            {pedido.tipo_entrega === "domicilio" ? "Domicilio" : "En tienda"}
                        </p>
                    </div>
                    {pedido.tipo_entrega === "domicilio" && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Dirección</p>
                            <p className="text-slate-800 font-medium">{pedido.cliente_direccion || "Sin dirección"}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Método de Pago</p>
                        <p className="text-slate-800 font-medium capitalize">
                            {pedido.metodo_pago}
                            {pedido.metodo_pago === "efectivo" && pedido.cambio && (
                                <span className="text-xs text-slate-500 block">
                                    (Cambio: ${parseInt(pedido.cambio).toLocaleString("es-CO")})
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(pedido.productos || []).map((prod, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                            <div>
                                <p className="font-medium text-slate-900 text-sm">{prod.nombre}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {prod.cantidad} × ${parseInt(prod.precio || 0).toLocaleString("es-CO")}
                                </p>
                            </div>
                            <p className="font-bold text-indigo-600 text-sm">
                                ${(prod.cantidad * parseInt(prod.precio || 0)).toLocaleString("es-CO")}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-8 items-end sm:items-center">
                    {pedido.costo_envio > 0 && (
                        <div className="text-right flex justify-between sm:block w-full sm:w-auto">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Envío</p>
                            <p className="text-lg font-bold text-slate-700">
                                ${parseInt(pedido.costo_envio).toLocaleString("es-CO")}
                            </p>
                        </div>
                    )}
                    <div className="text-right flex justify-between sm:block w-full sm:w-auto">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total a Pagar</p>
                        <p className="text-xl font-bold text-slate-900">
                            ${parseInt(pedido.total || 0).toLocaleString("es-CO")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
