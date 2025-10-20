import { useState } from "react";
import { getAnalisisIA } from "../services/Api";
import toast from "react-hot-toast";

const Analisis = () => {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const typeText = (text) => {
    let i = 0;
    setTexto("");
    const interval = setInterval(() => {
      setTexto((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15); // velocidad del efecto de tipeo
  };

  const generarAnalisis = async () => {
    setLoading(true);
    setTexto("");
    try {
      const res = await getAnalisisIA();
      console.log(res);
      const resumen = res.resume || "No se pudo generar el análisis.";
      typeText(resumen);
    } catch (error) {
      toast.error("Error al generar el análisis IA");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🤖 Análisis generado por IA</h2>

      <button
        onClick={generarAnalisis}
        disabled={loading}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-6 disabled:opacity-50"
      >
        {loading ? "Analizando..." : "Generar análisis"}
      </button>

      <div className="w-full max-w-2xl bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-inner min-h-[200px] whitespace-pre-line">
        {loading && (
          <p className="text-gray-500 italic text-center">⏳ Procesando análisis, por favor espera...</p>
        )}
        {!loading && texto && <p className="text-gray-800 leading-relaxed">{texto}</p>}
      </div>
    </div>
  );
};

export default Analisis;