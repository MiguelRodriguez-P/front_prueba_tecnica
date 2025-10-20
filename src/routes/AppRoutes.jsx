import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Analisis from "../pages/Analisis";
import Grafico from "../pages/Grafico";
import Formulario from "../pages/Formulario";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grafico" element={<Grafico />} />
            <Route path="/formulario" element={<Formulario />} />
        </Routes>
    );
}
