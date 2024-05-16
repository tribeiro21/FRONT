import React from 'react'
import ReactDOM from 'react-dom/client'
//Importamos React-Query que es una librería para hacer consultas al servidor
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
//Importamos ReactQueryDevTools para poder utilizar una herramienta que nos permita resetar las peticiones en la web y no se quede enganchada en la anterior
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import Router from './router'

//Tenemos que instanciar el QueryClient
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> 
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
)
