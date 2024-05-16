//Este archivo nos servirá para las traducciones de los nombres de los campos que utiliza la base de datos
//Para hacerlos más amigables al usuario
export const statusTranslations : {[key: string] : string} = {
    pending: 'Pendiente',
    onHold: 'En Espera',
    inProgress: 'En Progreso',
    underReview: 'En Revisión',
    completed: 'Completado',
}