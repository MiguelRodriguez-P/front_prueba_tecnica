# 🚀 Interfaz Web de Gestión de Proyectos (Frontend)

Interfaz de usuario responsiva desarrollada con **React** y **Vite** para consumir la API REST de gestión de proyectos. Esta aplicación permite a los usuarios registrar, listar y visualizar el estado de los proyectos, e interactuar con el resumen generado por IA.

---

## 📦 Tecnologías principales

### Frontend
- **React** + **Vite**: Librería principal para la UI y herramienta de construcción ultra-rápida.
- **Axios**: Cliente HTTP para el consumo de la API REST del backend.
- **Tailwind CSS**: Framework CSS utilitario elegido para un diseño rápido, moderno y completamente **responsivo**.
- **Recharts**: Librería para la visualización de datos, utilizada para mostrar el **gráfico interactivo** de distribución de proyectos por estado.
- **Librerías adicionales**: React Router para la navegación y React Hot Toast para notificaciones de usuario.

---

## ⚙️ Pasos para instalar y ejecutar el proyecto

Estas instrucciones asumen que el **Backend (API) ya está en ejecución** en la ruta base definida (por defecto, `http://localhost:3000`).

### 🔧 Instalación y Arranque

1.  **Clonar el Repositorio (si aún no lo has hecho):**
    ```bash
    git clone https://github.com/MiguelRodriguez-P/front_prueba_tecnica.git
    cd front_prueba_tecnica
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar la Interfaz:**
    ```bash
    npm run dev
    ```

### 🌐 Acceso
Una vez iniciado el servicio, la aplicación estará disponible en tu navegador en:
👉 **URL del Frontend:** `http://localhost:5173/`

---

## 💡 Funcionalidades de la Interfaz Web

El frontend cumple con los siguientes requisitos de la prueba:

1.  **Registro de Proyectos:** Formulario intuitivo para ingresar los datos de un nuevo proyecto (`nombre`, `descripción`, `estado`, `fechas`).
2.  **Listado de Proyectos:** Tabla dinámica que presenta todos los proyectos consumidos desde la API.
3.  **Gráfico Interactivo:** Muestra un gráfico de [Barras/Torta] (implementado con **Recharts**) que representa la distribución de proyectos por `estado`.
4.  **Resumen de la IA:** Sección dedicada a mostrar el texto de **análisis y resumen** de las descripciones, generado por el endpoint `/analisis` del backend.
5.  **Diseño Responsivo:** La interfaz se adapta completamente a pantallas de **desktop** y **móviles** (implementado con **Tailwind CSS**).

---
