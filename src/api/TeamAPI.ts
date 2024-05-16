import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types";

//Buscamos al alumno que vamos a agregar al proyecto por su email de registro
export async function findUserByEmail({projectId, formData} : {projectId: Project['_id'], formData: TeamMemberForm}){
    try{
        //En esta url realizamos la busqueda con la petición
        const url = `/projects/${projectId}/team/find`
        const {data} = await api.post(url, formData)
        return data
    }catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//Función para agregar a un alumno a un proyecto
export async function addUserToProject({projectId, id} : {projectId: Project['_id'], id: TeamMember['_id']}){
    try{
        //En esta url realizamos la busqueda con la petición
        const url = `/projects/${projectId}/team`
        const {data} = await api.post<string>(url, {id})
        return data
    }catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//Función para eliminar a un alumno de un proyecto
export async function removeUserFromProject({projectId, userId} : {projectId: Project['_id'], userId: TeamMember['_id']}){
    try{
        //En esta url realizamos la busqueda con la petición
        const url = `/projects/${projectId}/team/${userId}`
        const {data} = await api.delete<string>(url)
        return data
    }catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

//Función para listar los alumnos que están en un proyecto
export async function getProjectTeam(projectId: Project['_id']){
    try{
        //En esta url realizamos la busqueda con la petición
        const url = `/projects/${projectId}/team`
        const {data} = await api(url)
        const response = teamMembersSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    }catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}