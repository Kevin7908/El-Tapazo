import { Link } from 'react-router-dom'

export default function PaginaNoEncontrada() {
  return (
    <main className="pagina">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  )
}
