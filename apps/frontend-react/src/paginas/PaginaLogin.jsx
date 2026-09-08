import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoEmpresa from '@/recursos/imagenes/logo-empresa.png'
import '@/estilos/login.css'

import CampoTexto from '@/componentes/ui/CampoTexto.jsx'
import BotonPrincipal from '@/componentes/ui/BotonPrincipal.jsx'
import { validarCorreo, validarPassword, validarLogin } from '@/utilidades/validaciones/autenticacion.js'

export default function PaginaLogin() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')

  const [errores, setErrores] = useState({})
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mensaje, setMensaje] = useState('')

  function handleCorreoChange(event) {
    const valor = event.target.value

    setCorreo(valor)
    setMensaje('')

    if (errores.correo) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        correo: validarCorreo(valor),
      }))
    }
  }

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
  }

  function handleCorreoBlur() {
    const error = validarCorreo(correo)

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      correo: error,
    }))
  }

  function handlePasswordBlur() {
    const error = validarPassword(password)

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      password: error,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setMensaje('')

    const nuevosErrores = validarLogin({
      correo,
      password,
    })

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    // Temporalmente no existe conexión con el backend.
    console.log({
      correo,
      password,
    })

    setMensaje(
      'Formulario válido. El backend todavía no está conectado.'
    )
  }

  return (
    <main className="login">
      <section className="login__card">
        <div className="login__encabezado">
            <img
                src={logoEmpresa}
                alt="Logo de El Tapaso"
                className="login__logo"
            />
            <h1>Iniciar sesión</h1>
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
            error={errores.correo}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />

          <div className="campo">
            <label htmlFor="password">
              Contraseña
            </label>

            <div className="campo__password">
              <input
                id="password"
                name="password"
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                aria-invalid={Boolean(errores.password)}
                aria-describedby={
                  errores.password
                    ? 'password-error'
                    : undefined
                }
              />

              <button
                type="button"
                className="campo__password-boton"
                onClick={() =>
                  setMostrarPassword(!mostrarPassword)
                }
              >
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {errores.password && (
              <p
                id="password-error"
                className="campo__error"
              >
                {errores.password}
              </p>
            )}
          </div>

          <div className="login__recuperacion">
            <Link to="/recuperar-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <BotonPrincipal type="submit">
            Iniciar sesión
          </BotonPrincipal>

          {mensaje && (
            <p className="login__mensaje">
              {mensaje}
            </p>
          )}
        </form>

        <div className="login__registro">
          <span>¿No tienes una cuenta?</span>{' '}

          <Link to="/registro">
            Regístrate
          </Link>
        </div>
      </section>
    </main>
  )
}