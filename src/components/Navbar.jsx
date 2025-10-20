import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, BarChart3, TrendingUp, Menu, X } from "lucide-react";

export default function Navbar() {
    const location = useLocation();
    const [menuAbierto, setMenuAbierto] = useState(false);
    
    const navItems = [
        { path: "/", label: "Inicio", icon: LayoutDashboard },
        { path: "/formulario", label: "Formulario", icon: FileText },
        { path: "/grafico", label: "Gráficos", icon: BarChart3 }
    ];

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setMenuAbierto(!menuAbierto);

    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo/Título */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Gestor de Proyectos
                        </h1>
                    </div>

                    {/* Links de navegación - Desktop */}
                    <ul className="hidden md:flex gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-lg
                                            transition-all duration-300 ease-in-out
                                            ${active 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50 scale-105' 
                                                : 'hover:bg-slate-700 hover:shadow-md hover:scale-105'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Botón hamburguesa - Móvil */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuAbierto ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Menú móvil desplegable */}
                {menuAbierto && (
                    <div className="md:hidden mt-4 pt-4 border-t border-slate-700">
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={cerrarMenu}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg
                                                transition-all duration-300 ease-in-out
                                                ${active 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                                                    : 'hover:bg-slate-700'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium text-base">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}