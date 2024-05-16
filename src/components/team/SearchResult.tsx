//Este componente lo utilizamos para mostrar el resultado cuando buscamos un alumno por el email para agregarlo a un proyecto
import { addUserToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

//Definimos el tipo del resultado
type SearchResultProps = {
    user: TeamMember
    //Le decimos que el reset para resetear el formulario de agregar un alumno, no retorna nada
    reset: () => void
}

export default function SearchResult({user, reset}: SearchResultProps) {
  
  //Con el navigate cerramos el modal cuando se agrega correctamente un alumno al proyecto
  const navigate = useNavigate()
  const params = useParams()
  //Tenemos que crear la variable del proyecto al cual se va a agregar un alumno
  const projectId = params.projectId!

  //Utilizamos el queryClient para invalidar los querys, es decir, para que al eliminar o agregar un alumno, se refleje automáticamente en la pantalla
  const queryClient = useQueryClient()
  //Con el useMutation agregamos el alumno al proyecto
  const {mutate} = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      //Una vez que agregamos al alumno, llamamos a la función que resetea el campo
      reset()
      //Además de resetar el formulario, cerramos el modal
      navigate(location.pathname, {replace: true})
      //Después de agregar al alumno, invalido los querys y que se muestre automáticamente en la vista
      queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
    }
  })

  //Función que utilizará el botón de agregar alumno al proyecto
  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id
    }
    mutate(data)
  }
  
  return (
    <>
        <p className="mt-10 text-center font-bold">Resultado:</p>
        <div className="flex justify-between items-center">
            <p>{user.name}</p>
            <button
                className="text-yellow-500 hover:bg-yellow-100 px-10 py-3 font-bold cursor-pointer rounded-lg"
                onClick={handleAddUserToProject}
            >Agregar al Proyecto</button>
        </div>
    </>
  )
}
