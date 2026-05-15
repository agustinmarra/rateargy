"use client"

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts"

const CELESTE = "#5BA0D0"
const DORADO  = "#C9A84C"
const MUTED   = "#C5D8E8"

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(n)

type Dato = { nombre: string; ahorro: number; idx: number }

// Custom tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: Dato }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: "#0C1623", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    }}>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
        #{d.idx + 1}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>{d.nombre}</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: d.idx === 0 ? DORADO : CELESTE }}>
        {formatARS(d.ahorro)}<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>/mes</span>
      </div>
    </div>
  )
}

export default function AhorroChart({
  datos,
}: {
  datos: { nombre: string; ahorro: number }[]
}) {
  const top = datos.slice(0, 10).map((d, idx) => ({ ...d, idx }))
  const maxAhorro = top[0]?.ahorro ?? 1

  return (
    <div style={{
      background: "#0C1623",
      borderRadius: 20,
      padding: "28px 24px 20px",
      marginBottom: 40,
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: DORADO, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            Ahorro estimado mensual
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
            Ranking visual de tarjetas
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Mejor opción</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: DORADO }}>{formatARS(maxAhorro)}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={top.length * 44 + 16}>
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 0, right: 80, left: 0, bottom: 0 }}
          barCategoryGap="22%"
        >
          <XAxis
            type="number"
            hide
            domain={[0, maxAhorro * 1.15]}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            width={140}
            tick={{ fontSize: 12, fill: "rgba(255,255,255,0.65)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="ahorro" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {top.map((d) => (
              <Cell
                key={d.nombre}
                fill={d.idx === 0 ? DORADO : d.idx === 1 ? CELESTE : MUTED}
                opacity={d.idx === 0 ? 1 : d.idx <= 2 ? 0.85 : 0.55}
              />
            ))}
            <LabelList
              dataKey="ahorro"
              position="right"
              formatter={(v: unknown) => formatARS(v as number)}
              style={{ fontSize: 11, fontWeight: 700, fill: "rgba(255,255,255,0.6)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[{ color: DORADO, label: "#1 — Mejor para tu perfil" }, { color: CELESTE, label: "#2–#3" }, { color: MUTED, label: "Resto" }].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
