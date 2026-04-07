-- =============================================
-- rateargy — Supabase Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- CATEGORIAS
-- =============================================
create table if not exists categorias (
  id          uuid primary key default uuid_generate_v4(),
  nombre      text not null,
  slug        text not null unique,
  descripcion text,
  icono       text,
  color       text default '#635bff',
  activo      boolean default true,
  created_at  timestamptz default now()
);

insert into categorias (nombre, slug, descripcion, icono, color) values
  ('Tarjetas de Crédito', 'tarjetas', 'Encontrá la tarjeta con más beneficios para tu perfil', '💳', '#635bff'),
  ('Cuentas Bancarias', 'cuentas', 'Cuentas con cashback, sin comisión y alta tasa', '🏦', '#0070f3'),
  ('Préstamos Personales', 'prestamos', 'Compará tasas y condiciones de los mejores préstamos', '💰', '#00b894'),
  ('Seguros', 'seguros', 'Auto, hogar y vida al mejor precio del mercado', '🛡️', '#fdcb6e'),
  ('Inversiones', 'inversiones', 'Plazos fijos, FCI y opciones para hacer rendir tu plata', '📈', '#e17055'),
  ('Billeteras Virtuales', 'billeteras', 'Mercado Pago, Ualá, Naranja X y más comparadas', '📱', '#a29bfe');

-- =============================================
-- PRODUCTOS
-- =============================================
create table if not exists productos (
  id            uuid primary key default uuid_generate_v4(),
  categoria     text not null references categorias(slug),
  nombre        text not null,
  banco         text not null,
  descripcion   text,
  puntuacion    numeric(3,1) not null check (puntuacion >= 0 and puntuacion <= 10),
  beneficios    text[] default '{}',
  costo_mensual numeric(10,2) default 0,
  url_afiliado  text,
  activo        boolean default true,
  red           text,  -- Visa, Mastercard, Amex, etc.
  tag           text,  -- "Mejor para viajes", "Sin costo", etc.
  imagen_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Indexes
create index if not exists productos_categoria_idx on productos(categoria);
create index if not exists productos_activo_idx on productos(activo);
create index if not exists productos_puntuacion_idx on productos(puntuacion desc);

-- Sample data
insert into productos (categoria, nombre, banco, descripcion, puntuacion, beneficios, costo_mensual, url_afiliado, red, tag) values
(
  'tarjetas', 'Visa Signature ICBC', 'ICBC',
  'La mejor tarjeta para viajes internacionales con acceso a salas VIP y seguro de viaje incluido.',
  9.4,
  array['Acceso a salas VIP en aeropuertos', '3x puntos en compras internacionales', 'Seguro de viaje automático', 'Sin cargo el primer año', 'Cuota 0% en viajes'],
  0, '#', 'Visa', 'Mejor para viajes'
),
(
  'tarjetas', 'Mastercard Black Galicia', 'Banco Galicia',
  'Tarjeta premium con los mejores beneficios en gastronomía, entretenimiento y devolución de efectivo.',
  9.1,
  array['5% cashback en gastronomía', '2x puntos en supermercados', 'Descuentos en Netflix y Spotify', 'Cuotas sin interés en más de 500 comercios', 'Asistencia al viajero'],
  2800, '#', 'Mastercard', 'Más beneficios'
),
(
  'tarjetas', 'Naranja X', 'Naranja X',
  'Ideal para el día a día con beneficios en comercios locales y sin costo de mantenimiento.',
  8.7,
  array['Sin costo de mantenimiento', '10% de descuento en más de 200 comercios', 'Cuotas en todos los comercios adheridos', 'App con gestión completa', 'Reintegros en combustible'],
  0, '#', 'Visa', 'Sin costo'
),
(
  'tarjetas', 'American Express Platinum', 'American Express',
  'La tarjeta más exclusiva del mercado con beneficios únicos para el viajero frecuente.',
  9.6,
  array['Acceso ilimitado a salas VIP', 'Créditos de viaje USD 200/año', 'Concierge 24/7', 'Upgrade automático en hoteles', 'Seguro de compra global'],
  8500, '#', 'Amex', 'Premium'
),
(
  'tarjetas', 'Visa Clásica Santander', 'Banco Santander',
  'La tarjeta de entrada perfecta con beneficios esenciales y cuotas en miles de comercios.',
  8.2,
  array['Cuotas en 6.000+ comercios', 'Descuentos en supermercados adheridos', 'Débito automático sin cargo', 'App Santander incluida'],
  1200, '#', 'Visa', 'Para empezar'
),
(
  'tarjetas', 'Uala Mastercard', 'Uala',
  'Tarjeta prepaga con cuenta virtual, sin costo y con beneficios en el ecosistema Ualá.',
  8.5,
  array['Sin costo de emisión ni mantenimiento', 'Cashback en compras online', 'Recarga instantánea', 'Control de gastos en tiempo real', 'Descuentos exclusivos Ualá'],
  0, '#', 'Mastercard', 'Sin costo'
);

-- =============================================
-- ARTICULOS (Blog)
-- =============================================
create table if not exists articulos (
  id          uuid primary key default uuid_generate_v4(),
  titulo      text not null,
  slug        text not null unique,
  resumen     text,
  contenido   text,
  categoria   text references categorias(slug),
  imagen_url  text,
  publicado   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists articulos_slug_idx on articulos(slug);
create index if not exists articulos_publicado_idx on articulos(publicado);
create index if not exists articulos_categoria_idx on articulos(categoria);

-- =============================================
-- RLS Policies (Row Level Security)
-- =============================================

-- Enable RLS
alter table productos enable row level security;
alter table categorias enable row level security;
alter table articulos enable row level security;

-- Public read for active products
create policy "Public can read active products"
  on productos for select
  using (activo = true);

-- Public read for all categories
create policy "Public can read categories"
  on categorias for select
  using (activo = true);

-- Public read for published articles
create policy "Public can read published articles"
  on articulos for select
  using (publicado = true);

-- =============================================
-- Updated_at trigger
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger productos_updated_at
  before update on productos
  for each row execute function update_updated_at();

create trigger articulos_updated_at
  before update on articulos
  for each row execute function update_updated_at();
