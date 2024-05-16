import { Navigate, useParams } from "react-router-dom"
//Importamos useQuery para poder hacer la petición a la base de datos y traernos el proyecto
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function EditProjectView() {
    //Para leer los parámetros de la URL, utilizamos el useParams
    const params = useParams()
    //Creamos la variable projectId para identificar los proyectos que queremos editar
    const projectId = params.projectId!

    //Definimos el useQuery para el get del proyecto
    const {data, isLoading, isError} = useQuery({
    //Tenemos que definir un key para cada query, no se puede repetir en otra parte del código
        queryKey: ['editProject', projectId],
        //Definimos la función, que es el getProjectById
        //Utilizamos un arrow function porque hay que pasarle parametros, en este caso, el projectId
        queryFn: () => getProjectById(projectId),
        //Colocamos el retry para que sólo intente la consulta una vez, si no es exitosa, muestre el error
        retry: false
    })

    //Si encuentra el proyecto en la base de datos
    if(isLoading) return 'Cargando...'
    //Si no lo encuentra
    if(isError) return <Navigate to='/404' />
    
    //Muestrame el formulario para editar, si consigue el proyecto en la base de datos
    //Colocamos el data={data} para que al editar me muestre en los campos con los valores que ya estaban
    if(data) return <EditProjectForm data={data} projectId={projectId}/>
  
}
