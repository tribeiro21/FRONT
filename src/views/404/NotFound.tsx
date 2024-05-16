import { Link } from "react-router-dom";
//Esta vista es para mostrar un error al usuario cuando algo vaya mal
export default function NotFound() {
  return (
    <>
        <h1 className="font-bold text-center text-5xl text-white">Página No Encontrada</h1>
        <p className="mt-10 text-center text-white text-4xl">
            Vuelve a tus {' '}
            <Link className="text-yellow-500" to={'/'}>Proyectos</Link>
        </p>
    </>
  )
}
