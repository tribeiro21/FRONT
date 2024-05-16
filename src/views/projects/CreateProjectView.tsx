//Esta es la página para crear nuevos proyectos
//Importamos Link para utilizar los links y enlaces
import {Link, useNavigate} from "react-router-dom"
//Importamos el hook useForm para poder crear formularios de forma fácil
import {useForm} from 'react-hook-form'
//Importamos useMutation para realizar cambios en nuestars bases de datos
import {useMutation} from '@tanstack/react-query'
//Importamos la función toast
import {toast} from 'react-toastify'
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import {createProject} from "@/api/ProjectAPI"

export default function CreateProjectView() {
  
  //Instanciamos el hook de navigate
  const navigate = useNavigate()

  //Aquí tenemos que especificar los campos del formulario, que son los mismos que utilizamos en el json de la base de datos de crear proyecto  
  const initialValues : ProjectFormData = {
    projectName: "",
    aulaName: "",
    description: ""
  }
  
  
    //El register nos permite registrar, el handleSubmit es para validaciones y el formSate es para los errores en el formulario  
  const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})  

  //Definimos la funcion mutation para poder hacer cambios de tipo post, put, etc en las bases de datos
  //En este caso, en crear un proyecto
  const {mutate} = useMutation({
    //A la funcion le pasamos lo que queremos hacer, en este caso, crear un proyecto
    mutationFn: createProject,
    //Si hay un error:
    onError: (error) => {
        //Mostramos el error con un toast
        toast.error(error.message)
    },
    //Si todo esta bien:
    onSuccess: (data) => {
      toast.success(data)
      //Después de crear el proyecto, lo redireccionamos a la página principal
      navigate('/')
    }
  })

  //Esta es la función del formulario que vamos a pasar en el <form> luego de pasar la validación con el handleSubmit
  const handleForm = (formData : ProjectFormData) => mutate(formData)

  return (
    <>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black">Crear Proyecto</h1>
            <p className="text 2xl font-light text-gray-500 mt-5">Rellena los campos para crear un proyecto</p>

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
                    value='Crear Proyecto'
                    className="bg-blue-400 hover:bg-blue-600 w-full p-3 text-black uppercase font-bold cursor-pointer transition-colors rounded-lg"
                />
            </form>
        </div>
    </>
  )
}
