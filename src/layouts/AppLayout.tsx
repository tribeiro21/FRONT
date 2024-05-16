//Importamos el componente outlet para poder renderizar los componentes que son hijos, como el dashboard view
import { Outlet, Navigate } from "react-router-dom"
//Importamos el componente toast, que es para mostrar mensajes emergentes cuando se realiza una acción
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function AppLayout() {

    //Importamos el hook que creamos de useAuth
    const {data, isError, isLoading} = useAuth()

    //Si está cargando la página...
    if(isLoading) return 'Cargando...'
    //Si hay un error, lleva al usuario a la pantalla de login
    if(isError) {
        return <Navigate to='/auth/login' />
    }    

    if(data) return (
        <>
            <header className='bg-gray-300 py-2'>
                <div className='max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center'>
                    <div className='w-64'>
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>

                    <NavMenu
                        //Mostramos el nombre de usuario en el menú sandwich 
                        name = {data.name}
                    />
                </div>
            </header>

            <section className='max-w-screen-2xl mx-auto mt-10 ml-40'>
                <Outlet />
            </section>

            <footer className='py-5'>
                <p className='text-center'>
                    Todos los derechos reservados {new Date().getFullYear()} Desarrollado por: <p className='font-bold'>Tony Ribeiro</p>
                </p>
            </footer>

            <ToastContainer
                //Podemos personalizar el toast
                //Agregamos este para que cuando pasemos el ratón no se pause
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />

        </>
    )
}
