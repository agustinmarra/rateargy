interface DisclaimerBannerProps {
  variant?: 'tasas' | 'prestamos' | 'seguros'
}

const CONTENT = {
  tasas: {
    icon: '⚠',
    title: 'Tasas referenciales',
    text: 'La TNA de rendimiento varía frecuentemente según la política de cada entidad. Verificá siempre la tasa vigente antes de decidir.',
  },
  prestamos: {
    icon: '⚠',
    title: 'Importante',
    text: 'Las tasas (TNA/CFT) varían frecuentemente según la política del BCRA y el perfil del solicitante. Siempre verificá la tasa vigente y el CFT directamente con el banco antes de firmar.',
  },
  seguros: {
    icon: '⚠',
    title: 'Precios referenciales',
    text: 'Las primas varían según marca, modelo, año del vehículo, zona y perfil del conductor. Cotizá directamente con la aseguradora para obtener tu precio real.',
  },
}

export default function DisclaimerBanner({ variant = 'tasas' }: DisclaimerBannerProps) {
  const { icon, title, text } = CONTENT[variant]
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <span className="text-amber-500 text-lg shrink-0">{icon}</span>
      <p style={{ fontSize: 14, color: '#92400e' }}>
        <strong>{title}:</strong> {text}
      </p>
    </div>
  )
}
