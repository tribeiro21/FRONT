import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types";

//Aquí manejamos las peticiones de el registro de usuarios hacia la API
export async function createAccount(formData: UserRegistrationForm) {
    try{
        //Especificamos cual es la ruta url donde se hará el registro
        const url = '/auth/create-account'
        //La petición post del nuevo usuario a la base de datos
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para confirmar el token
export async function confirmAccount(formData: ConfirmToken) {
    try{
        //Especificamos cual es la ruta url donde se confirma el token
        const url = '/auth/confirm-account'
        //La petición post del nuevo usuario a la base de datos
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para solicitar un nuevo token
export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
    try{
        //Especificamos cual es la ruta url donde se confirma el token
        const url = '/auth/request-code'
        //La petición post del nuevo usuario a la base de datos
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para realizar el login
export async function authenticateUser(formData: UserLoginForm) {
    try{
        //Especificamos cual es la ruta url donde se confirma el token
        const url = '/auth/login'
        //La petición post del nuevo usuario a la base de datos
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        //Guardamos el token utilizando LocalStorage
        localStorage.setItem('AUTH_TOKEN', data)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para generar el token del olvido de contraseña
export async function forgotPassword(formData: ForgotPasswordForm) {
    try{
        //Especificamos cual es la ruta url donde se confirma el token
        const url = '/auth/forgot-password'
        //La petición post del nuevo usuario a la base de datos
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para validar el token del olvido de contraseña
export async function validateToken(formData: ConfirmToken) {
    try{
        //Especificamos cual es la ruta url donde se confirma el token
        const url = '/auth/validate-token'
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para actualizar la contraseña
export async function updatePasswordWithToken({formData, token} : {formData: NewPasswordForm, token: ConfirmToken['token']}) {
    try{
        //Especificamos cual es la ruta url donde se actualiza la contraseña
        //Como es una url dinámica, hay que utilizar template strings
        const url = `/auth/update-password/${token}`
        //Le decimos que va a tomar los datos del formulario que están en la URL que acabamos de poner
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Definimos la función donde se verá la sesión del usuario autenticado
export async function getUser(){
    try{
        const {data} = await api('/auth/user')
        const response = userSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}

//Función para chequear la contraseña y poder eliminar un proyecto
export async function checkPassword(formData : CheckPasswordForm) {
    try{
        const url = '/auth/check-password'
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error){
        if(isAxiosError(error) && error.message){
            throw new Error(error.response?.data.error)
        }
    }
}