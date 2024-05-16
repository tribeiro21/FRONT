import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { createTask } from '@/api/TaskAPI';
import {toast} from 'react-toastify'

export default function AddTaskModal() {

    //Importamos el navigate
    const navigate = useNavigate()

    /***************LEER SI EL MODAL EXISTE */
    //Para leer de la URL
    const location = useLocation()
    //Par que busque en la URL los parámetros al agregar tarea
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    //Si le das click a agregar tarea, muestrame el modal (ventana emergente) sino, no lo muestres
    const show = modalTask ? true : false

    /***************OBTENER projectId */
    const params = useParams()
    const projectId = params.projectId!

    //Definimos los valores iniciales del formulario de agregar tarea
    const initialValues : TaskFormData = {
        name: '',
        description: ''
    }

    const {register, handleSubmit, reset, formState: {errors}} = useForm({defaultValues:initialValues})

    //Definimos el queryClient para que al agregar una tarea, se muestre enseguida sin necesidad de recargar
    const queryClient = useQueryClient()

    //Definimos con el useMutate la nueva tarea
    const {mutate} = useMutation({
        mutationFn: createTask,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        //Tenemos que pasar aquí el queryClient
        queryClient.invalidateQueries({queryKey: ['project', projectId]})
        toast.success(data)
        //El reset lo usamos para que se resetee el formulasio de las tareas
        reset()
        //Y para que se oculte el modal dinámico después de agregar la tarea
        navigate(location.pathname, {replace:true})
    }
})

    const handleCreateTask = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace:true})}>
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
                                        Nueva Tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-yellow-600">una tarea</span>
                                    </p>

                                    <form
                                        className='mt-10 space-y-3'
                                        onSubmit={handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                        <TaskForm 
                                            register={register}
                                            errors={errors}
                                        />

                                        <input
                                            type="submit"
                                            value='Guardar tarea'
                                            className="bg-blue-400 hover:bg-blue-600 w-full p-3 text-black uppercase font-bold cursor-pointer transition-colors rounded-lg"
                                        />
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}