import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import {Note} from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
  note: Note
}

export default function NoteDetail({note} : NoteDetailProps) {

  //Utilizamos el hook useAuth porque tenemos que validar que el usuario que va a eliminar una nota sea quien la creó
  const {data, isLoading} = useAuth()
  //Creamos la función donde se pueden eleiminar las notas
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

  //Definimos los params y la variable projectId porque son los valores que utiliza el query para la petición
  const params = useParams()
  //Utilizamos el hook useLocation para poder obener el proyecto y verlo en pantalla
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const projectId = params.projectId!  
  const taskId = queryParams.get('viewTask')!

  //Utilizamos el queryclient para invalidar los queris
  const queryClient = useQueryClient()
  //Utilizamos el mutate para eliminar efectivamente la nota de la base de datos
  //Con la función deleteNote que definimos en NoteAPI
  const {mutate} = useMutation({
    mutationFn: deleteNote,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({queryKey: ['task', taskId]})
    }
  })

  if (isLoading) return 'Cargando...'

  return (
    //Contenedor donde se van a mostrar todas las notas
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">
          {formatDate(note.createdAt)}
        </p>
      </div>

      {canDelete && (
        <button
          type="button"
          className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors rounded-lg"
          onClick={() => mutate({projectId, taskId, noteId: note._id})}
        >Eliminar</button>
      )}
    </div>
  )
}
