import { isAxiosError } from "axios";
import { Project, ProjectFormData, dashboardProjectSchema, editProjectSchema, projectSchema } from "../types";
import api from "@/lib/axios";

export async function createProject(formData: ProjectFormData){
    try{
        //Le decimos cual es la ruta donde se crea el proyecto
        const {data} = await api.post('/projects', formData)
        return data
    //Y en caso de haber error
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }   
    }
}

//Función para obtener los proyectos de la base de datos y mostrarlos en pantalla
export async function getProjects(){
    try{
        //Le decimos cual es la ruta donde se crea el proyecto
        //Es un get, pero no es necesario colocarlo porque en Axios, la petición por defecto es el get
        const {data} = await api('/projects')
        //Definimos una variable para el esquema del get projects definido en index.ts
        const response = dashboardProjectSchema.safeParse(data)
        //Si es cierto que hay una respuesta
        if(response.success){
            //Devuleve los datos
            return response.data
        }
    //Y en caso de haber error
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }   
    }
}

//Función para editar un proyecto de la base de datos
export async function getProjectById(id: Project['_id']){
    try{
        //Le decimos cual es la ruta donde se edita el proyecto
        //Es un get, pero no es necesario colocarlo porque en Axios, la petición por defecto es el get
        const {data} = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    //Y en caso de haber error
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }   
    }
}

//Función para ver la información de un proyecto en el panel
export async function getFullProject(id: Project['_id']){
    try{
        //Le decimos cual es la ruta donde se edita el proyecto
        //Es un get, pero no es necesario colocarlo porque en Axios, la petición por defecto es el get
        const {data} = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    //Y en caso de haber error
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }   
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['_id']
}

//Función para guardar cambios de un proyecto de la base de datos
export async function updateProject({formData, projectId} : ProjectAPIType){
    try{
        //Le decimos cual es la ruta donde se edita el proyecto
        //Es un put
        const {data} = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    //Y en caso de haber error
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }   
    }
}

//Función para eliminar un proyecto de la base de datos
export async function deleteProject(id: Project['_id']){
    try{
        //Le decimos cual es la ruta donde se elimina el proyecto
        const url = `/projects/${id}`
        //Lo convertimos a string el id, para que lo lea correctamente
        const {data} = await api.delete<string>(url)
        return data
    //Y en caso de haber error
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }   
    }
}