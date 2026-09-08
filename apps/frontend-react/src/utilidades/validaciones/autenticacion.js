export function validarCorreo(correo) {
  const correoLimpio = correo.trim()

  if (!correoLimpio) {
    return 'El correo electrónico es obligatorio.'
  }

  if (correoLimpio.length > 254) {
    return 'El correo electrónico es demasiado largo.'
  }

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!regexCorreo.test(correoLimpio)) {
    return 'Ingresa un correo electrónico válido.'
  }

  return ''
}

export function validarPassword(password) {
  if (!password) {
    return 'La contraseña es obligatoria.'
  }

  if (password.length < 8) {
    return 'La contraseña debe tener mínimo 8 caracteres.'
  }

  if (password.length > 128) {
    return 'La contraseña no puede superar los 128 caracteres.'
  }

  if (/\s/.test(password)) {
    return 'La contraseña no puede contener espacios.'
  }

  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula.'
  }

  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra minúscula.'
  }

  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un número.'
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'+=~`]/.test(password)) {
    return 'La contraseña debe contener al menos un carácter especial.'
  }

  return ''
}

export function validarConfirmarPassword(password, confirmarPassword) {
  if (!confirmarPassword) {
    return 'Debes confirmar la contraseña.'
  }

  if (password !== confirmarPassword) {
    return 'Las contraseñas no coinciden.'
  }

  return ''
}

export function validarNombre(nombre, campo = 'El nombre') {
  const nombreLimpio = nombre.trim()

  if (!nombreLimpio) {
    return `${campo} es obligatorio.`
  }

  if (nombreLimpio.length < 2) {
    return `${campo} debe tener al menos 2 caracteres.`
  }

  if (nombreLimpio.length > 50) {
    return `${campo} no puede superar los 50 caracteres.`
  }

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:[ '-][A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/

  if (!regexNombre.test(nombreLimpio)) {
    return `${campo} solo puede contener letras, espacios, guiones o apóstrofes.`
  }

  return ''
}

export function validarCedula(cedula) {
  const cedulaLimpia = cedula.trim()

  if (!cedulaLimpia) {
    return 'La cédula es obligatoria.'
  }

  if (!/^\d+$/.test(cedulaLimpia)) {
    return 'La cédula solo puede contener números.'
  }

  if (cedulaLimpia.length < 6 || cedulaLimpia.length > 10) {
    return 'La cédula debe tener entre 6 y 10 dígitos.'
  }

  return ''
}

export function validarTelefono(telefono) {
  const telefonoLimpio = telefono.replace(/\s/g, '')

  if (!telefonoLimpio) {
    return 'El teléfono es obligatorio.'
  }

  if (!/^\d+$/.test(telefonoLimpio)) {
    return 'El teléfono solo puede contener números.'
  }

  // Celular colombiano: 3XXXXXXXXX
  const esCelular = /^3\d{9}$/.test(telefonoLimpio)

  // Telefonía fija colombiana con indicativo nacional de 10 dígitos.
  const esFijo = /^60[1-8]\d{7}$/.test(telefonoLimpio)

  if (!esCelular && !esFijo) {
    return 'Ingresa un número de teléfono válido para Colombia.'
  }

  return ''
}

export function validarFechaNacimiento(fechaNacimiento) {
  if (!fechaNacimiento) {
    return 'La fecha de nacimiento es obligatoria.'
  }

  const fecha = new Date(`${fechaNacimiento}T00:00:00`)

  if (Number.isNaN(fecha.getTime())) {
    return 'Ingresa una fecha de nacimiento válida.'
  }

  const hoy = new Date()

  if (fecha > hoy) {
    return 'La fecha de nacimiento no puede ser futura.'
  }

  let edad = hoy.getFullYear() - fecha.getFullYear()

  const mes = hoy.getMonth() - fecha.getMonth()

  if (
    mes < 0 ||
    (mes === 0 && hoy.getDate() < fecha.getDate())
  ) {
    edad--
  }

  if (edad < 18) {
    return 'El usuario debe ser mayor de edad.'
  }

  return ''
}

export function validarRol(rol) {
  if (!rol) {
    return 'Debes seleccionar un rol.'
  }

  const rolesPermitidos = ['Administrador', 'Operativo']

  if (!rolesPermitidos.includes(rol)) {
    return 'El rol seleccionado no es válido.'
  }

  return ''
}

export function validarLogin({ correo, password }) {
  const errores = {}

  const errorCorreo = validarCorreo(correo)
  const errorPassword = validarPassword(password)

  if (errorCorreo) {
    errores.correo = errorCorreo
  }

  if (errorPassword) {
    errores.password = errorPassword
  }

  return errores
}