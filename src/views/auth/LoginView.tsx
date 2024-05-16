import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  //Utilizamos el Navigate para llevar al usuario a su panel de control al iniciar sesión
  const navigate = useNavigate()

  //Definimos el mutation para el login del usuario
  const {mutate} = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <h1 className="text-5xl font-black text-gray-400 ml-16">Iniciar Sesión</h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-none"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl text-white"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Introduce tu email"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-2xl text-white"
          >Password</label>

          <input
            type="password"
            placeholder="Introduce la contraseña"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-yellow-300 hover:bg-yellow-400 w-full p-3  text-white font-black  text-xl cursor-pointer rounded-lg"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
          <Link
            to={'/auth/register'}
            className="text-center text-gary-300 font-normal text-white"
          >¿No tienes cuenta? Crear Una
          </Link>

          <Link
            to={'/auth/forgot-password'}
            className="text-center text-gary-300 font-normal text-white"
          >¿Olvidaste tu contraseña? Reestablecer
          </Link>
      </nav>

    </>
  )
}