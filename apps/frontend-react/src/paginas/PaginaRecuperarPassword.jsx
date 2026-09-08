import { useState } from 'react'

import { Link } from 'react-router-dom'

import logoEmpresa from '@/recursos/imagenes/logo-empresa.png'

import CampoTexto from '@/componentes/ui/CampoTexto.jsx'

import BotonPrincipal from '@/componentes/ui/BotonPrincipal.jsx'

import { validarCorreo } from '@/utilidades/validaciones/autenticacion.js'

import '@/estilos/recuperar-password.css'

export default function PaginaRecuperarPassword() {
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function handleCorreoChange(event) {
    const valor = event.target.value

    setCorreo(valor)
    setMensaje('')

    if (error) {
      setError(validarCorreo(valor))
    }
  }

  function handleCorreoBlur() {
    const nuevoError = validarCorreo(correo)

    setError(nuevoError)
  }

  function handleSubmit(event) {
    event.preventDefault()

    setMensaje('')

    const nuevoError = validarCorreo(correo)

    setError(nuevoError)

    if (nuevoError) {
      return
    }

    // Temporalmente no existe conexión con el backend.
    console.log({
      correo: correo.trim(),
    })

    setMensaje(
      'Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña.'
    )
  }

  return (
    <main className="recuperar-password">
      <section className="recuperar-password__card">
        <div className="recuperar-password__encabezado">
          <img src={logoEmpresa} alt="Logo de El Tapaso" className="recuperar-password__logo" />

          <h1>Recuperar contraseña</h1>

          <p>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <CampoTexto
            id="correo"
            name="correo"
            label="Correo electrónico"
            type="email"
            value={correo}
            onChange={handleCorreoChange}
            onBlur={handleCorreoBlur}
            error={error}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />

          <BotonPrincipal type="submit">Enviar enlace</BotonPrincipal>

          {mensaje && <p className="recuperar-password__mensaje">{mensaje}</p>}
        </form>

        <div className="recuperar-password__volver">
          <Link to="/login">← Volver a iniciar sesión</Link>
        </div>
      </section>
    </main>
  )
}
