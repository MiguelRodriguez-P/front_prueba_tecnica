import axios from "axios";
// src/api/api.jsx
import env from "../environment/env";

const api = axios.create({
  baseURL: env.api_url,
});

// ===== FUNCIONES CRUD =====

// Obtener todos los proyectos
// export const getProyectos = async () => {
//   const res = await api.get("/proyectos");
//   console.log("📦 Respuesta del backend:", res.data.proyectos);
//   return res.data.proyectos; // ya sabemos que la API devuelve esta propiedad
// };
export const getProyectos = async () => {
  const response = await fetch(`http://localhost:3000/api/proyectos`);
  if (!response.ok) {
    throw new Error("Error al obtener proyectos");
  }
  return await response.json();
};


// Obtener un proyecto por ID
export const getProyectoById = async (id) => {
  const res = await api.get(`/proyectos/${id}`);
  return res.data; // el backend devuelve el objeto del proyecto directamente
};

// Crear un nuevo proyecto
export const createProyecto = async (nuevoProyecto) => {
  const res = await api.post("/proyectos", nuevoProyecto);
  return res.data;
};

// Actualizar un proyecto existente
export const updateProyecto = async (id, proyectoActualizado) => {
  const res = await api.put(`/proyectos/${id}`, proyectoActualizado);
  console.log(res);
  return res.data;
};

// Eliminar un proyecto
export const deleteProyecto = async (id) => {
  const res = await api.delete(`/proyectos/${id}`);
  return res.data;
};

// Obtener datos para gráficos
export const getGraficos = async () => {
  const res = await api.get("/proyectos/graficos");
  return res.data;
};

// Obtener análisis generado por IA
export const getAnalisisIA = async () => {
  const res = await api.get("/proyectos/analisis");
  return res.data;
};


// Exportar por defecto si quieres importar todo como un objeto
export default {
  getProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getGraficos,
  getAnalisisIA,
};