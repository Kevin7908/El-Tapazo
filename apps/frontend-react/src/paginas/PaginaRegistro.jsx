import { useState } from 'react'

import { Link } from 'react-router-dom'

import logoEmpresa from '@/recursos/imagenes/logo-empresa.png'

import CampoTexto from '@/componentes/ui/CampoTexto.jsx'

import BotonPrincipal from '@/componentes/ui/BotonPrincipal.jsx'

import {
  validarCedula,
  validarNombre,
  validarCorreo,
  validarTelefono,
  validarFechaNacimiento,
  validarRol,
  validarPassword,
  validarConfirmarPassword,
} from '@/utilidades/validaciones/autenticacion.js'

import '@/estilos/registro.css'

export default function PaginaRegistro() {
  const [formulario, setFormulario] = useState({
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    rol: '',
    password: '',
    confirmarPassword: '',
  })

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }))

    setMensaje('')

    if (errores[name]) {
      setErrores((erroresActuales) => ({
        ...erroresActuales,
        [name]: '',
      }))
    }
  }

  function handleBlur(event) {
    const { name } = event.target

    let error = ''

    switch (name) {
      case 'cedula':
        error = validarCedula(formulario.cedula)
        break

      case 'primerNombre':
        error = validarNombre(formulario.primerNombre, 'El primer nombre')
        break

      case 'segundoNombre':
        if (formulario.segundoNombre.trim()) {
          error = validarNombre(formulario.segundoNombre, 'El segundo nombre')
        }
        break

      case 'primerApellido':
        error = validarNombre(formulario.primerApellido, 'El primer apellido')
        break

      case 'segundoApellido':
        if (formulario.segundoApellido.trim()) {
          error = validarNombre(formulario.segundoApellido, 'El segundo apellido')
        }
        break

      case 'correo':
        error = validarCorreo(formulario.correo)
        break

      case 'telefono':
        error = validarTelefono(formulario.telefono)
        break

      case 'fechaNacimiento':
        error = validarFechaNacimiento(formulario.fechaNacimiento)
        break

      case 'rol':
        error = validarRol(formulario.rol)
        break

      case 'password':
        error = validarPassword(formulario.password)
        break

      case 'confirmarPassword':
        error = validarConfirmarPassword(formulario.password, formulario.confirmarPassword)
        break

      default:
        break
    }

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [name]: error,
    }))
  }

  function validarFormulario() {
    const nuevosErrores = {}

    const validaciones = {
      cedula: validarCedula(formulario.cedula),

      primerNombre: validarNombre(formulario.primerNombre, 'El primer nombre'),

      primerApellido: validarNombre(formulario.primerApellido, 'El primer apellido'),

      correo: validarCorreo(formulario.correo),

      telefono: validarTelefono(formulario.telefono),

      fechaNacimiento: validarFechaNacimiento(formulario.fechaNacimiento),

      rol: validarRol(formulario.rol),

      password: validarPassword(formulario.password),

      confirmarPassword: validarConfirmarPassword(
        formulario.password,
        formulario.confirmarPassword
      ),
    }

    if (formulario.segundoNombre.trim()) {
      validaciones.segundoNombre = validarNombre(formulario.segundoNombre, 'El segundo nombre')
    }

    if (formulario.segundoApellido.trim()) {
      validaciones.segundoApellido = validarNombre(
        formulario.segundoApellido,
        'El segundo apellido'
      )
    }

    Object.entries(validaciones).forEach(([campo, error]) => {
      if (error) {
        nuevosErrores[campo] = error
      }
    })

    return nuevosErrores
  }

  function handleSubmit(event) {
    event.preventDefault()

    setMensaje('')

    const nuevosErrores = validarFormulario()

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    // Temporalmente no existe conexión con el backend.
    console.log(formulario)

    setMensaje('Formulario válido. El backend todavía no está conectado.')
  }

  return (
    <main className="registro">
      <section className="registro__card">
        <div className="registro__encabezado">
          <img src={logoEmpresa} alt="Logo de El Tapaso" className="registro__logo" />

          <h1>Crear usuario</h1>

          <p>Completa la información para crear una nueva cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="registro__seccion">
            <h2>Información personal</h2>

            <CampoTexto
              id="cedula"
              name="cedula"
              label="Cédula"
              type="text"
              value={formulario.cedula}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.cedula}
              placeholder="Número de cédula"
              autoComplete="off"
            />

            <CampoTexto
              id="primerNombre"
              name="primerNombre"
              label="Primer nombre"
              value={formulario.primerNombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.primerNombre}
              placeholder="Primer nombre"
              autoComplete="given-name"
            />

            <CampoTexto
              id="segundoNombre"
              name="segundoNombre"
              label="Segundo nombre (opcional)"
              value={formulario.segundoNombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.segundoNombre}
              placeholder="Segundo nombre"
              autoComplete="additional-name"
            />

            <CampoTexto
              id="primerApellido"
              name="primerApellido"
              label="Primer apellido"
              value={formulario.primerApellido}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.primerApellido}
              placeholder="Primer apellido"
              autoComplete="family-name"
            />

            <CampoTexto
              id="segundoApellido"
              name="segundoApellido"
              label="Segundo apellido (opcional)"
              value={formulario.segundoApellido}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.segundoApellido}
              placeholder="Segundo apellido"
              autoComplete="family-name"
            />

            <CampoTexto
              id="fechaNacimiento"
              name="fechaNacimiento"
              label="Fecha de nacimiento"
              type="date"
              value={formulario.fechaNacimiento}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.fechaNacimiento}
              autoComplete="bday"
            />
          </div>

          <div className="registro__seccion">
            <h2>Información de contacto</h2>

            <CampoTexto
              id="correo"
              name="correo"
              label="Correo electrónico"
              type="email"
              value={formulario.correo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.correo}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />

            <CampoTexto
              id="telefono"
              name="telefono"
              label="Teléfono"
              type="tel"
              value={formulario.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errores.telefono}
              placeholder="3001234567"
              autoComplete="tel"
            />
          </div>

          <div className="registro__seccion">
            <h2>Acceso</h2>

            <div className="campo">
              <label htmlFor="rol">Rol</label>

              <select
                id="rol"
                name="rol"
                value={formulario.rol}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errores.rol ? 'campo__select--error' : ''}
                aria-invalid={Boolean(errores.rol)}
              >
                <option value="">Selecciona un rol</option>

                <option value="Administrador">Administrador</option>

                <option value="Operativo">Operativo</option>
              </select>

              {errores.rol && <p className="campo__error">{errores.rol}</p>}
            </div>

            <div className="campo">
              <label htmlFor="password">Contraseña</label>

              <div className="campo__password">
                <input
                  id="password"
                  name="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  value={formulario.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ingresa una contraseña"
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

            <div className="campo">
              <label htmlFor="confirmarPassword">Confirmar contraseña</label>

              <div className="campo__password">
                <input
                  id="confirmarPassword"
                  name="confirmarPassword"
                  type={mostrarConfirmarPassword ? 'text' : 'password'}
                  value={formulario.confirmarPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Repite la contraseña"
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
          </div>

          <BotonPrincipal type="submit">Crear usuario</BotonPrincipal>

          {mensaje && <p className="registro__mensaje">{mensaje}</p>}
        </form>

        <div className="registro__login">
          <span>¿Ya tienes una cuenta?</span> <Link to="/login">Iniciar sesión</Link>
        </div>
      </section>
    </main>
  )
}
