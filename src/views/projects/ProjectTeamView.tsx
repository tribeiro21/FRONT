import { Fragment } from "react/jsx-runtime"
import {Menu, Transition} from '@headlessui/react'
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import AddMemberModal from "@/components/team/AddMemberModal"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI"
import { toast } from "react-toastify"

//Este archivo es para la vista donde se agregan los alumnos a cada proyecto
export default function ProjectTeamView() {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    //Con el useQuery vamos a mostrar los miembros de un proyecto
    const { data, isLoading, isError } = useQuery({
        //La clave será el equipo de trabajao y el id del proyecto
        queryKey: ['projectTeam', projectId],
        queryFn: () => getProjectTeam(projectId),
        //Si no encuentra ningún alumno, no siga intentandolo
        retry: false
    })

    //Utilizamos el queryClient para invalidar los querys, es decir, para que al eliminar o agregar un alumno, se refleje automáticamente en la pantalla
    const queryClient = useQueryClient()
    //Con el mutate utilizamos la función de eliminar un alumno de un proyecto
    const {mutate} = useMutation({
        mutationFn: removeUserFromProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            //Después de eliminar al alumno, invalido los querys para que se elimine automáticamente de la vista
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    //Mientras busca el equipo de alumnos mostrar:
    if (isLoading) return 'Cargando...'
    //Si no encuentra nada
    if (isError) return <Navigate to={'/404'} />
    if (data) return (
        <>
            <h1 className="text-5xl font-black">Administrar Alumnos</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Administra los alumnos asignados a este proyecto</p>

            <nav className="my-5 flex gap-3">
                <button
                    type="button"
                    className="bg-yellow-200 hover:bg-yellow-400 px-10 py-3 text-black text-xl font-bold cursor-pointer transition-colors rounded-lg"
                    //Definimos la url a la que queremos que nos lleve al agregar tarea
                    onClick={() => navigate(location.pathname + '?addMember=true')}
                >Agregar Alumno</button>

                <Link
                    to={`/projects/${projectId}`}
                    className="bg-yellow-100 hover:bg-yellow-300 px-10 py-3 text-black text-xl font-bold cursor-pointer transition-colors rounded-lg"
                >Volver al Proyecto</Link>
            </nav>

            <h2 className="text-4xl font-black my-10">Alumnos en el Proyecto</h2>
            {data.length ? (
                <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg rounded-lg mr-16">
                    {data?.map((member) => (
                        <li key={member._id} className="flex justify-between gap-x-6 px-5 py-10">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto space-y-2">
                                    <p className="text-2xl font-black text-gray-600">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {member.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6">
                                <Menu as="div" className="relative flex-none">
                                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                        <span className="sr-only">opciones</span>
                                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            <Menu.Item>
                                                <button
                                                    type='button'
                                                    className='block px-3 py-1 text-sm leading-6 text-red-500'
                                                    onClick={() => mutate({projectId, userId: member._id})}
                                                >
                                                    Eliminar del Proyecto
                                                </button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-center py-20'>No hay alumnos asignados a este proyecto</p>
            )}

            <AddMemberModal />

        </>
    )
}
