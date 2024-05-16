import { Fragment } from 'react'
import { TaskProject } from "@/types/index"
//Importamos headlesui para utilizar las transiciones y el menú
import { Menu, Transition } from '@headlessui/react'
//Importamos el icono elipsisiverticalicon de la librería de íconos
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import {useDraggable} from '@dnd-kit/core'


type TaskCardProps = {
    task: TaskProject
    canEdit: boolean
}

export default function TaskCard({ task, canEdit }: TaskCardProps) {

    //Utilizamos el hook useDraggable que nos permite la función de arrastrar y soltar tareas
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task._id
    })
    //Importamos el hook de useNavigate que nos permite navegar sobre las url
    const navigate = useNavigate()
    //Creamos la variable de los parámetros de la tarea, nos servirá para eliminar tareas
    const params = useParams()
    //Primero tenemos que comprobar que existe el proyecto de esa tarea
    const projectId = params.projectId!

    //Utilizamos el queryClient para que al eliminar la tarea desaparezca de inmediato de la interfaz sin tener que recargar
    const queryClient = useQueryClient()

    //A través de la función del mutate, permitimos ejecutar la función de deleteTask definido en la API
    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            //Con esto logramos que al eliminar la tarea, ivalidamos el query anterior y desaparezca enseguida de la pantalla
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
    })

    //Tranformamos el estilo cuando aplicamos el draggable a las tareas
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        padding: "1.25rem",
        backgroundColor: '#FFF',
        width: '300px',
        display: 'flex',
        borderWidth: '1px',
        borderRadius: '10px',
        borderColor: 'rgb(203 213 225 / var(--tw--border-opacity))'
    } : undefined

    return (
        //Creamos una lista para mostrar las tareas
        //El primer div son los estilos de los detalles de las tareas (nombre y descripción)
        //El segundo div es el menú donde podemos realizar acciones sobre las tareas
        <li className="p-5 bg-white border border-slate-400 flex justify-between gap-3 rounded-xl">
            <div 
            //En estas tres líneas, utilizamos la librería draggable en este div
            {...listeners}
            {...attributes}
            ref={setNodeRef}
            style={style}
            className="min-w-0 flex flex-col gap-y-4">
                <p
                    className="text-xl font-bold text-slate-700 text-left"
                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                >{task.name}</p>
                <p className="text-slate-500">{task.description}</p>
            </div>

            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                                <button
                                    type='button'
                                    className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                                >
                                    Ver Tarea
                                </button>
                            </Menu.Item>

                            {canEdit && (
                                <>
                                    <Menu.Item>
                                        <button
                                            type='button'
                                            className='block px-3 py-1 text-sm leading-6 text-gray-900'
                                            //Utilizamos el onClick para poder decirle que al darle click en editar, reconozca el id de la tarea
                                            onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                        >
                                            Editar Tarea
                                        </button>
                                    </Menu.Item>

                                    <Menu.Item>
                                        <button
                                            type='button'
                                            className='block px-3 py-1 text-sm leading-6 text-red-500'
                                            //Dentro del onClick, le decimos que a través de la mutación que definimos arriba para eliminar tareas, la elimine
                                            onClick={() => mutate({ projectId, taskId: task._id })}
                                        >
                                            Eliminar Tarea
                                        </button>
                                    </Menu.Item>
                                </>
                            )}

                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </li>
    )
}
