export default function CampoTexto({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder = '',
  autoComplete,
}) {
  const idError = `${id}-error`

  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
      />

      {error && (
        <p id={idError} className="campo__error">
          {error}
        </p>
      )}
    </div>
  )
}