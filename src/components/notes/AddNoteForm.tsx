import { NoteFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createNote } from '@/api/NoteAPI'
import { useLocation, useParams } from 'react-router-dom'

export default function AddNoteForm() {

    //Utilizamos el hook useParams para traernos el id del proyecto al que pertenece la nota
    const params = useParams()
    //Utilizamos el hook useLocation para traernos el id de la tarea a la que pertenece la nota
    const location = useLocation()

    //Utilizamos el queryparams para buscar la url de la nota
    const queryParams = new URLSearchParams(location.search)

    //Buscamos el id del proyecto con el params
    const projectId = params.projectId!

    //Buscamos el id de la tarea con el queryparams
    const taskId = queryParams.get('viewTask')!

    //Definimos los valores iniciales para agregar a las notas
    const initialValues : NoteFormData = {
        content: ''
    }

    //Utilizamos el hook useForm para el formulario de las notas
    const {register, handleSubmit, reset, formState: {errors}} = useForm({defaultValues: initialValues})

    //Utilizamos el queryclient para invalidar los queries y que se vea la nota inmediatamente al agregarla
    const queryClient = useQueryClient()
    //Con el uso de mutate utilizamos la función createNote de la API de notes
    const {mutate} = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            //Invalidamos el query para que se muestre inmediatamente la nota
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    const handleAddNote = (formData: NoteFormData) => {
        mutate({projectId, taskId, formData})
        reset()
    }

    return (
        <form
            onSubmit={handleSubmit(handleAddNote)}
            className="space-y-3"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="content">Agregar Nota</label>
                <input
                    id="content"
                    type="text"
                    placeholder="Descripción de la nota"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    {...register('content', {
                        required: 'El contenido de la nota es obligatorio'
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>

            <input
                type="submit"
                value='Agregar Nota'
                className="bg-yellow-400 hover:bg-yellow-500 w-full p-2 text-white font-balck cursor-pointer rounded-lg"
            />
        </form>
    )
}
