// ============================================================
// GENERADO AUTOMÁTICAMENTE DESDE GOOGLE SHEETS
// NO EDITAR MANUALMENTE — usar el Sheet
// Sheet: https://docs.google.com/spreadsheets/d/1bv7iUYwgrLcKLTA715Z8p1F3RqgMwaQtXKkYLgZXCoY
// Última sincronización: 18/4/2026, 04:02:01
// ============================================================

export type CatKey = "super"|"nafta"|"farmacia"|"delivery"|"online"|"servicios"
export type Gastos = Record<CatKey, number>

export type Beneficio = {
  pct: number
  tope: number
  dias: string
  lugar: string
  descripcion: string
}

export type Tarjeta = {
  id: string
  publicada: boolean
  nombre: string
  banco: string
  bancoId: string
  red: string
  costoAnual: number
  urlSolicitud: string
  gradiente: string
  beneficios: Record<CatKey, Beneficio>
  pills: string[]
}

export const TARJETAS: Tarjeta[] = [
  {
    "id": "galicia-eminent",
    "publicada": true,
    "nombre": "Galicia Éminent Visa Signature",
    "banco": "Banco Galicia",
    "bancoId": "galicia",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.galicia.com.ar/personas/tarjetas/credito",
    "gradiente": "linear-gradient(135deg, #134e32 0%, #1a7f4f 60%, #22c55e 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 25000,
        "dias": "lunes / martes / martes y jueves / jueves / viernes y sabado / viernes sabado y domingo",
        "lugar": "Changomas / Coto / Jumbo / Makro / DIA / La Anónima / Disco y Vea",
        "descripcion": "20% con MODO desde app Galicia. Mínimo $75.000"
      },
      "nafta": {
        "pct": 15,
        "tope": 15000,
        "dias": "lunes",
        "lugar": "Todas las estaciones",
        "descripcion": "15% Éminent con Mastercard y MODO"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "Sin beneficio verificado"
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "Sin beneficio verificado"
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "Sin beneficio verificado"
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en Changomas lunes / martes / martes y jueves / jueves / viernes y sabado / viernes sabado y domingo",
      "15% nafta lunes"
    ]
  },
  {
    "id": "galicia-gold",
    "publicada": true,
    "nombre": "Galicia Visa Gold",
    "banco": "Banco Galicia",
    "bancoId": "galicia",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.galicia.com.ar/personas/tarjetas/credito",
    "gradiente": "linear-gradient(135deg, #134e32 0%, #1a7f4f 60%, #22c55e 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 25000,
        "dias": "lunes / martes / martes y jueves",
        "lugar": "Changomas / Coto / Jumbo",
        "descripcion": "20% con MODO desde app Galicia"
      },
      "nafta": {
        "pct": 10,
        "tope": 10000,
        "dias": "lunes",
        "lugar": "Todas las estaciones",
        "descripcion": "10% con Mastercard y MODO"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en Changomas lunes / martes / martes y jueves",
      "10% nafta lunes"
    ]
  },
  {
    "id": "bbva-platinum",
    "publicada": false,
    "nombre": "BBVA Visa Platinum",
    "banco": "BBVA",
    "bancoId": "bbva",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.bbva.com.ar/personas/tarjetas-de-credito.html",
    "gradiente": "linear-gradient(135deg, #0a2540 0%, #004481 60%, #0ea5e9 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en bbva.com.ar"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en bbva.com.ar"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en bbva.com.ar"
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": []
  },
  {
    "id": "bbva-gold",
    "publicada": false,
    "nombre": "BBVA Visa Gold",
    "banco": "BBVA",
    "bancoId": "bbva",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.bbva.com.ar/personas/tarjetas-de-credito.html",
    "gradiente": "linear-gradient(135deg, #0a2540 0%, #004481 60%, #0ea5e9 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en bbva.com.ar"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": []
  },
  {
    "id": "santander-gold",
    "publicada": true,
    "nombre": "Santander Visa Gold",
    "banco": "Santander",
    "bancoId": "santander",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.santander.com.ar/banco/online/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 60%, #f87171 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en santander.com.ar"
      },
      "nafta": {
        "pct": 10,
        "tope": 7500,
        "dias": "jueves",
        "lugar": "YPF",
        "descripcion": "10% Platinum/Black desde App YPF"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "10% nafta jueves"
    ]
  },
  {
    "id": "santander-platinum",
    "publicada": false,
    "nombre": "Santander Visa Platinum",
    "banco": "Santander",
    "bancoId": "santander",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.santander.com.ar/banco/online/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 60%, #f87171 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en santander.com.ar"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": []
  },
  {
    "id": "macro-visa",
    "publicada": true,
    "nombre": "Macro Visa Gold",
    "banco": "Banco Macro",
    "bancoId": "macro",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.macro.com.ar/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #78350f 0%, #b45309 60%, #fbbf24 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 15000,
        "dias": "miercoles",
        "lugar": "Todas",
        "descripcion": "20% Platinum con MODO"
      },
      "nafta": {
        "pct": 20,
        "tope": 15000,
        "dias": "miercoles",
        "lugar": "YPF",
        "descripcion": "20% Platinum con MODO - 30% Selecta tope $25.000"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en Todas miercoles",
      "20% nafta miercoles"
    ]
  },
  {
    "id": "macro-platinum",
    "publicada": true,
    "nombre": "Macro Visa Platinum",
    "banco": "Banco Macro",
    "bancoId": "macro",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.macro.com.ar/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #78350f 0%, #b45309 60%, #fbbf24 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "nafta": {
        "pct": 30,
        "tope": 25000,
        "dias": "miercoles",
        "lugar": "YPF",
        "descripcion": "30% Selecta con MODO"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "30% nafta miercoles"
    ]
  },
  {
    "id": "naranja-x",
    "publicada": false,
    "nombre": "Naranja X Mastercard",
    "banco": "Naranja X",
    "bancoId": "naranja-x",
    "red": "Mastercard",
    "costoAnual": 0,
    "urlSolicitud": "https://www.naranjax.com/quiero-mi-tarjeta",
    "gradiente": "linear-gradient(135deg, #7c2d12 0%, #c2410c 60%, #fb923c 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en naranjax.com"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en naranjax.com"
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en naranjax.com"
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": []
  },
  {
    "id": "bna-gold",
    "publicada": true,
    "nombre": "BNA Visa Gold",
    "banco": "Banco Nación",
    "bancoId": "bna",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.bna.com.ar/Personas/TarjetasDeCredito",
    "gradiente": "linear-gradient(135deg, #0c1445 0%, #1e3a8a 60%, #3b82f6 100%)",
    "beneficios": {
      "super": {
        "pct": 30,
        "tope": 12000,
        "dias": "miercoles",
        "lugar": "Todas",
        "descripcion": "30% con tarjeta BNA"
      },
      "nafta": {
        "pct": 20,
        "tope": 10000,
        "dias": "viernes",
        "lugar": "YPF y Shell",
        "descripcion": "20% con MODO BNA+"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "30% en Todas miercoles",
      "20% nafta viernes"
    ]
  },
  {
    "id": "supervielle",
    "publicada": true,
    "nombre": "Supervielle Visa",
    "banco": "Supervielle",
    "bancoId": "supervielle",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.supervielle.com.ar/tarjetas",
    "gradiente": "linear-gradient(135deg, #431407 0%, #9a3412 60%, #f97316 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 25000,
        "dias": "martes",
        "lugar": "Jumbo y Disco",
        "descripcion": "20% los martes"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 50,
        "tope": 5000,
        "dias": "",
        "lugar": "Farmacias adheridas",
        "descripcion": "50% en farmacias adheridas"
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en Jumbo y Disco martes",
      "50% farmacias"
    ]
  },
  {
    "id": "icbc-platinum",
    "publicada": true,
    "nombre": "ICBC Visa Platinum",
    "banco": "ICBC",
    "bancoId": "icbc",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.icbc.com.ar/ICBC/Personas/Tarjetas",
    "gradiente": "linear-gradient(135deg, #4c0519 0%, #9f1239 60%, #fb7185 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 20000,
        "dias": "",
        "lugar": "Todas",
        "descripcion": "20% todos los días"
      },
      "nafta": {
        "pct": 15,
        "tope": 15000,
        "dias": "martes",
        "lugar": "Todas",
        "descripcion": "15% con cuenta sueldo"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en Todas",
      "15% nafta martes"
    ]
  },
  {
    "id": "uala",
    "publicada": true,
    "nombre": "Ualá Mastercard",
    "banco": "Ualá",
    "bancoId": "uala",
    "red": "Mastercard",
    "costoAnual": 0,
    "urlSolicitud": "https://www.uala.com.ar",
    "gradiente": "linear-gradient(135deg, #2e1065 0%, #5b21b6 60%, #a78bfa 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en uala.com.ar"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 5,
        "tope": 5000,
        "dias": "",
        "lugar": "Todas",
        "descripcion": "5% cashback general"
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "5% online"
    ]
  },
  {
    "id": "mercado-pago",
    "publicada": true,
    "nombre": "Tarjeta Mercado Pago",
    "banco": "Mercado Pago",
    "bancoId": "mercado-pago",
    "red": "Mastercard",
    "costoAnual": 0,
    "urlSolicitud": "https://www.mercadopago.com.ar/tarjeta-de-credito",
    "gradiente": "linear-gradient(135deg, #003087 0%, #009ee3 60%, #00b1ea 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": "VERIFICAR en mercadopago.com.ar"
      },
      "nafta": {
        "pct": 10,
        "tope": 6000,
        "dias": "",
        "lugar": "YPF",
        "descripcion": "10% con Tarjeta Crédito MP"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "10% nafta"
    ]
  },
  {
    "id": "personal-pay",
    "publicada": true,
    "nombre": "Personal Pay Visa",
    "banco": "Personal Pay",
    "bancoId": "personal-pay",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.personal.com.ar/beneficios/personal-pay",
    "gradiente": "linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #818cf8 100%)",
    "beneficios": {
      "super": {
        "pct": 25,
        "tope": 15000,
        "dias": "",
        "lugar": "Adheridos",
        "descripcion": "25% en supermercados adheridos"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 15,
        "tope": 6000,
        "dias": "",
        "lugar": "Adheridas",
        "descripcion": "15% en farmacias adheridas"
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "25% en Adheridos",
      "15% farmacias"
    ]
  },
  {
    "id": "credicoop",
    "publicada": true,
    "nombre": "Credicoop Cabal",
    "banco": "Banco Credicoop",
    "bancoId": "credicoop",
    "red": "Cabal",
    "costoAnual": 0,
    "urlSolicitud": "https://www.bancocredicoop.coop/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #0c2340 0%, #1e40af 60%, #60a5fa 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 10500,
        "dias": "jueves",
        "lugar": "Todas",
        "descripcion": "20% los jueves"
      },
      "nafta": {
        "pct": 15,
        "tope": 4500,
        "dias": "viernes",
        "lugar": "Todas",
        "descripcion": "15% viernes - tope diario"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en Todas jueves",
      "15% nafta viernes"
    ]
  },
  {
    "id": "patagonia",
    "publicada": true,
    "nombre": "Patagonia Visa",
    "banco": "Banco Patagonia",
    "bancoId": "patagonia",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.bancopatagonia.com.ar/index.php/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #052e16 0%, #166534 60%, #4ade80 100%)",
    "beneficios": {
      "super": {
        "pct": 35,
        "tope": 15000,
        "dias": "jueves",
        "lugar": "La Anónima",
        "descripcion": "35% los jueves en La Anónima"
      },
      "nafta": {
        "pct": 20,
        "tope": 10000,
        "dias": "jueves",
        "lugar": "Todas",
        "descripcion": "20% jueves - 25% cuenta sueldo"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "35% en La Anónima jueves",
      "20% nafta jueves"
    ]
  },
  {
    "id": "cuenta-dni",
    "publicada": true,
    "nombre": "Cuenta DNI Visa",
    "banco": "Banco Provincia",
    "bancoId": "provincia",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.bancoprovincia.com.ar/cuentadni",
    "gradiente": "linear-gradient(135deg, #0d3d3d 0%, #0f766e 60%, #2dd4bf 100%)",
    "beneficios": {
      "super": {
        "pct": 20,
        "tope": 8000,
        "dias": "lunes",
        "lugar": "DIA",
        "descripcion": "20% los lunes en DIA"
      },
      "nafta": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 30,
        "tope": 5000,
        "dias": "finde",
        "lugar": "Todas",
        "descripcion": "30% delivery los fines de semana"
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% en DIA lunes"
    ]
  },
  {
    "id": "brubank",
    "publicada": true,
    "nombre": "Brubank Mastercard",
    "banco": "Brubank",
    "bancoId": "brubank",
    "red": "Mastercard",
    "costoAnual": 0,
    "urlSolicitud": "https://www.brubank.com.ar",
    "gradiente": "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #7c3aed 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "nafta": {
        "pct": 20,
        "tope": 30000,
        "dias": "",
        "lugar": "Todas",
        "descripcion": "20% Plan Plus - 30% Plan Ultra"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "20% nafta"
    ]
  },
  {
    "id": "hipotecario",
    "publicada": true,
    "nombre": "Hipotecario Visa",
    "banco": "Banco Hipotecario",
    "bancoId": "hipotecario",
    "red": "Visa",
    "costoAnual": 0,
    "urlSolicitud": "https://www.hipotecario.com.ar/personas/tarjetas",
    "gradiente": "linear-gradient(135deg, #0c1445 0%, #1e3a8a 60%, #60a5fa 100%)",
    "beneficios": {
      "super": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "nafta": {
        "pct": 15,
        "tope": 8000,
        "dias": "martes",
        "lugar": "Todas",
        "descripcion": "15% clientes Búho One"
      },
      "farmacia": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "delivery": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "online": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      },
      "servicios": {
        "pct": 0,
        "tope": 0,
        "dias": "",
        "lugar": "",
        "descripcion": ""
      }
    },
    "pills": [
      "15% nafta martes"
    ]
  }
]

export const TARJETAS_PUBLICAS: Tarjeta[] = TARJETAS.filter(t => t.publicada)

export const CATS: { key: CatKey; label: string }[] = [
  { key: "super",     label: "Supermercados" },
  { key: "nafta",     label: "Nafta / combustible" },
  { key: "farmacia",  label: "Farmacia / salud" },
  { key: "delivery",  label: "Restaurantes / delivery" },
  { key: "online",    label: "Compras online" },
  { key: "servicios", label: "Servicios (luz, gas, tel.)" },
]

export function calcularAhorro(tarjeta: Tarjeta, gastos: Gastos): number {
  return Math.round(
    (Object.keys(gastos) as CatKey[]).reduce((acc, cat) => {
      const b = tarjeta.beneficios[cat]
      if (!b?.pct || !gastos[cat]) return acc
      return acc + Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity)
    }, 0)
  )
}

export function rankear(gastos: Gastos) {
  return [...TARJETAS_PUBLICAS]
    .map(t => ({ ...t, ahorro: calcularAhorro(t, gastos) }))
    .sort((a, b) => b.ahorro - a.ahorro)
}
