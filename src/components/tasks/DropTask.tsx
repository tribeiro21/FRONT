import { useDroppable } from "@dnd-kit/core"

//El valor que vamos a utilizar para el droppable y draggable será el status de la tarea, por ello lo definimos como type
type DropTaskProps = {
    status: string
}

export default function DropTask({status} : DropTaskProps) {

    //Con el setNodeRef le indicamos qué parte de nuestro html queremos que tome para el draggable
    const {isOver, setNodeRef} = useDroppable({
        id:status
    })

    //Le agregamos un efecto a la cajita donde arrastramos la tarea para que sea indicativo
    const style = {
        opacity: isOver ? 0.4 : undefined
    }

    return (
        <div
            style={style}
            ref={setNodeRef}
            className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500 rounded-lg"
        >
            Soltar tarea aquí
        </div>
    )
}
