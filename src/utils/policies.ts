//Este archivo es para establecer las políticas o los derechos que tiene cada usuario según su autorización
import {Project, TeamMember} from "../types"

export const isTutora = (tutoraId: Project['tutora'], userId: TeamMember['_id']) => tutoraId === userId
