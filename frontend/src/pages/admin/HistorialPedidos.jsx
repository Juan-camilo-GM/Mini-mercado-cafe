import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrashBin,
  IoSearch,
  IoCalendarOutline,
  IoPersonOutline,
  IoCashOutline,
  IoTrendingUp,
  IoCartOutline,
  IoTimeOutline,
  IoDownloadOutline,
  IoWarningOutline,
  IoStorefrontOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoAlertCircleOutline
} from "react-icons/io5";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProveedoresDashboard from "../../components/proveedores/ProveedoresDashboard";
import toast from "react-hot-toast";

// Componentes existentes (mantenemos todo igual)
const PedidoRow = ({ pedido, onEstadoChange, onEliminar }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <>
      <tr
        className={`cursor-pointer transition-all border-b border-slate-100 last:border-0 ${expandido ? "bg-indigo-50/30" : "hover:bg-slate-50"
          }`}
        onClick={() => setExpandido(!expandido)}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${expandido ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
              {expandido ? "▼" : <IoPersonOutline />}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{pedido.cliente_nombre || "Sin nombre"}</p>
              <p className="text-xs text-slate-500 font-medium">
                {format(new Date(pedido.created_at), "d MMM yyyy • HH:mm", { locale: es })}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 font-bold text-slate-700">
          ${parseInt(pedido.total || 0).toLocaleString("es-CO")}
        </td>
        <td className="px-6 py-4">
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
        </td>
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2">
            {pedido.estado !== "confirmado" && (
              <button
                onClick={() => onEstadoChange(pedido.id, "confirmado")}
                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Confirmar"
              >
                <IoCheckmarkCircle size={20} />
              </button>
            )}
            {pedido.estado !== "cancelado" && (
              <button
                onClick={() => onEstadoChange(pedido.id, "cancelado")}
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                title="Cancelar"
              >
                <IoCloseCircle size={20} />
              </button>
            )}
            <button
              onClick={() => onEliminar(pedido.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Eliminar"
            >
              <IoTrashBin size={18} />
            </button>
          </div>
        </td>
      </tr>

      {expandido && (
        <tr>
          <td colSpan="4" className="px-0 py-0 border-b border-slate-100">
            <div className="bg-indigo-50/30 p-6">
              <div className="max-w-4xl mx-auto bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <IoCartOutline className="text-indigo-500" />
                    Detalle del Pedido #{pedido.id}
                  </h4>
                  <span className="text-sm text-slate-500">{pedido.productos?.length || 0} productos</span>
                </div>

                {/* INFO EXTRA DEL PEDIDO */}
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 bg-indigo-50/10">
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

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-8 items-center">
                  {pedido.costo_envio > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Envío</p>
                      <p className="text-lg font-bold text-slate-700">
                        ${parseInt(pedido.costo_envio).toLocaleString("es-CO")}
                      </p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total a Pagar</p>
                    <p className="text-xl font-bold text-slate-900">
                      ${parseInt(pedido.total || 0).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const ProductoStockBajo = ({ producto }) => {
  const getNivelStock = (stock) => {
    if (stock === 0) return { texto: "AGOTADO", color: "bg-rose-100 text-rose-700 border-rose-200" };
    if (stock <= 5) return { texto: "CRÍTICO", color: "bg-orange-100 text-orange-700 border-orange-200" };
    return { texto: "BAJO", color: "bg-amber-100 text-amber-700 border-amber-200" };
  };

  const nivel = getNivelStock(producto.stock);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-slate-800 truncate pr-2">{producto.nombre}</h4>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${nivel.color}`}>
          {nivel.texto}
        </span>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Stock actual</span>
        <span className={`text-2xl font-black ${producto.stock === 0 ? "text-rose-500" :
          producto.stock <= 5 ? "text-orange-500" : "text-amber-500"
          }`}>
          {producto.stock}
        </span>
      </div>
      <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${producto.stock === 0 ? "bg-rose-500" :
            producto.stock <= 5 ? "bg-orange-500" : "bg-amber-500"
            }`}
          style={{ width: `${Math.min((producto.stock / 10) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Componente principal - AHORA CON 2 TABS
export default function HistorialPedidos() {
  const [tabActivo, setTabActivo] = useState("ventas"); // ← NUEVO ESTADO PARA TABS
  const [pedidos, setPedidos] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [fechaFin, setFechaFin] = useState(format(new Date(), "yyyy-MM-dd"));
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 12;

  // Modal eliminar
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

  // Cargar datos para la pestaña de ventas
  useEffect(() => {
    if (tabActivo === "ventas") {
      fetchPedidos();
      fetchProductosStockBajo();
    }
  }, [tabActivo]);

  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error cargando pedidos:", error);
    else setPedidos(data || []);

    setLoading(false);
  };

  const fetchProductosStockBajo = async () => {
    setLoadingStock(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .lte("stock", 10)
      .order("stock", { ascending: true });

    if (error) {
      console.error("Error cargando productos con stock bajo:", error);
    } else {
      setProductosStockBajo(data || []);
    }
    setLoadingStock(false);
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const { data: pedido, error: errorPedido } = await supabase
        .from("pedidos")
        .select("*")
        .eq("id", id)
        .single();

      if (errorPedido || !pedido) {
        toast.error("Error al obtener los datos del pedido", {
          icon: <IoAlertCircleOutline size={22} />,
        });
        return;
      }

      // === CONFIRMAR PEDIDO ===
      if (nuevoEstado === "confirmado" && pedido.estado !== "confirmado") {
        const productosConError = [];

        for (const prod of pedido.productos || []) {
          const { data: productoActual, error: errorGet } = await supabase
            .from("productos")
            .select("stock")
            .eq("id", prod.id)
            .single();

          if (errorGet || !productoActual) {
            productosConError.push(prod.nombre || "ID: " + prod.id);
            continue;
          }

          if (productoActual.stock - prod.cantidad < 0) {
            toast.error(
              `Stock insuficiente para "${prod.nombre}" (disponible: ${productoActual.stock}, solicitado: ${prod.cantidad})`,
              { icon: <IoAlertCircleOutline size={24} />, duration: 8000 }
            );
            return;
          }

          const { error: errorUpdate } = await supabase
            .from("productos")
            .update({ stock: productoActual.stock - prod.cantidad })
            .eq("id", prod.id);

          if (errorUpdate) productosConError.push(prod.nombre);
        }

        if (productosConError.length > 0) {
          toast.error(`Error al actualizar stock: ${productosConError.join(", ")}`, {
            icon: <IoCloseCircleOutline size={22} />,
            duration: 7000,
          });
          return;
        }
      }

      // === CANCELAR PEDIDO (devolver stock) ===
      if (nuevoEstado === "cancelado" && pedido.estado === "confirmado") {
        for (const prod of pedido.productos || []) {
          const { data: productoActual } = await supabase
            .from("productos")
            .select("stock")
            .eq("id", prod.id)
            .single();

          if (productoActual) {
            await supabase
              .from("productos")
              .update({ stock: productoActual.stock + prod.cantidad })
              .eq("id", prod.id);
          }
        }
      }

      // === ACTUALIZAR ESTADO ===
      const { error } = await supabase
        .from("pedidos")
        .update({ estado: nuevoEstado })
        .eq("id", id);

      if (error) {
        toast.error("Error al actualizar el estado del pedido", {
          icon: <IoCloseCircleOutline size={22} />,
        });
        return;
      }

      // === ÉXITO ===
      toast.success(
        nuevoEstado === "confirmado"
          ? "Pedido confirmado y stock actualizado"
          : nuevoEstado === "cancelado"
            ? "Pedido cancelado y stock devuelto"
            : "Estado actualizado correctamente",
        { icon: <IoCheckmarkCircleOutline size={24} /> }
      );

      fetchPedidos();
      fetchProductosStockBajo();

    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Error inesperado al procesar el pedido", {
        icon: <IoCloseCircleOutline size={22} />,
      });
    }
  };


  const confirmarEliminacion = async () => {
    if (!pedidoAEliminar) return;
    await supabase.from("pedidos").delete().eq("id", pedidoAEliminar);
    setPedidoAEliminar(null);
    toast.success("Pedido eliminado correctamente");
    fetchPedidos();
  };

  const eliminarPedido = (id) => {
    setPedidoAEliminar(id);
  };

  // Filtrado y cálculos para ventas
  const datosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const fecha = format(new Date(p.created_at), "yyyy-MM-dd");
      const enRango = fecha >= fechaInicio && fecha <= fechaFin;
      const cliente = p.cliente_nombre?.toLowerCase().includes(filtro.toLowerCase());
      const estado = estadoFiltro === "" || p.estado === estadoFiltro;
      return enRango && cliente && estado;
    });
  }, [pedidos, filtro, estadoFiltro, fechaInicio, fechaFin]);

  const hoy = format(new Date(), "yyyy-MM-dd");
  const ventasHoy = datosFiltrados
    .filter((p) => format(new Date(p.created_at), "yyyy-MM-dd") === hoy && p.estado === "confirmado")
    .reduce((acc, p) => acc + parseInt(p.total || 0), 0);

  const ventasPeriodo = datosFiltrados
    .filter((p) => p.estado === "confirmado")
    .reduce((acc, p) => acc + parseInt(p.total || 0), 0);

  const pedidosPendientes = datosFiltrados.filter((p) => p.estado === "pendiente").length;
  const pedidosConfirmados = datosFiltrados.filter((p) => p.estado === "confirmado").length;
  const ticketPromedio = pedidosConfirmados > 0 ? Math.round(ventasPeriodo / pedidosConfirmados) : 0;
  const productosStockCritico = productosStockBajo.filter(p => p.stock <= 5).length;
  const productosAgotados = productosStockBajo.filter(p => p.stock === 0).length;

  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = subDays(new Date(), 6 - i);
    const fechaStr = format(fecha, "yyyy-MM-dd");
    const ventas = datosFiltrados
      .filter((p) => format(new Date(p.created_at), "yyyy-MM-dd") === fechaStr && p.estado === "confirmado")
      .reduce((acc, p) => acc + parseInt(p.total || 0), 0);

    return {
      dia: format(fecha, "EEE", { locale: es }),
      fecha: format(fecha, "d MMM", { locale: es }),
      ventas,
    };
  });

  const topProductos = useMemo(() => {
    const mapa = {};
    datosFiltrados.forEach((p) => {
      if (p.estado !== "confirmado") return;
      p.productos?.forEach((prod) => {
        mapa[prod.nombre] = (mapa[prod.nombre] || 0) + prod.cantidad;
      });
    });
    return Object.entries(mapa)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
  }, [datosFiltrados]);

  const exportarCSV = () => {
    const encabezado = ["Fecha", "Cliente", "Estado", "Total", "Productos"];
    const filas = datosFiltrados.map((p) => [
      format(new Date(p.created_at), "dd/MM/yyyy HH:mm"),
      p.cliente_nombre,
      p.estado.toUpperCase(),
      parseInt(p.total),
      p.productos?.map((pr) => `${pr.nombre} x${pr.cantidad}`).join(" | ") || "",
    ]);

    const csvContent = [
      encabezado.join(","),
      ...filas.map((fila) => fila.map((campo) => `"${campo}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${fechaInicio}_a_${fechaFin}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPaginas = Math.ceil(datosFiltrados.length / itemsPorPagina);
  const pedidosPaginados = datosFiltrados.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina);

  // Renderizado condicional basado en la pestaña activa
  const renderContenido = () => {
    if (tabActivo === "ventas") {
      return (
        <div className="space-y-8">
          {/* Tarjetas de métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ventas hoy</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2 group-hover:scale-105 transition-transform origin-left">
                    ${ventasHoy.toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                  <IoTrendingUp className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total período</p>
                  <p className="text-3xl font-black text-indigo-600 mt-2 group-hover:scale-105 transition-transform origin-left">
                    ${ventasPeriodo.toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                  <IoCashOutline className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pendientes</p>
                  <p className="text-3xl font-black text-amber-500 mt-2 group-hover:scale-105 transition-transform origin-left">{pedidosPendientes}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-amber-100 transition-colors">
                  <IoTimeOutline className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ticket promedio</p>
                  <p className="text-3xl font-black text-purple-600 mt-2 group-hover:scale-105 transition-transform origin-left">
                    ${ticketPromedio.toLocaleString("es-CO")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 text-purple-500 group-hover:bg-purple-100 transition-colors">
                  <IoCartOutline className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Stock bajo</p>
                  <p className="text-3xl font-black text-rose-500 mt-2 group-hover:scale-105 transition-transform origin-left">{productosStockBajo.length}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {productosAgotados} agotados
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
                  <IoWarningOutline className="text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros + Gráfico */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <IoSearch className="text-indigo-500" />
                Filtros de Búsqueda
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Cliente</label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Estado</label>
                  <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Desde</label>
                    <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Hasta</label>
                    <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <IoTrendingUp className="text-indigo-500" />
                Ventas últimos 7 días
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ultimos7Dias}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="dia"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`$${value.toLocaleString("es-CO")}`, "Ventas"]}
                    />
                    <Bar dataKey="ventas" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top productos + Tabla */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <IoStorefrontOutline className="text-indigo-500" />
                Top 10 Productos
              </h3>
              <div className="space-y-3">
                {topProductos.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <IoCartOutline className="text-2xl text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm">No hay datos suficientes</p>
                  </div>
                ) : (
                  topProductos.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i < 3 ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                          }`}>
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{p.nombre}</span>
                      </div>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg text-xs">{p.cantidad} und</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Pedidos Recientes</h3>
                    <p className="text-sm text-slate-500">Gestiona los últimos pedidos recibidos</p>
                  </div>
                  <button
                    onClick={exportarCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    <IoDownloadOutline size={16} />
                    Exportar
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Cliente / Fecha</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 rounded-tr-lg">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pedidosPaginados.map((p) => (
                      <PedidoRow
                        key={p.id}
                        pedido={p}
                        onEstadoChange={actualizarEstado}
                        onEliminar={eliminarPedido}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm bg-slate-50/50 mt-auto">
                  <span className="text-slate-500 font-medium">
                    Mostrando <span className="text-slate-800 font-bold">{(pagina - 1) * itemsPorPagina + 1}</span> a <span className="text-slate-800 font-bold">{Math.min(pagina * itemsPorPagina, datosFiltrados.length)}</span> de <span className="text-slate-800 font-bold">{datosFiltrados.length}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={pagina === totalPaginas}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Productos con stock bajo */}
          {productosStockBajo.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <IoWarningOutline className="text-rose-500" />
                  Alerta de Stock Bajo
                  <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full ml-2">
                    {productosStockBajo.length} productos
                  </span>
                </h3>
              </div>

              {loadingStock ? (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-500 font-medium">Actualizando inventario...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productosStockBajo.map((producto) => (
                    <ProductoStockBajo
                      key={producto.id}
                      producto={producto}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else {
      // Tab de proveedores
      return <ProveedoresDashboard />;
    }
  };

  if (loading && tabActivo === "ventas") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Comercial</h1>
            <p className="text-lg text-slate-500 mt-1">Gestión integral de ventas y proveedores</p>
          </div>

          {tabActivo === "ventas" && (
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <IoDownloadOutline size={20} />
              Exportar CSV
            </button>
          )}
        </div>


        {/* Navegación por tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setTabActivo("ventas")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all relative ${tabActivo === "ventas"
                ? "text-indigo-600 bg-indigo-50/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IoCartOutline size={20} />
                Ventas y Pedidos
              </div>
              {tabActivo === "ventas" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setTabActivo("proveedores")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all relative ${tabActivo === "proveedores"
                ? "text-indigo-600 bg-indigo-50/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <IoStorefrontOutline size={20} />
                Gestión de Proveedores
              </div>
              {tabActivo === "proveedores" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </div>


          <div className="p-6 bg-slate-50/30">
            {renderContenido()}
          </div>
        </div>

        {/* MODAL ELIMINAR */}
        {pedidoAEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoTrashBin size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">¿Eliminar Pedido?</h3>
                <p className="text-slate-500 mb-6">
                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este pedido permanentemente?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPedidoAEliminar(null)}
                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarEliminacion}
                    className="py-3 px-4 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/30"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}