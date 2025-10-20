import { useEffect } from "react";
import api from "../services/Api";

export default function TestApi() {
  useEffect(() => {
    const probarConexion = async () => {
      try {
        const res = await api.get("/test");
        console.log("✅ Conexión exitosa:", res.data);
      } catch (err) {
        console.error("❌ Error al conectar con el backend:", err);
      }
    };
    probarConexion();
  }, []);

  return <h2>Probando conexión con el backend...</h2>;
}
