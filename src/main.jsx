import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { DataProvider } from './context/DataContext'
import './firebase'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
)
