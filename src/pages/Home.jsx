// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProyectos, deleteProyecto } from "../services/Api";
import { Search, Plus, Edit2, Trash2, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function Home() {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const proyectosPorPagina = 5;
    const navigate = useNavigate();

    const fetchProyectos = async () => {
        setLoading(true);
        try {
            const data = await getProyectos();
            setProyectos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
            toast.error("Error al cargar proyectos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProyectos();
    }, []);

    const handleEliminar = async (id) => {
        const ok = confirm("¿Seguro que deseas eliminar este proyecto?");
        if (!ok) return;

        try {
            await deleteProyecto(id);
            toast.success("Proyecto eliminado correctamente");
            setProyectos((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Error al eliminar proyecto:", error);
            toast.error("No se pudo eliminar el proyecto");
        }
    };

    const handleEditar = (id) => {
        navigate(`/formulario?id=${id}`);
    };

    const handleNuevo = () => {
        navigate("/formulario");
    };

    const proyectosFiltrados = proyectos.filter((p) =>
        `${p.nombre} ${p.descripcion} ${p.estado}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);
    const indiceInicio = (paginaActual - 1) * proyectosPorPagina;
    const proyectosPagina = proyectosFiltrados.slice(
        indiceInicio,
        indiceInicio + proyectosPorPagina
    );

    const cambiarPagina = (num) => {
        if (num < 1 || num > totalPaginas) return;
        setPaginaActual(num);
    };

    const getEstadoBadge = (estado) => {
        const estados = {
            1: { label: "Pendiente", clase: "bg-yellow-100 text-yellow-800 border-yellow-300" },
            2: { label: "En progreso", clase: "bg-blue-100 text-blue-800 border-blue-300" },
            3: { label: "Completado", clase: "bg-green-100 text-green-800 border-green-300" }
        };
        const est = estados[estado] || { label: estado, clase: "bg-gray-100 text-gray-800 border-gray-300" };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${est.clase}`}>
                {est.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Cargando proyectos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Listado de Proyectos</h1>
                <p className="text-gray-600">Gestiona y organiza todos tus proyectos en un solo lugar</p>
            </div>

            {/* Barra de búsqueda y botón nuevo */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                {/* Búsqueda */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPaginaActual(1);
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Botón nuevo proyecto */}
                <button
                    onClick={handleNuevo}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Proyecto
                </button>
            </div>

            {proyectos.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-gray-400 mb-4">
                        <Calendar className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-xl text-gray-600 font-semibold mb-2">No hay proyectos registrados</p>
                    <p className="text-gray-500 mb-6">Comienza creando tu primer proyecto</p>
                    <button
                        onClick={handleNuevo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Proyecto
                    </button>
                </div>
            ) : proyectosFiltrados.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No se encontraron proyectos que coincidan con tu búsqueda</p>
                </div>
            ) : (
                <>
                    {/* Tabla para escritorio */}
                    <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Fechas
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {proyectosPagina.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{p.nombre}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-xs truncate">
                                                {p.descripcion}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getEstadoBadge(p.estado)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {p.fechaInicio ? p.fechaInicio.split("T")[0] : "--"}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {p.fechaFin ? p.fechaFin.split("T")[0] : "--"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditar(p.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(p.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tarjetas para móvil/tablet */}
                    <div className="lg:hidden space-y-4">
                        {proyectosPagina.map((p) => (
                            <div key={p.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-gray-900">{p.nombre}</h3>
                                    {getEstadoBadge(p.estado)}
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-4">{p.descripcion}</p>
                                
                                <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Inicio: {p.fechaInicio ? p.fechaInicio.split("T")[0] : "--"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Fin: {p.fechaFin ? p.fechaFin.split("T")[0] : "--"}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => handleEditar(p.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(p.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                            <p className="text-sm text-gray-600">
                                Mostrando {indiceInicio + 1} a {Math.min(indiceInicio + proyectosPorPagina, proyectosFiltrados.length)} de {proyectosFiltrados.length} proyectos
                            </p>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => cambiarPagina(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPaginas }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => cambiarPagina(i + 1)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                                                paginaActual === i + 1
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => cambiarPagina(paginaActual + 1)}
                                    disabled={paginaActual === totalPaginas}
                                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}