# rateargy.ar

## Qué es el proyecto

Comparador financiero independiente de Argentina. La función principal
hoy es: el usuario carga sus gastos mensuales por categoría
(supermercado, nafta, farmacia, restaurantes, compras online, servicios)
y la web le devuelve un ranking de tarjetas de crédito argentinas
ordenadas por cuánto ahorro real le genera cada una según sus
beneficios y descuentos vigentes. 16 tarjetas cargadas, 6 categorías
de gasto, sin registro requerido.

## Visión de largo plazo (3-5 años, no es prioridad ahora)

El objetivo de fondo es construir el **referente de decisiones
financieras personales en Argentina**, en la línea de lo que son
Bankrate y NerdWallet en Estados Unidos. Eso significa, en el largo
plazo, expandir más allá de tarjetas de crédito a:

- Préstamos personales (comparador de tasas, plazos, costo financiero
  total entre bancos y fintechs).
- Seguros de auto (comparador de coberturas y primas).
- Cuotas y financiación de carreras universitarias y posgrados.
- Inversiones (FCI, plazos fijos UVA, dólar MEP, CEDEARs, cripto en
  fintechs argentinas).
- Hipotecas y créditos UVA cuando el mercado se vuelva a abrir.
- Tarjetas de débito y cuentas remuneradas (Mercado Pago, Ualá,
  Personal Pay, etc.).
- Contenido educativo serio en español argentino sobre cada vertical.

La aspiración es ser el sitio al que un argentino va cuando tiene que
tomar una decisión financiera y necesita comparar opciones de forma
transparente, con cálculos claros y metodología abierta.

**Importante:** esta visión informa decisiones de arquitectura (la
estructura de datos y de páginas tiene que ser extensible a nuevas
verticales sin reescribir el sitio), pero **no es lo que estamos
construyendo en las próximas semanas**. Ver "Prioridades inmediatas"
para lo que sí lo es.

## Estado actual

- Sitio nunca lanzado públicamente.
- 16 tarjetas de crédito cargadas en la base de datos.
- Calculadora de ranking funcional (toma 6 categorías de gasto y
  devuelve ahorro estimado por tarjeta).
- Filtro por nivel de ingreso para mostrar solo tarjetas accesibles
  al perfil.
- Secciones "Inversiones" y artículos están como "próximamente".
- Página de Contacto y Metodología existen pero hay que revisarlas.

## Prioridades inmediatas (semanas 1-4, en este orden)

1. **Verificar la lógica de cálculo de ahorro de las 5 tarjetas
   principales** con escenarios reales (gastos típicos de distintos
   perfiles) antes de lanzar. Las 5 a priorizar: Galicia Éminent,
   Galicia Visa Gold, Santander Gold, Naranja X, Supervielle Visa.
   El resto se verifica después.
2. **Limpiar el sitio**: quitar las secciones "próximamente" o dejarlas
   con un disclaimer honesto del estilo "estamos agregando contenido
   cada semana".
3. **Escribir 2-3 artículos breves** para que la sección "Guías
   financieras" no esté vacía al lanzar: "Cómo elegir tu tarjeta",
   "Cómo funciona el ranking de rateargy", "Errores comunes al elegir
   tarjeta en Argentina".
4. **Preparar copy de lanzamiento** para postear en r/argentina,
   r/merval, r/dinero y grupos de Facebook de finanzas personales.
5. **Lanzar** y medir qué pasa: visitas, tiempo en página, qué tarjetas
   se consultan más, dónde abandona la gente.

## Lo que NO es prioridad ahora (aunque sea parte de la visión)

- Agregar las verticales de préstamos, seguros, cuotas universitarias,
  inversiones u otras. Esto viene **después** de tener tracción real
  en tarjetas (objetivo mínimo: 2.000 visitas únicas al mes y feedback
  cualitativo de al menos 20 usuarios).
- Buscar acuerdos directos con bancos tradicionales. El mercado
  argentino no tiene programas de afiliación abiertos para bancos
  grandes. La monetización temprana será: afiliados de fintechs
  argentinas (Naranja X, Airtm, Brubank, Belo, Lemon), afiliados de
  Mercado Libre, y display ads cuando haya tráfico suficiente.
- Rediseño visual. El diseño actual es suficientemente bueno para
  lanzar. Se mejora con feedback de usuarios reales, no antes.

## Stack técnico

- Next.js 16 (con Turbopack).
- React.
- (Verificar al revisar package.json: TypeScript, Tailwind CSS, ORM
  de base de datos, hosting).

## Convenciones

- Idioma de UI y contenido: español argentino (voseo: "ingresá",
  "elegí", "calculá", no "ingresa/elige/calcula").
- Tono: directo, honesto, sin tecnicismos innecesarios. La marca se
  posiciona como "el comparador independiente y transparente",
  contraposición con los comparadores comerciales sesgados.
- Disclaimers visibles: los cálculos son estimaciones orientativas,
  no asesoramiento financiero. Tope de descuentos y condiciones de
  cada banco siempre verificables en el sitio oficial.
- Metodología abierta: cada cálculo de ahorro tiene que poder
  explicarse al usuario si lo pregunta (no caja negra).

## Modelo de monetización (orientativo, sujeto a evolución)

- Corto plazo (mes 1-6): afiliados de fintechs argentinas (Naranja X,
  Airtm, Brubank, Belo, Lemon), afiliados de Mercado Libre cuando el
  usuario va a comprar.
- Mediano plazo (mes 6-12): display ads (Google AdSense primero,
  Mediavine si el tráfico lo permite), productos digitales one-off
  ("guía mensual de descuentos vigentes" tipo PDF descargable).
- Largo plazo (año 2+): acuerdos directos con bancos y fintechs cuando
  el tráfico justifique la negociación, lead-gen B2B, premium opcional
  con notificaciones personalizadas.

## Cómo correr el proyecto

- `npm install` (primera vez).
- `npm run dev` → desarrollo local en localhost:3000.
- `npm run build` → build de producción.
- Deploy: (verificar si es Vercel u otro).

## Reglas para Claude Code al trabajar en este proyecto

- Antes de proponer agregar funcionalidades nuevas, chequear si están
  en "Prioridades inmediatas". Si no, recordar que primero hay que
  lanzar lo que ya está.
- Mantener la estructura de datos extensible (pensando en futuras
  verticales) pero no construir esas verticales todavía.
- Para cualquier cambio en la lógica de cálculo de ahorro, mostrar
  primero los escenarios de prueba y verificar contra los resultados
  esperados.
- Disclaimers legales y de metodología son obligatorios en cualquier
  página que muestre cálculos de ahorro.