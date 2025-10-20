// src/pages/FormularioProyecto.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
    getProyectoById,
    createProyecto,
    updateProyecto,
} from "../services/Api";
import { 
    Save, 
    X, 
    FileText, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Loader2,
    ArrowLeft
} from "lucide-react";

const FormularioProyecto = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtenemos el id si existe (modo edición)
    const id = new URLSearchParams(location.search).get("id");

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        estado: "pendiente",
        fechaInicio: "",
        fechaFin: "",
    });

    const [loading, setLoading] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [errors, setErrors] = useState({});

    // Estados disponibles con iconos y colores
    const estadosDisponibles = [
        { 
            valor: "pendiente", 
            label: "Pendiente", 
            icon: Clock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            border: "border-yellow-200"
        },
        { 
            valor: "en progreso", 
            label: "En Progreso", 
            icon: AlertCircle,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200"
        },
        { 
            valor: "completado", 
            label: "Completado", 
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-200"
        }
    ];

    // === Obtener datos si estamos en modo edición ===
    useEffect(() => {
        const fetchProyecto = async () => {
            if (!id) return;

            try {
                setCargandoDatos(true);
                const proyecto = await getProyectoById(id);

                // Convertimos estado numérico a texto
                let estadoTexto = "pendiente";
                if (proyecto.estado === 1) estadoTexto = "pendiente";
                else if (proyecto.estado === 2) estadoTexto = "en progreso";
                else if (proyecto.estado === 3) estadoTexto = "completado";

                setFormData({
                    nombre: proyecto.nombre || "",
                    descripcion: proyecto.descripcion || "",
                    estado: estadoTexto,
                    fechaInicio: proyecto.fechaInicio?.split("T")[0] || "",
                    fechaFin: proyecto.fechaFin?.split("T")[0] || "",
                });
            } catch (error) {
                console.error("Error al obtener proyecto:", error);
                toast.error("No se pudo cargar el proyecto");
                navigate("/");
            } finally {
                setCargandoDatos(false);
            }
        };

        fetchProyecto();
    }, [id, navigate]);

    // Validación del formulario
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        } else if (formData.nombre.length < 3) {
            nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
        }

        if (!formData.descripcion.trim()) {
            nuevosErrores.descripcion = "La descripción es obligatoria";
        } else if (formData.descripcion.length < 10) {
            nuevosErrores.descripcion = "La descripción debe tener al menos 10 caracteres";
        }

        if (formData.fechaInicio && formData.fechaFin) {
            if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
                nuevosErrores.fechaFin = "La fecha de fin no puede ser anterior a la fecha de inicio";
            }
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Manejar cambios de los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            toast.error("Por favor corrige los errores del formulario");
            return;
        }

        setLoading(true);

        // Transformar estado de texto a número antes de enviar
        const datosEnviar = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            estado:
                formData.estado === "pendiente" ? 1
                : formData.estado === "en progreso" ? 2
                : formData.estado === "completado" ? 3
                : 1,
            fechaInicio: formData.fechaInicio || null,
            fechaFin: formData.fechaFin || null,
        };

        try {
            if (id) {
                await updateProyecto(id, datosEnviar);
                toast.success("✅ Proyecto actualizado correctamente");
            } else {
                await createProyecto(datosEnviar);
                toast.success("🎉 Proyecto creado correctamente");
            }

            navigate("/");
        } catch (error) {
            console.error("Error al guardar proyecto:", error);
            toast.error("❌ Ocurrió un error al guardar el proyecto");
        } finally {
            setLoading(false);
        }
    };

    if (cargandoDatos) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Cargando datos del proyecto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header con botón de volver */}
            <div className="mb-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al listado
                </button>
                
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {id ? "Editar Proyecto" : "Nuevo Proyecto"}
                        </h1>
                        <p className="text-gray-600">
                            {id ? "Actualiza la información del proyecto" : "Completa los datos para crear un nuevo proyecto"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
                {/* Nombre del proyecto */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre del Proyecto <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Desarrollo de aplicación móvil"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.nombre 
                                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                        }`}
                    />
                    {errors.nombre && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.nombre}
                        </p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Describe los objetivos y alcance del proyecto..."
                        rows="4"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                            errors.descripcion 
                                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                        }`}
                    />
                    {errors.descripcion && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.descripcion}
                        </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                        {formData.descripcion.length} caracteres
                    </p>
                </div>

                {/* Estado del proyecto */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Estado del Proyecto <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {estadosDisponibles.map((estado) => {
                            const Icon = estado.icon;
                            const isSelected = formData.estado === estado.valor;
                            
                            return (
                                <label
                                    key={estado.valor}
                                    className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        isSelected 
                                            ? `${estado.border} ${estado.bg} shadow-md` 
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="estado"
                                        value={estado.valor}
                                        checked={isSelected}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <Icon className={`w-5 h-5 ${isSelected ? estado.color : 'text-gray-400'}`} />
                                    <span className={`font-medium ${isSelected ? estado.color : 'text-gray-700'}`}>
                                        {estado.label}
                                    </span>
                                    {isSelected && (
                                        <CheckCircle2 className={`w-5 h-5 ml-auto ${estado.color}`} />
                                    )}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fecha Inicio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Fecha Fin */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Fecha de Finalización
                        </label>
                        <input
                            type="date"
                            name="fechaFin"
                            value={formData.fechaFin}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                errors.fechaFin 
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                            }`}
                        />
                        {errors.fechaFin && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.fechaFin}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {id ? "Actualizar Proyecto" : "Crear Proyecto"}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Nota informativa */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Los campos marcados con <span className="text-red-500">*</span> son obligatorios. 
                    Las fechas son opcionales pero te ayudarán a hacer seguimiento del proyecto.
                </p>
            </div>
        </div>
    );
};

export default FormularioProyecto;

// // src/pages/FormularioProyecto.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import toast from "react-hot-toast";
// import {
//     getProyectoById,
//     createProyecto,
//     updateProyecto,
// } from "../services/Api";


// const FormularioProyecto = ({ proyecto, modoEdicion = false, onSubmit }) => {

//     const navigate = useNavigate();
//     const location = useLocation();

//     // Obtenemos el id si existe (modo edición)
//     const id = new URLSearchParams(location.search).get("id");

//     // Estado inicial del formulario
//     const [formData, setFormData] = useState({
//         nombre: "",
//         descripcion: "",
//         estado: "",
//         fechaInicio: "",
//         fechaFin: "",
//     });

//     const [loading, setLoading] = useState(false);

//     // === Obtener datos si estamos en modo edición ===
//     useEffect(() => {
//         const fetchProyecto = async () => {
//             if (!id) return;

//             try {
//                 setLoading(true);
//                 const proyecto = await getProyectoById(id);
//                 console.log("Proyecto obtenido:", proyecto);

//                 // Convertimos estado numérico a texto
//                 let estadoTexto = "";
//                 if (proyecto.estado === 1) estadoTexto = "pendiente";
//                 else if (proyecto.estado === 2) estadoTexto = "en progreso";
//                 else if (proyecto.estado === 3) estadoTexto = "completado";

//                 setFormData({
//                     nombre: proyecto.nombre,
//                     descripcion: proyecto.descripcion,
//                     estado: estadoTexto,
//                     fechaInicio: proyecto.fechaInicio?.split("T")[0] || "",
//                     fechaFin: proyecto.fechaFin?.split("T")[0] || "",
//                 });
//             } catch (error) {
//                 console.error("Error al obtener proyecto:", error);
//                 toast.error("No se pudo cargar el proyecto ❌");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProyecto();
//     }, [id]);

//     // Manejar cambios de los inputs
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Envío del formulario
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // Transformar estado de texto a número antes de enviar
//         const datosEnviar = {
//             nombre: formData.nombre,
//             descripcion: formData.descripcion,
//             estado:
//                 formData.estado === "pendiente"
//                     ? 1
//                     : formData.estado === "en progreso"
//                         ? 2
//                         : formData.estado === "completado"
//                             ? 3
//                             : 1, // por si no selecciona nada
//             fechaInicio: formData.fechaInicio,
//             fechaFin: formData.fechaFin,
//         };

//         console.log("Datos a enviar:", datosEnviar);

//         try {
//             if (id) {
//                 // === MODO EDICIÓN ===
//                 await updateProyecto(id, datosEnviar);
//                 toast.success("Proyecto actualizado correctamente ✏️");
//             } else {
//                 // === MODO CREACIÓN ===
//                 await createProyecto(datosEnviar);
//                 toast.success("Proyecto creado correctamente 🎉");
//             }

//             navigate("/"); // volvemos al listado
//             //if (onSuccess) onSuccess(); // opcional, por si quieres recargar la tabla
//         } catch (error) {
//             console.error("Error al guardar proyecto:", error);
//             toast.error("Ocurrió un error al guardar el proyecto ❌");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto p-6 rounded-2xl shadow-md">
//             <h2 className="text-2xl font-bold text-center mb-6">
//                 {modoEdicion ? "Editar Proyecto" : "Crear Proyecto"}
//             </h2>

//             <form className="space-y-4" onSubmit={handleSubmit}>
//                 {/* Nombre */}
//                 <div>
//                     <label className="block font-semibold mb-1">Nombre:</label>
//                     <input
//                         type="text"
//                         name="nombre"
//                         value={formData.nombre}
//                         onChange={handleChange}
//                         placeholder="Ingresa el nombre del proyecto"
//                         className="border w-full px-3 py-2 rounded"
//                     />
//                 </div>

//                 {/* Descripción */}
//                 <div>
//                     <label className="block font-semibold mb-1">Descripción:</label>
//                     <textarea
//                         name="descripcion"
//                         value={formData.descripcion}
//                         onChange={handleChange}
//                         placeholder="Describe brevemente el proyecto"
//                         className="border w-full px-3 py-2 rounded"
//                     ></textarea>
//                 </div>

//                 {/* Estado */}
//                 <div>
//                     <label className="block font-semibold mb-1">Estado:</label>
//                     <select
//                         name="estado"
//                         value={formData.estado}
//                         onChange={handleChange}
//                         className="border w-full px-3 py-2 rounded"
//                     >
//                         <option value="pendiente">Pendiente</option>
//                         <option value="en progreso">En progreso</option>
//                         <option value="completado">Completado</option>
//                     </select>
//                 </div>

//                 {/* Fechas */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-semibold mb-1">Fecha Inicio:</label>
//                         <input
//                             type="date"
//                             name="fechaInicio"
//                             value={formData.fechaInicio}
//                             onChange={handleChange}
//                             className="border w-full px-3 py-2 rounded"
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-semibold mb-1">Fecha Fin:</label>
//                         <input
//                             type="date"
//                             name="fechaFin"
//                             value={formData.fechaFin}
//                             onChange={handleChange}
//                             className="border w-full px-3 py-2 rounded"
//                         />
//                     </div>
//                 </div>

//                 {/* Botón */}
//                 <div className="flex justify-between mt-4">
//                     <button
//                         type="button"
//                         onClick={() => navigate("/")}
//                         className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
//                     >
//                         Cancelar
//                     </button>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//                     >
//                         {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default FormularioProyecto;