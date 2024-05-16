import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getTaskById } from "@/api/TaskAPI"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {
    const params = useParams()
    const projectId = params.projectId!

    //Utilizamos el location para poder utilizar el query o la consulta
    const location = useLocation()
    //Con el queryParams leemos los parámetros de la consulta
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!
    
    const {data, isError} = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        //Utilizamos la función de useQuery llamada enabled
        //Nos permite indicar que si el id de la tarea existe, entonces permite editarla
        //Agregamos el !! para convertirlo en booleando, así, si existe el taskId resulta en true y sino en false
        enabled: !!taskId
    })

    //Retornamos el error 404 si la tarea no es válida
    if(isError) return <Navigate to={'/404'} />

    //Si la tarea tiene dastos (si existe) muestrame el modal donde lo vamos a editar
    //Le pasamos los datos a través del data al modal
    if(data) return <EditTaskModal data={data} taskId={taskId}/>
}
