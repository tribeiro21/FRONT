import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
//Importamos LINK para usarlo en enlaces
import { Link, useLocation, useNavigate } from "react-router-dom"
//Importamos useQuery de la documentación de tanstack
import { useQuery } from '@tanstack/react-query'
import { getProjects } from "@/api/ProjectAPI"
import { useAuth } from '@/hooks/useAuth'
import { isTutora } from '@/utils/policies'
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'

export default function DashboardView() {

  const location = useLocation()
  const navigate = useNavigate()
  //Utilizamos el hook que creé para revisar los usuarios autenticados, para que los alumnos no puedan editar los proyectos
  const { data: user, isLoading: authLoading } = useAuth()
  //Definimos el useQuery para el get de los proyectos
  const { data, isLoading } = useQuery({
    //Tenemos que definir un key para cada query, no se puede repetir en otra parte del código
    queryKey: ['projects'],
    //Definimos la función, que es el getProjects
    queryFn: getProjects
  })

  if (isLoading && authLoading) return 'cargando...'

  if (data && user) return (
    <>
      <h1 className="text-3xl font-black">Proyectos</h1>
      <p className="text 2xl font-light text-gray-500 mt-5">Administrar Proyectos</p>
      <nav className="my-5">
        <Link
          className="bg-yellow-200 hover:bg-yellow-400 px-10 py-3 text-black text-xl font-bold cursor-pointer transition-colors rounded-lg"
          to='/projects/create'
        >Nuevo Proyecto</Link>
      </nav>

      {data.length ? (
        //Desde aquí, mostramos los proyectos que existen en la base de datos
        //Estos son los estilos de las vistas de cada proyecto
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg mr-40 rounded-lg">
          {data.map((project) => (
            <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <div className='mb-2'>
                    {isTutora(project.tutora, user._id) ?
                      <p className='font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5'>Tutora</p> :
                      <p className='font-bold text-xs uppercase bg-yellow-50 text-yellow-500 border-2 border-yellow-500 rounded-lg inline-block py-1 px-5'>Alumno</p>
                    }
                  </div>
                  <Link to={`/projects/${project._id}`}
                    className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                  >{project.projectName}</Link>
                  <p className="text-sm text-gray-400">
                    Aula: {project.aulaName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </Menu.Button>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <Menu.Item>
                        <Link to={`/projects/${project._id}`}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Ver Proyecto
                        </Link>
                      </Menu.Item>

                      {isTutora(project.tutora, user._id) && (
                        <>
                          <Menu.Item>
                            <Link to={`/projects/${project._id}/edit`}
                              className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                              Editar Proyecto
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              type='button'
                              className='block px-3 py-1 text-sm leading-6 text-red-500'
                              onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                            >
                              Eliminar Proyecto
                            </button>
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
        //A partir de aquí, mostramos cuando no hay proyectos en la base de datos
      ) : (
        <p className="text-center py-20">No hay proyectos aún {''}
          <Link
            to='/projects/create'
            className="text-yellow-500 font-bold"
          >Crear Proyecto</Link>
        </p>
      )}

      <DeleteProjectModal />
    </>
  )
}
