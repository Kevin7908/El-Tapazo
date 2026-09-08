import '@/estilos/inicio.css'

export default function PaginaInicio() {
  return (
    <div className="dashboard">

      {/* =========================
          MENÚ LATERAL
      ========================== */}
      <aside className="sidebar">

        <div className="sidebar__marca">
          <div className="sidebar__logo">
            ET
          </div>

          <div>
            <h2>El Tapaso</h2>
            <span>Distribuidora de bebidas</span>
          </div>
        </div>

        <nav className="sidebar__menu">

          <p className="sidebar__titulo">PRINCIPAL</p>

          <a className="sidebar__item sidebar__item--activo">
            <span>▦</span>
            Dashboard
          </a>

          <p className="sidebar__titulo">INVENTARIO</p>

          <a className="sidebar__item">
            <span>□</span>
            Productos
          </a>

          <a className="sidebar__item">
            <span>◇</span>
            Categorías
          </a>

          <a className="sidebar__item">
            <span>▤</span>
            Proveedores
          </a>

          <p className="sidebar__titulo">VENTAS</p>

          <a className="sidebar__item">
            <span>▣</span>
            Ventas
          </a>

          <a className="sidebar__item">
            <span>▧</span>
            Pedidos
          </a>

          <a className="sidebar__item">
            <span>♙</span>
            Clientes
          </a>

          <p className="sidebar__titulo">
            ADMINISTRACIÓN
          </p>

          <a className="sidebar__item">
            <span>♙</span>
            Usuarios
          </a>

        </nav>

        <div className="sidebar__inferior">

          <a className="sidebar__item">
            <span>⚙</span>
            Configuración
          </a>

          <a className="sidebar__item">
            <span>⇥</span>
            Salir
          </a>

        </div>

      </aside>

      {/* =========================
          CONTENIDO DERECHO
      ========================== */}
      <div className="dashboard__contenido">

        {/* HEADER */}
        <header className="header">

          <div className="header__buscador">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar producto, cliente, pedido..."
            />
          </div>

          <div className="header__acciones">

            <button className="header__venta">
              + Nueva venta
            </button>

            <button className="header__notificacion">
              ♢
            </button>

            <div className="header__usuario">

              <div className="header__avatar">
                AD
              </div>

              <div>
                <strong>Administrador</strong>
                <span>Administrador</span>
              </div>

            </div>

          </div>

        </header>

        {/* =========================
            CONTENIDO PRINCIPAL
        ========================== */}
        <main className="contenido">

          <div className="contenido__encabezado">
            <div>
              <h1>Dashboard</h1>

              <p>
                Resumen general de la distribuidora
              </p>
            </div>
          </div>

          <div className="dashboard__grid">

            {/* COLUMNA IZQUIERDA */}
            <section className="dashboard__principal">

              {/* VENTAS DE HOY */}
              <article className="ventas-hoy">

                <span className="ventas-hoy__titulo">
                  Ventas de hoy
                </span>

                <h2>$1.240.000</h2>

                <p>
                  +18% vs. ayer · 23 ventas realizadas
                </p>

                <div className="ventas-hoy__acciones">

                  <button>
                    + Registrar venta
                  </button>

                  <button>
                    Ver ventas
                  </button>

                </div>

              </article>

              {/* INDICADORES */}
              <div className="indicadores">

                <article className="indicador">
                  <div className="indicador__icono">
                    ◫
                  </div>

                  <strong>12</strong>
                  <span>Pedidos pendientes</span>
                </article>

                <article className="indicador">
                  <div className="indicador__icono">
                    ♙
                  </div>

                  <strong>348</strong>
                  <span>Clientes</span>
                </article>

                <article className="indicador">
                  <div className="indicador__icono">
                    $
                  </div>

                  <strong>$2.1M</strong>
                  <span>Cuentas por cobrar</span>
                </article>

              </div>

              {/* GRÁFICA */}
              <article className="grafica">

                <h3>Ventas de la semana</h3>

                <div className="grafica__contenido">

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra"
                      style={{ height: '35%' }}
                    />
                    <span>Lun</span>
                  </div>

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra"
                      style={{ height: '55%' }}
                    />
                    <span>Mar</span>
                  </div>

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra"
                      style={{ height: '42%' }}
                    />
                    <span>Mié</span>
                  </div>

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra"
                      style={{ height: '70%' }}
                    />
                    <span>Jue</span>
                  </div>

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra"
                      style={{ height: '82%' }}
                    />
                    <span>Vie</span>
                  </div>

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra grafica__barra--destacada"
                      style={{ height: '100%' }}
                    />
                    <span>Sáb</span>
                  </div>

                  <div className="grafica__columna">
                    <div
                      className="grafica__barra"
                      style={{ height: '50%' }}
                    />
                    <span>Dom</span>
                  </div>

                </div>

              </article>

            </section>

            {/* =========================
                STOCK BAJO
            ========================== */}
            <aside className="stock">

              <div className="stock__encabezado">
                <h3>Requiere atención</h3>
                <span>5</span>
              </div>

              <ProductoStock
                nombre="Coca-Cola 1.5L"
                detalle="Bodega principal"
                cantidad="8"
              />

              <ProductoStock
                nombre="Cerveza Águila x24"
                detalle="Bodega principal"
                cantidad="5"
              />

              <ProductoStock
                nombre="Cerveza Poker x24"
                detalle="Bodega principal"
                cantidad="3"
              />

              <ProductoStock
                nombre="Agua Cristal 600ml"
                detalle="Bodega secundaria"
                cantidad="2"
              />

              <ProductoStock
                nombre="Gaseosa Colombiana 1.5L"
                detalle="Bodega principal"
                cantidad="6"
              />

              <button className="stock__boton">
                Reabastecer inventario
              </button>

            </aside>

          </div>

        </main>

      </div>

    </div>
  )
}


function ProductoStock({
  nombre,
  detalle,
  cantidad,
}) {
  return (
    <div className="stock__producto">

      <div className="stock__imagen">
        ▣
      </div>

      <div className="stock__informacion">
        <strong>{nombre}</strong>
        <span>{detalle}</span>
      </div>

      <div className="stock__cantidad">
        <strong>{cantidad} und</strong>
        <span>en stock</span>
      </div>

    </div>
  )
}