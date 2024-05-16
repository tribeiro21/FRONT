import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

//En este archivo está el código de la pantalla de login
//Aquí establecemos cada uno de los componentes view que utilizamos
//En los componentes es donde está el código html de cada vista
export default function AuthLayout() {
  return (
    <>
        <div className="bg-[url('/public/fondo2.jpg')] min-h-screen bg-cover h-auto w-auto">
            
            <div className='lg:py-6 mx-auto w-[450px]'>
                

                <div className='mt-0'>
                    <Outlet />
                </div>
            </div>
            
        </div>

        <ToastContainer
                //Activamos el toast para que al realizar un registro, aparezca un mensaje de confirmación
                pauseOnHover={false}
                pauseOnFocusLoss={false}
          />
    </>
  )
}
