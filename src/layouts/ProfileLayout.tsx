//En este archivo vamos a renderizar las vistas de perfil y cambiar el password del usuario
import Tabs from "@/components/profile/Tabs";
import { Outlet } from "react-router-dom";

//Utilizamos Outlet para renderizarlos
export default function ProfileLayout() {
  return (
    <>
        <Tabs />
        <Outlet />
    </>
  )
}
