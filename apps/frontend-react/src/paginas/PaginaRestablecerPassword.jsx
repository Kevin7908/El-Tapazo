import { useState } from 'react'

import { Link, useSearchParams } from 'react-router-dom'

import logoEmpresa from '@/recursos/imagenes/logo-empresa.png'

import BotonPrincipal from '@/componentes/ui/BotonPrincipal.jsx'

import {
  validarPassword,
  validarConfirmarPassword,
} from '@/utilidades/validaciones/autenticacion.js'

import '@/estilos/restablecer-password.css'

export default function PaginaRestablecerPassword() {
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)

  function handlePasswordChange(event) {
    const valor = event.target.value

    setPassword(valor)
    setMensaje('')

    if (errores.password) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        password: validarPassword(valor),
      }))
    }

    if (errores.confirmarPassword) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        confirmarPassword: validarConfirmarPassword(valor, confirmarPassword),
      }))
    }
  }

  function handleConfirmarPasswordChange(event) {
    const valor = event.target.value

    setConfirmarPassword(valor)
    setMensaje('')

    if (errores.confirmarPassword) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        confirmarPassword: validarConfirmarPassword(password, valor),
      }))
    }
  }

  function handlePasswordBlur() {
    const error = validarPassword(password)

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      password: error,
    }))
  }

  function handleConfirmarPasswordBlur() {
    const error = validarConfirmarPassword(password, confirmarPassword)

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      confirmarPassword: error,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setMensaje('')

    const nuevosErrores = {}

    const errorPassword = validarPassword(password)

    const errorConfirmarPassword = validarConfirmarPassword(password, confirmarPassword)

    if (errorPassword) {
      nuevosErrores.password = errorPassword
    }

    if (errorConfirmarPassword) {
      nuevosErrores.confirmarPassword = errorConfirmarPassword
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    // Temporalmente no existe conexión con el backend.
    console.log({
      token,
      password,
    })

    setMensaje('La contraseña cumple con los requisitos. El backend todavía no está conectado.')
  }

  return (
    <main className="restablecer-password">
      <section className="restablecer-password__card">
        <div className="restablecer-password__encabezado">
          <img src={logoEmpresa} alt="Logo de El Tapaso" className="restablecer-password__logo" />

          <h1>Restablecer contraseña</h1>

          <p>Crea una nueva contraseña para tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* NUEVA CONTRASEÑA */}
          <div className="campo">
            <label htmlFor="password">Nueva contraseña</label>

            <div className="campo__password">
              <input
                id="password"
                name="password"
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Ingresa una nueva contraseña"
                autoComplete="new-password"
                aria-invalid={Boolean(errores.password)}
              />

              <button
                type="button"
                className="campo__password-boton"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {errores.password && <p className="campo__error">{errores.password}</p>}
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="campo">
            <label htmlFor="confirmarPassword">Confirmar contraseña</label>

            <div className="campo__password">
              <input
                id="confirmarPassword"
                name="confirmarPassword"
                type={mostrarConfirmarPassword ? 'text' : 'password'}
                value={confirmarPassword}
                onChange={handleConfirmarPasswordChange}
                onBlur={handleConfirmarPasswordBlur}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
                aria-invalid={Boolean(errores.confirmarPassword)}
              />

              <button
                type="button"
                className="campo__password-boton"
                onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
              >
                {mostrarConfirmarPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {errores.confirmarPassword && (
              <p className="campo__error">{errores.confirmarPassword}</p>
            )}
          </div>

          {/* REQUISITOS */}
          <div className="password__requisitos">
            <p>La contraseña debe contener:</p>

            <ul>
              <li>Entre 8 y 128 caracteres.</li>
              <li>Al menos una letra mayúscula.</li>
              <li>Al menos una letra minúscula.</li>
              <li>Al menos un número.</li>
              <li>Al menos un carácter especial.</li>
              <li>No debe contener espacios.</li>
            </ul>
          </div>

          <BotonPrincipal type="submit">Cambiar contraseña</BotonPrincipal>

          {mensaje && <p className="restablecer-password__mensaje">{mensaje}</p>}
        </form>

        <div className="restablecer-password__volver">
          <Link to="/login">← Volver a iniciar sesión</Link>
        </div>
      </section>
    </main>
  )
}
