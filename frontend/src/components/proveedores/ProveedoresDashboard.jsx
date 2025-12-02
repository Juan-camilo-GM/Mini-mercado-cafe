import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  IoStorefrontOutline,
  IoReceiptOutline,
  IoAddCircleOutline,
  IoBusinessOutline,
  IoCardOutline,
} from "react-icons/io5";
import ProveedoresList from "./ProveedoresList";
import PedidosProveedor from "./PedidosProveedor";
import FacturasProveedor from "./FacturasProveedor";
import { Modals } from "./Modals";

const ProveedoresDashboard = () => {
  const [proveedores, setProveedores] = useState([]);
  const [pedidosProveedor, setPedidosProveedor] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalPedido, setModalPedido] = useState(false);
  const [modalFactura, setModalFactura] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar proveedores
      const { data: proveedoresData } = await supabase
        .from("proveedores")
        .select("*")
        .order("nombre");
      setProveedores(proveedoresData || []);
      
      // Cargar pedidos a proveedores
      const { data: pedidosData } = await supabase
        .from("pedidos_proveedor")
        .select(`
          *,
          proveedores (nombre)
        `)
        .order("created_at", { ascending: false });
      setPedidosProveedor(pedidosData || []);
      
      // Cargar facturas
      const { data: facturasData } = await supabase
        .from("facturas")
        .select(`
          *,
          proveedores (nombre)
        `)
        .order("fecha", { ascending: false });
      setFacturas(facturasData || []);
      
      // Cargar productos
      const { data: productosData } = await supabase
        .from("productos")
        .select("*")
        .order("nombre");
      setProductos(productosData || []);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas
  const gastosTotales = pedidosProveedor
    .filter(p => p.estado === "recibido" || p.estado === "confirmado")
    .reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);

  const gastosPendientes = pedidosProveedor
    .filter(p => p.estado === "pendiente")
    .reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);

  const facturasTotales = facturas.reduce((sum, f) => sum + (parseFloat(f.monto) || 0), 0);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando gestión de proveedores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total proveedores</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">{proveedores.length}</p>
            </div>
            <IoBusinessOutline className="text-5xl text-indigo-200 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gastos en pedidos</p>
              <p className="text-3xl font-black text-rose-600 mt-1">
                ${gastosTotales.toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${gastosPendientes.toLocaleString("es-CO")} pendientes
              </p>
            </div>
            <IoCardOutline className="text-5xl text-rose-200 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total facturado</p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                ${facturasTotales.toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {facturas.length} facturas registradas
              </p>
            </div>
            <IoReceiptOutline className="text-5xl text-purple-200 opacity-70" />
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setModalProveedor(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <IoAddCircleOutline size={20} />
          Nuevo Proveedor
        </button>
        <button
          onClick={() => setModalPedido(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <IoStorefrontOutline size={20} />
          Nuevo Pedido
        </button>
        <button
          onClick={() => setModalFactura(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <IoReceiptOutline size={20} />
          Nueva Factura
        </button>
      </div>

      {/* Componentes separados */}
      <ProveedoresList 
        proveedores={proveedores} 
        onRefresh={cargarDatos}
      />
      
      <PedidosProveedor 
        pedidos={pedidosProveedor}
        proveedores={proveedores}
        productos={productos}
        onRefresh={cargarDatos}
      />
      
      <FacturasProveedor 
        facturas={facturas}
        proveedores={proveedores}
        onRefresh={cargarDatos}
      />

      {/* Modales */}
      <Modals
        modalProveedor={modalProveedor}
        modalPedido={modalPedido}
        modalFactura={modalFactura}
        setModalProveedor={setModalProveedor}
        setModalPedido={setModalPedido}
        setModalFactura={setModalFactura}
        proveedores={proveedores}
        productos={productos}
        onRefresh={cargarDatos}
      />
    </div>
  );
};

export default ProveedoresDashboard;