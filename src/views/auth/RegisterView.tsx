import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createAccount } from "@/api/AuthAPI";

export default function RegisterView() {
  
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  //Con el hook de useMutation, creamos el nuevo usuario y lo registramos en la base de datos
  const {mutate} = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      //Limpiamos el formulario luego de que se registre el usuario
      reset()
    }
  })

  //Con la función watch confirmamos que las 2 contraseñas al realizar el registro, sena iguales
  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

  return (
    <>
      <h1 className="text-5xl font-black text-gray-400 ml-16">Crear Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5 ml-16">
        Llena el formulario para {''}
        <span className=" text-yellow-400 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-1 p-6 bg-none mt-0"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-white text-2xl"
            htmlFor="email"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Introduce un email"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("email", {
              required: "El Email de registro es obligatorio",
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
          >Nombre</label>
          <input
            type="name"
            placeholder="Introduce tu nombre"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-white text-2xl"
          >Contraseña</label>

          <input
            type="password"
            placeholder="Introduce la contraseña"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: 'El Password debe ser mínimo de 8 caracteres'
              }
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-bold text-white text-2xl"
          >Repetir Contraseña</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite la Contraseña"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: value => value === password || 'Los Passwords no son iguales'
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Registrarme'
          className="bg-yellow-300 hover:bg-yellow-400 w-full p-2  text-white font-black  text-xl cursor-pointer rounded-lg"
        />
      </form>

      <nav className="mt-0 flex flex-col space-y-0">
          <Link
            to={'/auth/login'}
            className="text-center text-gary-300 font-normal text-white"
          >Ya tienes cuenta? Inicia Sesión
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