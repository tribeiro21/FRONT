import { Link } from "react-router-dom";
//Importamos la dependencia chakra que nos permite agregar un input especial para que el usuario introduzca el código de confirmación de cuenta
//Utilizaremos el PinInput y el PinInputField
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')

    //Con el hook de useMutation cofirmamos el token
    const {mutate} = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    //Con esta función, lo que hacemos es garantizar que se guarda en el state cada dígito del token
    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }

    //Con esta función, al escribir el último dígito, le decimos al sistema que ya esta completado
    const handleComplete = (token: ConfirmToken['token']) => mutate({token})

    return (
        <>
            <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que recibiste {''}
                <span className=" text-yellow-400 font-bold"> por e-mail</span>
            </p>
            <form
                className="space-y-8 p-1 mt-10 rounded-xl bg-slate-400"
            >
                <label
                    className="font-normal text-2xl text-center block"
                >Código de 6 dígitos</label>
                <div className='flex justify-center gap-5'>
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="w-10 h-10 mb-4 p-3 rounded-lg border-gray-300 border placeholder-white bg-slate-400" />
                        <PinInputField className="w-10 h-10 mb-4 p-3 rounded-lg border-gray-300 border placeholder-white bg-slate-400" />
                        <PinInputField className="w-10 h-10 mb-4 p-3 rounded-lg border-gray-300 border placeholder-white bg-slate-400" />
                        <PinInputField className="w-10 h-10 mb-4 p-3 rounded-lg border-gray-300 border placeholder-white bg-slate-400" />
                        <PinInputField className="w-10 h-10 mb-4 p-3 rounded-lg border-gray-300 border placeholder-white bg-slate-400" />
                        <PinInputField className="w-10 h-10 mb-4 p-3 rounded-lg border-gray-300 border placeholder-white bg-slate-400" />
                    </PinInput>
                </div>

            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/request-code'
                    className="text-center text-gray-300 font-normal"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>

        </>
    )
}