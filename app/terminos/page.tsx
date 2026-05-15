import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Privacidad',
  description: 'Términos de uso y política de privacidad de rateargy.',
}

export default function TerminosPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 8 }}>
        Términos y Privacidad
      </h1>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 48 }}>Última actualización: mayo 2026</p>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Sobre rateargy</h2>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 12 }}>
          rateargy es un comparador financiero independiente. No somos una entidad financiera, no otorgamos créditos
          ni productos financieros, y no estamos regulados por el Banco Central de la República Argentina (BCRA).
        </p>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>
          La información publicada es de carácter orientativo y no constituye asesoramiento financiero. Antes de
          tomar cualquier decisión, verificá las condiciones vigentes con la entidad financiera correspondiente.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Exactitud de los datos</h2>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 12 }}>
          Los beneficios, porcentajes de descuento y topes de cada tarjeta de crédito se actualizan semanalmente
          a partir de las comunicaciones oficiales de cada banco. No garantizamos que los datos estén actualizados
          en todo momento — los bancos pueden modificar sus condiciones sin previo aviso.
        </p>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>
          Si encontrás un error, podés reportarlo desde la{' '}
          <Link href="/contacto" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
            página de contacto
          </Link>.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Links de afiliados</h2>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>
          rateargy puede recibir una comisión cuando el usuario accede a un producto financiero a través de nuestros
          links. Esto no afecta los rankings ni las recomendaciones: las tarjetas se ordenan únicamente por ahorro
          real calculado sobre el perfil de gasto del usuario.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Privacidad y datos</h2>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 12 }}>
          rateargy no requiere registro. Los gastos que ingresás en la calculadora se almacenan localmente en tu
          navegador (localStorage) y no se envían a nuestros servidores.
        </p>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 12 }}>
          Si dejás tu email para recibir actualizaciones, lo guardamos en nuestra base de datos junto con tu
          perfil de gasto. No lo compartimos con terceros ni lo usamos para publicidad. Podés solicitar su
          eliminación escribiéndonos a través del{' '}
          <Link href="/contacto" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
            formulario de contacto
          </Link>.
        </p>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>
          Usamos Google Analytics para medir el tráfico del sitio. Esto implica que Google puede procesar datos
          de navegación según sus propias políticas de privacidad.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Contacto</h2>
        <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.8 }}>
          Para cualquier consulta sobre privacidad o sobre los datos del sitio, usá el{' '}
          <Link href="/contacto" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>
            formulario de contacto
          </Link>.
        </p>
      </section>
    </main>
  )
}
