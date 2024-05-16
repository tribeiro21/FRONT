import { UseFormRegister, FieldErrors } from "react-hook-form";
import ErrorMessage from "../ErrorMessage"
import { ProjectFormData } from "types";

//Definimos el tipo de dato de cada campo del formulario
//Nos traemos el ProjectFormData porque ahí definimos de forma global los tipos de dato
type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>
    errors: FieldErrors<ProjectFormData>
}

export default function ProjectForm({errors, register} : ProjectFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="projectName" className="text-sm uppercase font-bold">
                    Nombre del Proyecto
                </label>
                <input
                    id="projectName"
                    className="w-full p-3  border border-gray-200 rounded-md"
                    type="text"
                    placeholder="Nombre del Proyecto"
                    {...register("projectName", {
                        required: "El Titulo del Proyecto es obligatorio",
                    })}
                />

                {errors.projectName && (
                    <ErrorMessage>{errors.projectName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="aulaName" className="text-sm uppercase font-bold">
                    Aula
                </label>
                <input
                    id="aulaName"
                    className="w-full p-3  border border-gray-200 rounded-md"
                    type="text"
                    placeholder="Aula Asignada"
                    {...register("aulaName", {
                        required: "El Nombre del Aula es obligatorio",
                    })}
                />

                {errors.aulaName && (
                    <ErrorMessage>{errors.aulaName.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <textarea
                    id="description"
                    className="w-full p-3  border border-gray-200 rounded-md"
                    placeholder="Descripción del Proyecto"
                    {...register("description", {
                        required: "Una descripción del proyecto es obligatoria"
                    })}
                />

                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}