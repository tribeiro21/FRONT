import ProjectForm from './ProjectForm'
import { Link, useNavigate } from 'react-router-dom'
import { Project, ProjectFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
//Importamos la mutación para poder editar datos
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'

//Queremos que los campos a editar sean los que definimos en el schema
type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    //Utilizamos el hook de navigate para poder redireccionar la url
    const navigate = useNavigate()
    
    //El register nos permite registrar, el handleSubmit es para validaciones y el formSate es para los errores en el formulario  
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: {
        //Aquí tenemos que especificar los campos del formulario, que son los mismos que utilizamos en el json de la base de datos de crear proyecto
        projectName: data.projectName,
        aulaName: data.aulaName,
        description: data.description
    }})

    //Utilizamos el queryClient para eliminar los datos de la consulta previa y que realice una nueva consulta
    const queryClient = useQueryClient()
    //Definimos la función para guardar los datos del proyecto editado en la base de datos
    const {mutate} = useMutation({
        mutationFn: updateProject,
        //En caso de haber error
        onError: (error) => {
            toast.error(error.message)
        },
        //Si no hay error
        onSuccess: (data) => {
            //Con este queryCliente.invalidate inválidamos los datos de la petición anterior y realizamos una nueva petición
            //Sirve para cuando se actualizan los proyectos, queden registrados los cambios nuevos y no se quede en el dato anterior
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }
    })
    
    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black">Editar Proyecto</h1>
                <p className="text 2xl font-light text-gray-500 mt-5">Rellena los campos para editar el proyecto</p>
    
                <nav className="my-5">
                    <Link
                    className="bg-yellow-200 hover:bg-yellow-400 px-10 py-3 text-black text-xl font-bold cursor-pointer transition-colors rounded-lg"
                    to='/'
                    >Volver a Proyectos</Link>
                </nav>
    
                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    //Para que no utilcie la validación de html5, sino la nuestra
                    noValidate
                >
    
                    <ProjectForm 
                        //Pasamos los Props de las variables
                        register={register}
                        errors={errors}
                    />
    
                    <input
                        type="submit"
                        value='Guardar cambios'
                        className="bg-blue-400 hover:bg-blue-600 w-full p-3 text-black uppercase font-bold cursor-pointer transition-colors rounded-lg"
                    />
                </form>
            </div>
        </>
      )
}
