//Utilizamos axios para conectarnos a nuestra API (base de datos)
import axios from 'axios'

const api = axios.create({
    //Importamos la variable de entorno que definimos en el archivo ".env.local"
    //Así, nos garantizamos que todas nuestras peticiones tengan una URL base
    //Nuestra URL base será http://localhost:4000/api y las peticiones que hagamos, cada ruta debe empezar con /
    baseURL: import.meta.env.VITE_API_URL
})

//Utilizamos los interceptors de axios, que nos permiten validar al usuario para que pueda realizar cualquier acción sobre los proyectos
api.interceptors.request.use( config => {
    //Tenemos que definir el token de autenticación para el usuario para obtener los proyectos
    const token = localStorage.getItem('AUTH_TOKEN')
    //Si el token existe
    if(token) {
        //Le pasamos el bearer para la auth y el token
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api