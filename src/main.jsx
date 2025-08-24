import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TodoListPage from './pages/TodoListPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoListPage />
  </StrictMode>,
)
