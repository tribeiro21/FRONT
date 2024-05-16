//En este archivo vamos a definir de forma global los tipos de datos
//Así, en caso de que agreguemos un campo en el futuro, no tenemos que definir el tipo de dato en cada parte del código
//Importando zood, nos poermite englobar el tipo de dato de cada campo
import {z} from 'zod'

/** Autenticación y usuarios **/
//Creamos el esquema para los usuarios
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
//Extraemos los datos necesarios para el login
export type UserLoginForm = Pick<Auth, 'email' | 'password' >
//Extraemos los datos necesarios para el registro
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation' >
//Extraemos los datos necesarios para que el usuario pida el nuevo token, que es solo el email
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
//Extraemos los datos necesarios para que el usuario recupere la contraseña
export type ForgotPasswordForm = Pick<Auth, 'email'>
//Extraemos los datos necesarios para el token de recuperar la contraseña
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
//Extraemos los datos necesarios para actualizar la contraseña
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
//Extraemos el único dato necesario para la confirmación del token, que es el propio token
export type ConfirmToken = Pick<Auth, 'token'>
//Creamos el type para la confirmación de la contraseña al eliminar un proyecto
export type CheckPasswordForm = Pick<Auth, 'password'>

/** Usuarios **/
//Definimos el esquema para el inicio de sesión por parte del usuario
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})

export type User = z.infer<typeof userSchema>
//Con el Pick, seleccionamos los valores que el usuario podrá cambiar desde editar perfil
export type UserProfileForm = Pick<User, 'name' | 'email'>

/** NOTAS */
//Definimos el esquema de las notas
const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})
export type Note = z.infer<typeof noteSchema>
//Seleccionamos sólo el content de las notas con el Pick
export type NoteFormData = Pick<Note, 'content'>

/** Tareas */
//Primero tenemos que definir una variable para el array de valores que compone el status
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])
//Definimos el tipo de dato para el status
export type TaskStatus = z.infer<typeof taskStatusSchema>

//Definimos lo que queremos mostrar en el formulario de cada tarea
export const taskSchema = z.object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
        project: z.string(),
        status: taskStatusSchema,
        completedBy: z.array(z.object({
            _id: z.string(),
            user: userSchema,
            status: taskStatusSchema
        })),
        notes: z.array(noteSchema.extend({
            createdBy: userSchema
        })),
        createdAt: z.string(),
        updatedAt: z.string()
})

//Definimos todo lo que queremos ver al entrar en un proyecto, sobre las tareas
export const taskProjectSchema = taskSchema.pick({
    _id:true,
    name: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>

/** Proyectos */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    aulaName: z.string(),
    description: z.string(),
    tutora: z.string(userSchema.pick({_id: true})),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string(userSchema.pick({_id: true})))
})

//Definimos lo que queremos mostrar de cada proyecto al hacer el get
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        aulaName: true,
        description: true,
        tutora: true
    })
)

//Definimos el esquema para editar los proyectos
export const editProjectSchema = projectSchema.pick({
    projectName: true,
    aulaName: true,
    description: true,
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'aulaName' | 'projectName' | 'description'>

/** ALUMNOS */
//Definimos el esquema que utilizaremos para agregar alumnos a los proyectos
const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
})
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>