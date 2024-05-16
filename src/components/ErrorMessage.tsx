//Este archivo es para mostarr los errores en caso de que en el formulario exista un error en la validación
//Por ejemplo, que falten campos

export default function ErrorMessage({children} : {children:React.ReactNode}) {
  return (
    <div className="text-center my-4 bg-red-100 text-red-600 font-bold p-3 uppercase text-sm">
      {children}
    </div>
  )
}
