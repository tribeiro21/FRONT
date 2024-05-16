import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/AuthAPI";

//En este archivo creamos un hook personalizado para obtener el usuario autenticado
//Utilizaremos este hook cada vez que necesitemos autenticar al usuario para realizar alguna acción en la aplicación
export const useAuth = () => {
    const {data, isError, isLoading} = useQuery({
        //La llave es el usuario
        queryKey: ['user'],
        //Y la función getUser que definimos en AuthAPI.ts
        queryFn: getUser,
        //Tarda 1 segundo en reintentar el acceso y devolver al usuario al login
        retry: 1,
        //Para que lo haga en la misma pestaña
        refetchOnWindowFocus: false
    })

    return {data, isError, isLoading}
}