import {isAxiosError} from "axios";
import api from "@/lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";

//Definimos el tipo de valor de cada parámetro que le pasamos a la función createTask
type TaskAPI = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
    status: Task['status']
}

//Función para crear la tarea, tenemos que pasarle los parámetros formData y projectId
export async function createTask({formData, projectId} : Pick<TaskAPI, 'formData'|'projectId'>)
{
    try{
        //Definimos la url donde se crean las tareas, con el id del proyecto dinámico
        const url = `/projects/${projectId}/tasks`
        const {data} = await api.post<string>(url, formData)
        return data
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }    
    }
}

//Creamos la función para obtener la tarea por su id
//Tenemos que pasarle como parámetros, el id del proyecto al que pertenece la tarea y el id de la tarea
export async function getTaskById({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>){
    try{
        //Le pasamos la url de la petición de editar tarea que creamos en el backend
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api(url)
        const response = taskSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }    
    }
}

//Función para editar las tareas
export async function updateTask({projectId, taskId, formData} : Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>){
    try{
        //Le pasamos la url de la petición de editar tarea que creamos en el backend
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api.put<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }    
    }
}

//Función para eliminar una tarea
export async function deleteTask({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>){
    try{
        //Le pasamos la url de la petición de eliminar tarea que creamos en el backend
        const url = `/projects/${projectId}/tasks/${taskId}`
        const {data} = await api.delete<string>(url)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }    
    }
}

//Función para poder cambiar el estado de las tareas
export async function updateStatus({projectId, taskId, status} : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>){
    try{
        //Le pasamos la url de la petición de cambiar status que creamos en el backend
        const url = `/projects/${projectId}/tasks/${taskId}/status`
        const {data} = await api.post<string>(url, {status})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }    
    }
}