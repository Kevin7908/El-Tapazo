export default function BotonPrincipal({
  children,
  type = 'button',
  disabled = false,
}) {
  return (
    <button
      type={type}
      className="boton-principal"
      disabled={disabled}
    >
      {children}
    </button>
  )
}