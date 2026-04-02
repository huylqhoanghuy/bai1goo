import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { DataProvider } from './context/DataContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import './firebase'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DataProvider>
        <App />
      </DataProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
