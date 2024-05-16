import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { updateTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

//Hay que definir el Task en el data
type EditTaskModalProps = {
    data: Task
    taskId: Task['_id']
}

export default function EditTaskModal({data, taskId} : EditTaskModalProps) {
//Definimos la función navigate para poder utilizarla en el onClose y cerrar el modal al darle click fuera
const navigate = useNavigate()

/***************OBTENER projectId */
const params = useParams()
const projectId = params.projectId!

const {register, handleSubmit, reset, formState: {errors}} = useForm<TaskFormData>({defaultValues: {
    name: data.name,
    description: data.description
}})

//Hay que definir la función queryClient
const queryClient = useQueryClient()

// Con la funcón de mutation, permitimos que la petición de la API de updateTask funcione
const {mutate} = useMutation({
    mutationFn: updateTask,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        //Tenmos que pasar aquí el queryClient
        queryClient.invalidateQueries({queryKey: ['project', projectId]})
        queryClient.invalidateQueries({queryKey: ['task', taskId]})
        toast.success(data)
        //El reset lo usamos para que se resetee el formulario de las tareas
        reset()
        //Y para que se oculte el modal dinámico después de agregar la tarea
        navigate(location.pathname, {replace:true})
    }
})

const handleEditTask = (formData: TaskFormData) => {
    //Definimos los datos que va a tomar de la tarea que vamos a editar y le pasamos el formulario que debe utilizar
    const data = {
        projectId,
        taskId,
        formData
    }
    mutate(data)
}

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Editar Tarea
                                </Dialog.Title>

                                <p className="text-xl font-bold">Realiza cambios a una tarea en {''}
                                    <span className="text-fuchsia-600">este formulario</span>
                                </p>

                                <form
                                    className="mt-10 space-y-3"
                                    onSubmit={handleSubmit(handleEditTask)}
                                    noValidate
                                >
                                    <TaskForm 
                                        register={register}
                                        errors={errors}
                                    />


                                    <input
                                        type="submit"
                                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Guardar Tarea'
                                    />
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}