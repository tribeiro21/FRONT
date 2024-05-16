//Importamos el hook useState que nos permitirá validar si el token que introduce el usuario es válido
import { useState } from "react"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { ConfirmToken } from "@/types/index"

export default function NewPasswordView() {
    //Confirmamos el token
    const [token, setToken] = useState<ConfirmToken['token']>('')
    //Del hook useState, utilizamos el isvalidtoken y setisvalidtoken
    const [isValidToken, setIsValidToken] = useState(false)

  return (
    <>
        <h1 className="text-5xl font-black text-gray-400 ml-16">Reestablecer contraseña</h1>
        <p className="text-2xl font-light text-white mt-5 ml-10">
            Introduce el código que recibiste {''}
            <span className=" text-yellow-400 font-bold"> por email</span>
        </p>

        {!isValidToken ? 
          <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> : 
          <NewPasswordForm token={token} />
        }
    </>
  )
}
