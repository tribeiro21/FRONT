import ProfileForm from "@/components/profile/ProfileForm"
import { useAuth } from "@/hooks/useAuth"

//Esta vista es para la vista del perfil del usuario
export default function ProfileView() {
    const {data, isLoading} = useAuth()

    //Una vez que el usuario se haya autenticado
    if(isLoading) return 'Cargando...'
    //Muestra el componente del "profileform"
    if(data) return <ProfileForm data={data} />
}
