import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TestApi from './pages/TextApi'

import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-6">
        <AppRoutes />
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
