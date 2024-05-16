import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
//Importamos useQuery para poder hacer la petición a la base de datos y traernos el proyecto
import { useQuery } from '@tanstack/react-query'
import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskList from "@/components/tasks/TaskList"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isTutora } from "@/utils/policies"
import { useMemo } from "react"

export default function ProjectDetailsView() {

    //Utilizamos el hook que creé para revisar los usuarios autenticados, para que los alumnos no puedan editar los proyectos
    const { data: user, isLoading: authLoading } = useAuth()

    //Importamos el hook de navigate
    const navigate = useNavigate()

    //Para leer los parámetros de la URL, utilizamos el useParams
    const params = useParams()
    //Creamos la variable projectId para identificar los proyectos que queremos editar
    const projectId = params.projectId!

    //Definimos el useQuery para el get del proyecto
    const { data, isLoading, isError } = useQuery({
        //Tenemos que definir un key para cada query, no se puede repetir en otra parte del código
        queryKey: ['project', projectId],
        //Definimos la función, que es el getProjectById
        //Utilizamos un arrow function porque hay que pasarle parametros, en este caso, el projectId
        queryFn: () => getFullProject(projectId),
        //Colocamos el retry para que sólo intente la consulta una vez, si no es exitosa, muestre el error
        retry: false
    })

    //Creamos la función que verificará si el usuario es tutora o alumno para poder editar las tareas
    //Utilizamos el hook useMemo
    const canEdit = useMemo(() => data?.tutora === user?._id, [data, user])
    //Si encuentra el proyecto en la base de datos
    if (isLoading && authLoading) return 'Cargando...'
    //Si no lo encuentra
    if (isError) return <Navigate to='/404' />

    //Con este código logramos que al pinchar sobre el proyecto o sobre la opción de ver proyecto, nos lleve a una sección para ver las tareas
    if (data && user) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            {isTutora(data.tutora, user._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        type="button"
                        className="bg-yellow-200 hover:bg-yellow-400 px-10 py-3 text-black text-xl font-bold cursor-pointer transition-colors rounded-lg"
                        //Definimos la url a la que queremos que nos lleve al agregar tarea
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >Agregar Tarea</button>

                    <Link
                        to={'team'}
                        className="bg-yellow-100 hover:bg-yellow-300 px-10 py-3 text-black text-xl font-bold cursor-pointer transition-colors rounded-lg"
                    >Alumnos</Link>
                </nav>
            )}

            <TaskList
                tasks={data.tasks}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )


}
