import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getGraficos, getAnalisisIA } from "../services/Api";
import toast from "react-hot-toast";
import { BarChart3, Sparkles, TrendingUp, Loader2, FileText, CheckCircle2 } from "lucide-react";

const DashboardAnalisis = () => {
  const [dataGrafico, setDataGrafico] = useState([]);
  const [textoIA, setTextoIA] = useState("");
  const [loadingGrafico, setLoadingGrafico] = useState(true);
  const [loadingIA, setLoadingIA] = useState(false);
  const [analisisGenerado, setAnalisisGenerado] = useState(false);

  // Colores personalizados para cada estado
  const coloresEstados = {
    "Pendiente": "#FCD34D", // Amarillo
    "En progreso": "#60A5FA", // Azul
    "Finalizado": "#34D399", // Verde
  };

  useEffect(() => {
    fetchGrafico();
  }, []);

  const fetchGrafico = async () => {
    setLoadingGrafico(true);
    try {
      const res = await getGraficos();
      const estadosMap = { 1: "En progreso", 2: "Finalizado", 3: "Pendiente" };

      const transformed = res.map((item) => ({
        estado: estadosMap[item.estado] || `Estado ${item.estado}`,
        cantidad: parseInt(item.cantidad, 10),
      }));

      setDataGrafico(transformed);
    } catch (error) {
      toast.error("Error al cargar los datos del gráfico");
      console.error(error);
    } finally {
      setLoadingGrafico(false);
    }
  };

  // Efecto de typing para el texto de la IA (corregido)
  const typeText = (text) => {
    if (!text || text.length === 0) return;
    
    // Establecer la primera letra inmediatamente
    setTextoIA(text[0]);
    
    let i = 1;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTextoIA((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10); // velocidad del efecto de tipeo
  };

  const generarAnalisis = async () => {
    setLoadingIA(true);
    setTextoIA("");
    setAnalisisGenerado(false);
    try {
      const res = await getAnalisisIA();
      const resumen = res.resume || "No se pudo generar el análisis.";
      typeText(resumen);
      setAnalisisGenerado(true);
    } catch (error) {
      toast.error("Error al generar el análisis IA");
      console.error(error);
    } finally {
      setLoadingIA(false);
    }
  };

  // Función para formatear el texto de la IA con estilos
  const formatearTextoIA = (texto) => {
    if (!texto) return null;

    // Dividir por líneas
    const lineas = texto.split('\n');
    const elementos = [];
    let enLista = false;
    let itemsLista = [];

    lineas.forEach((linea, index) => {
      const lineaTrim = linea.trim();

      // Títulos con ###
      if (lineaTrim.startsWith('###')) {
        if (enLista) {
          elementos.push(<ul key={`lista-${index}`} className="list-disc list-inside space-y-2 mb-4 ml-4">{itemsLista}</ul>);
          itemsLista = [];
          enLista = false;
        }
        elementos.push(
          <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 pb-2 border-b-2 border-blue-200">
            {lineaTrim.replace('###', '').trim()}
          </h3>
        );
      }
      // Títulos con **
      else if (lineaTrim.match(/^\*\*.*\*\*:?$/)) {
        if (enLista) {
          elementos.push(<ul key={`lista-${index}`} className="list-disc list-inside space-y-2 mb-4 ml-4">{itemsLista}</ul>);
          itemsLista = [];
          enLista = false;
        }
        elementos.push(
          <h4 key={index} className="text-lg font-semibold text-blue-700 mt-4 mb-2">
            {lineaTrim.replace(/\*\*/g, '').replace(':', '')}
          </h4>
        );
      }
      // Items de lista con *
      else if (lineaTrim.startsWith('*   ')) {
        enLista = true;
        const contenido = lineaTrim.replace('*   ', '');
        // Detectar si tiene subtítulo en negrita
        if (contenido.includes('**')) {
          const [titulo, ...resto] = contenido.split(':**');
          itemsLista.push(
            <li key={index} className="text-gray-700">
              <span className="font-semibold text-gray-900">{titulo.replace(/\*\*/g, '')}</span>
              {resto.length > 0 && `: ${resto.join(':**').replace(/\*\*/g, '')}`}
            </li>
          );
        } else {
          itemsLista.push(
            <li key={index} className="text-gray-700">{contenido}</li>
          );
        }
      }
      // Línea separadora
      else if (lineaTrim === '---') {
        if (enLista) {
          elementos.push(<ul key={`lista-${index}`} className="list-disc list-inside space-y-2 mb-4 ml-4">{itemsLista}</ul>);
          itemsLista = [];
          enLista = false;
        }
        elementos.push(<hr key={index} className="my-6 border-t-2 border-gray-200" />);
      }
      // Texto normal
      else if (lineaTrim.length > 0) {
        if (enLista) {
          elementos.push(<ul key={`lista-${index}`} className="list-disc list-inside space-y-2 mb-4 ml-4">{itemsLista}</ul>);
          itemsLista = [];
          enLista = false;
        }
        // Reemplazar negritas en el texto
        const textoConNegritas = lineaTrim.split(/(\*\*.*?\*\*)/).map((parte, i) => {
          if (parte.startsWith('**') && parte.endsWith('**')) {
            return <strong key={i} className="font-semibold text-gray-900">{parte.slice(2, -2)}</strong>;
          }
          return parte;
        });
        elementos.push(
          <p key={index} className="text-gray-700 leading-relaxed mb-3">
            {textoConNegritas}
          </p>
        );
      }
    });

    // Agregar lista pendiente si existe
    if (enLista && itemsLista.length > 0) {
      elementos.push(<ul key="lista-final" className="list-disc list-inside space-y-2 mb-4 ml-4">{itemsLista}</ul>);
    }

    return elementos;
  };

  // Calcular totales para las tarjetas
  const totalProyectos = dataGrafico.reduce((sum, item) => sum + item.cantidad, 0);
  const pendientes = dataGrafico.find(item => item.estado === "Pendiente")?.cantidad || 0;
  const enProgreso = dataGrafico.find(item => item.estado === "En progreso")?.cantidad || 0;
  const finalizados = dataGrafico.find(item => item.estado === "Finalizado")?.cantidad || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análisis y Estadísticas</h1>
            <p className="text-gray-600">Dashboard completo de proyectos con análisis inteligente</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-semibold text-sm">Total Proyectos</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{totalProyectos}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-700 font-semibold text-sm">Pendientes</span>
            <span className="w-5 h-5 bg-yellow-400 rounded-full"></span>
          </div>
          <p className="text-3xl font-bold text-yellow-900">{pendientes}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-semibold text-sm">En Progreso</span>
            <Loader2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{enProgreso}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-semibold text-sm">Finalizados</span>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">{finalizados}</p>
        </div>
      </div>

      {/* Sección del Gráfico */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Distribución de Proyectos por Estado</h2>
        </div>

        {loadingGrafico ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando datos del gráfico...</p>
            </div>
          </div>
        ) : dataGrafico.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="estado" 
                tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 500 }}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: '#4b5563', fontSize: 14 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} barSize={80}>
                {dataGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={coloresEstados[entry.estado] || "#6366f1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
        )}
      </div>

      {/* Sección del Análisis IA */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Análisis Inteligente con IA</h2>
            <p className="text-sm text-gray-600 mt-1">Obtén un resumen detallado generado por inteligencia artificial</p>
          </div>
          <button
            onClick={generarAnalisis}
            disabled={loadingIA}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingIA ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar Análisis
              </>
            )}
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-6 md:p-8 min-h-[300px]">
          {loadingIA ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600 italic text-center">
                ⏳ Procesando análisis con IA, por favor espera...
              </p>
            </div>
          ) : textoIA ? (
            <div className="prose prose-sm md:prose-base max-w-none">
              {formatearTextoIA(textoIA)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No se ha generado ningún análisis aún</p>
              <p className="text-gray-400 text-sm">Haz clic en "Generar Análisis" para obtener insights inteligentes sobre tus proyectos</p>
            </div>
          )}
        </div>

        {analisisGenerado && !loadingIA && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Análisis generado exitosamente</p>
              <p className="text-xs text-green-700 mt-1">El análisis incluye insights sobre eficiencia, innovación y sostenibilidad de tus proyectos.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalisis;

// import { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { getGraficos } from "../services/Api";
// import toast from "react-hot-toast";

// const Grafico = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await getGraficos();
//         const estadosMap = { 1: "En progreso", 2: "Finalizado", 3: "Pendiente" };

//         const transformed = res.map((item) => ({
//           estado: estadosMap[item.estado] || `Estado ${item.estado}`,
//           cantidad: parseInt(item.cantidad, 10),
//         }));

//         setData(transformed);
//       } catch (error) {
//         toast.error("Error al cargar los datos del gráfico");
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="p-6 flex flex-col items-center justify-center">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Distribución de proyectos por estado</h2>

//       {data.length > 0 ? (
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="estado" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Bar dataKey="cantidad" fill="#4F46E5" barSize={60} />
//           </BarChart>
//         </ResponsiveContainer>
//       ) : (
//         <p className="text-gray-500 mt-4">Cargando datos del gráfico...</p>
//       )}
//     </div>
//   );
// };

// export default Grafico;