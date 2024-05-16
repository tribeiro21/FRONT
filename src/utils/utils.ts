//En este archivo, vamos a formatear las fechas que vienen desde mongodb con formato string
//A un formato amigable para el usuario, todo con código js
//Para las fechas que se muestran de la creación o actualización de una tarea
export function formatDate(isoString: string) : string{
    const date = new Date(isoString)
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    return formatter.format(date)
}
