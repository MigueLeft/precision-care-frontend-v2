// Fotos de referencia de porciones que NutriBot muestra con el marcador
// [IMG:clave] (traídas de precision-system). Viven en /public/catalogo.
export interface FoodImageVariant {
  label: string
  grams: number
  unit?: string
  src: string
}

export interface FoodImageEntry {
  label: string
  variants: FoodImageVariant[]
}

export const foodImages: Record<string, FoodImageEntry> = {
  atun: {
    label: 'Atún',
    variants: [{ label: 'porción escurrida', grams: 120, src: '/catalogo/atun_120g.jpg' }],
  },
  banana: {
    label: 'Banana / plátano',
    variants: [{ label: 'unidad', grams: 80, src: '/catalogo/banana_80g.jpg' }],
  },
  bistec: {
    label: 'Bistec',
    variants: [
      { label: 'porción pequeña', grams: 50, src: '/catalogo/bistec_50gr.jpg' },
      { label: 'porción', grams: 150, src: '/catalogo/bistec_150g.jpg' },
    ],
  },
  bol_frutas: {
    label: 'Bol de frutas',
    variants: [{ label: 'bol', grams: 200, src: '/catalogo/bol_frutas_200g.jpg' }],
  },
  brocoli: {
    label: 'Brócoli',
    variants: [{ label: 'porción', grams: 200, src: '/catalogo/brocoli_200g.jpg' }],
  },
  carne_hamburguesa: {
    label: 'Carne de hamburguesa',
    variants: [{ label: 'unidad', grams: 100, src: '/catalogo/carne_hamburgesa_100g.jpg' }],
  },
  cebolla: {
    label: 'Cebolla',
    variants: [{ label: 'unidad', grams: 200, src: '/catalogo/cebolla_200g.jpg' }],
  },
  chorizo: {
    label: 'Chorizo',
    variants: [{ label: 'unidad', grams: 125, src: '/catalogo/chorico_125g.jpg' }],
  },
  chuleta_cerdo: {
    label: 'Chuleta de cerdo',
    variants: [{ label: 'unidad', grams: 80, src: '/catalogo/chuleta_cerdo_80g.jpg' }],
  },
  arroz: {
    label: 'Arroz',
    variants: [{ label: 'plato completo', grams: 230, src: '/catalogo/plato_arroz_230g.jpg' }],
  },
  frijoles: {
    label: 'Frijoles',
    variants: [
      { label: 'en caldo', grams: 210, src: '/catalogo/210gr_caraotas_caldo.jpg' },
      { label: 'plato completo', grams: 175, src: '/catalogo/cuarto_frijoles_175g.jpg' },
    ],
  },
  lentejas: {
    label: 'Lentejas',
    variants: [{ label: 'plato completo', grams: 175, src: '/catalogo/plato_lentejas_175g.jpg' }],
  },
  lechuga_hoja: {
    label: 'Lechuga (hoja)',
    variants: [{ label: 'hoja', grams: 10, src: '/catalogo/hoja_lechuga_10g.jpg' }],
  },
  huevo: {
    label: 'Huevo',
    variants: [{ label: 'unidad', grams: 50, src: '/catalogo/huevo_50g.jpg' }],
  },
  huevo_revuelto: {
    label: 'Huevo revuelto',
    variants: [{ label: 'porción', grams: 50, src: '/catalogo/50gr_huevo_revuelto.jpg' }],
  },
  lechuga_cortada: {
    label: 'Lechuga cortada',
    variants: [
      { label: 'porción', grams: 50, src: '/catalogo/lechuga_cortada_50g.jpg' },
      { label: 'porción grande', grams: 150, src: '/catalogo/lechuga_150gr.jpg' },
    ],
  },
  mantequilla: {
    label: 'Mantequilla',
    variants: [{ label: 'porción', grams: 5, src: '/catalogo/mantequilla_5g.jpg' }],
  },
  manzana: {
    label: 'Manzana',
    variants: [
      { label: 'grande', grams: 200, src: '/catalogo/manzada_grande_200g_mediana_130g.jpg' },
      { label: 'mediana', grams: 130, src: '/catalogo/manzada_grande_200g_mediana_130g.jpg' },
    ],
  },
  pechuga_pollo: {
    label: 'Pechuga de pollo',
    variants: [{ label: 'media pechuga', grams: 300, src: '/catalogo/media_pechuga_pollo_300g.jpg' }],
  },
  pure_papa: {
    label: 'Puré de papa',
    variants: [{ label: 'medio plato', grams: 200, src: '/catalogo/medio_pure_papa_200g.jpg' }],
  },
  pan: {
    label: 'Pan',
    variants: [{ label: 'unidad', grams: 70, src: '/catalogo/pan_70g.jpg' }],
  },
  pan_molde: {
    label: 'Pan de molde',
    variants: [
      { label: 'rebanada blanca', grams: 20, src: '/catalogo/pan_blanco_20g_integral_25g.jpg' },
      { label: 'rebanada integral', grams: 25, src: '/catalogo/pan_blanco_20g_integral_25g.jpg' },
    ],
  },
  papa: {
    label: 'Papa',
    variants: [
      { label: 'grande', grams: 410, src: '/catalogo/papa_grande_410g_mediana_260g_peque_110g.jpg' },
      { label: 'mediana', grams: 260, src: '/catalogo/papa_grande_410g_mediana_260g_peque_110g.jpg' },
      { label: 'pequeña', grams: 110, src: '/catalogo/papa_grande_410g_mediana_260g_peque_110g.jpg' },
    ],
  },
  pasta: {
    label: 'Pasta',
    variants: [
      { label: 'porción mediana', grams: 230, src: '/catalogo/pasta_mediano_230g.jpg' },
      { label: 'porción grande', grams: 460, src: '/catalogo/pasta_grande_460g.jpg' },
    ],
  },
  pollo_pata_muslo: {
    label: 'Pollo (pata / muslo)',
    variants: [
      { label: 'pata', grams: 75, src: '/catalogo/pata_pollo_75g_muslo_pollo_120g.jpg' },
      { label: 'muslo', grams: 120, src: '/catalogo/pata_pollo_75g_muslo_pollo_120g.jpg' },
    ],
  },
  pescado: {
    label: 'Pescado',
    variants: [
      { label: 'pequeño', grams: 75, src: '/catalogo/pescado_peque_75g.jpg' },
      { label: 'mediano', grams: 100, src: '/catalogo/pescado_mediano_100g.jpg' },
      { label: 'grande', grams: 180, src: '/catalogo/pescado_grande_180g.jpg' },
    ],
  },
  rebanada_jamon: {
    label: 'Jamón',
    variants: [{ label: 'rebanada', grams: 35, src: '/catalogo/rebanada_jamon_35g.jpg' }],
  },
  rebanada_queso: {
    label: 'Queso en lonchas',
    variants: [{ label: 'rebanada', grams: 10, src: '/catalogo/rebanada_queso_10g.jpg' }],
  },
  salame: {
    label: 'Salame',
    variants: [{ label: 'rebanada', grams: 10, src: '/catalogo/salame_10g.jpg' }],
  },
  tomate: {
    label: 'Tomate',
    variants: [
      { label: 'perita', grams: 110, src: '/catalogo/tomate_perita_110g_tomate_mediano_180g_tomate_peque_140g.jpg' },
      { label: 'pequeño', grams: 140, src: '/catalogo/tomate_perita_110g_tomate_mediano_180g_tomate_peque_140g.jpg' },
      { label: 'mediano', grams: 180, src: '/catalogo/tomate_perita_110g_tomate_mediano_180g_tomate_peque_140g.jpg' },
    ],
  },
  zanahoria: {
    label: 'Zanahoria',
    variants: [
      { label: 'pequeña', grams: 40, src: '/catalogo/zanahoria_grande_90g_mediana_60g_peque_40g.jpg' },
      { label: 'mediana', grams: 60, src: '/catalogo/zanahoria_grande_90g_mediana_60g_peque_40g.jpg' },
      { label: 'grande', grams: 90, src: '/catalogo/zanahoria_grande_90g_mediana_60g_peque_40g.jpg' },
      { label: 'rallada', grams: 100, src: '/catalogo/zanahoria_rayada_100gr.jpg' },
    ],
  },
  vaso_cerveza: {
    label: 'Cerveza',
    variants: [{ label: 'vaso', grams: 250, unit: 'ml', src: '/catalogo/vaso_cerveza_250cc.jpg' }],
  },
  vaso_jugo: {
    label: 'Jugo',
    variants: [{ label: 'vaso', grams: 200, unit: 'ml', src: '/catalogo/vaso_jugo_200cc.jpg' }],
  },
  vaso_leche: {
    label: 'Leche',
    variants: [{ label: 'vaso', grams: 250, unit: 'ml', src: '/catalogo/vaso_leche_250cc.jpg' }],
  },
  taza_cafe: {
    label: 'Café',
    variants: [{ label: 'taza mediana', grams: 150, unit: 'ml', src: '/catalogo/taza_cafe_mediana.jpg' }],
  },
  arepa: {
    label: 'Arepa',
    variants: [{ label: 'unidad', grams: 100, src: '/catalogo/100gr_arepa.jpg' }],
  },
  hamburguesa_completa: {
    label: 'Hamburguesa completa',
    variants: [{ label: 'unidad', grams: 102, src: '/catalogo/102gr_hamburgesa.jpg' }],
  },
  aguacate: {
    label: 'Aguacate',
    variants: [{ label: 'unidad', grams: 115, src: '/catalogo/115gr_aguacate.jpg' }],
  },
  carne_tres_presentaciones: {
    label: 'Carne de res (variedad de cortes)',
    variants: [{ label: 'porción', grams: 120, src: '/catalogo/120gr_carne_tres_presentaciones.jpg' }],
  },
  tajadas: {
    label: 'Tajadas de plátano maduro frito',
    variants: [{ label: 'porción', grams: 150, src: '/catalogo/150gr_tajadas.jpg' }],
  },
  tostones: {
    label: 'Tostones / patacones',
    variants: [{ label: 'porción', grams: 150, src: '/catalogo/150gr_tostones.jpg' }],
  },
  fruta_picada: {
    label: 'Fruta picada',
    variants: [{ label: 'porción', grams: 200, src: '/catalogo/200cc_fruta_picada.jpg' }],
  },
  sopa: {
    label: 'Sopa / caldo',
    variants: [{ label: 'plato', grams: 240, src: '/catalogo/240gr_sopa.jpg' }],
  },
  ensalada: {
    label: 'Ensalada',
    variants: [{ label: 'porción', grams: 240, src: '/catalogo/240oz_ensalada.jpg' }],
  },
  vegetales_mixtos: {
    label: 'Vegetales mixtos',
    variants: [{ label: 'porción', grams: 240, src: '/catalogo/240oz_vegetales.jpg' }],
  },
  yuca: {
    label: 'Yuca',
    variants: [{ label: 'porción', grams: 50, src: '/catalogo/50gr_yuca.jpg' }],
  },
  papas_fritas: {
    label: 'Papas fritas',
    variants: [{ label: 'porción', grams: 68, src: '/catalogo/68gr_papas_fritas.jpg' }],
  },
  cachapa: {
    label: 'Cachapa',
    variants: [{ label: 'unidad', grams: 80, src: '/catalogo/80gr_cachapa.jpg' }],
  },
  empanada: {
    label: 'Empanada',
    variants: [{ label: 'unidad', grams: 80, src: '/catalogo/80gr_empanadas.jpg' }],
  },
  albondiga: {
    label: 'Albóndiga',
    variants: [{ label: 'unidad', grams: 50, src: '/catalogo/albondiga_50gr.jpg' }],
  },
  auyama: {
    label: 'Auyama / calabaza',
    variants: [
      { label: 'pequeña', grams: 60, src: '/catalogo/auyama_grande_80gr_mediana_70gr_peque_60gr.jpg' },
      { label: 'mediana', grams: 70, src: '/catalogo/auyama_grande_80gr_mediana_70gr_peque_60gr.jpg' },
      { label: 'grande', grams: 80, src: '/catalogo/auyama_grande_80gr_mediana_70gr_peque_60gr.jpg' },
    ],
  },
  auyama_pure: {
    label: 'Puré de auyama',
    variants: [{ label: 'porción', grams: 200, src: '/catalogo/auyama_pure_200gr.jpg' }],
  },
  berenjena: {
    label: 'Berenjena',
    variants: [
      { label: 'pequeña', grams: 230, src: '/catalogo/berenjena_grande_350gr_peque_230gr.jpg' },
      { label: 'grande', grams: 350, src: '/catalogo/berenjena_grande_350gr_peque_230gr.jpg' },
    ],
  },
  carne_de_res: {
    label: 'Carne de res',
    variants: [
      { label: 'porción', grams: 200, src: '/catalogo/carne_de_res_200gr.jpg' },
      { label: 'porción grande', grams: 270, src: '/catalogo/carne_de_res_270gr.jpg' },
    ],
  },
  coliflor: {
    label: 'Coliflor',
    variants: [{ label: 'porción', grams: 200, src: '/catalogo/coliflor_200gr.jpg' }],
  },
  ensalada_lechuga_tomate: {
    label: 'Ensalada de lechuga y tomate',
    variants: [
      { label: 'lechuga', grams: 50, src: '/catalogo/ensalada_lechuga_50gr_tomate_110gr.jpg' },
      { label: 'tomate', grams: 110, src: '/catalogo/ensalada_lechuga_50gr_tomate_110gr.jpg' },
    ],
  },
  kiwi: {
    label: 'Kiwi',
    variants: [{ label: 'unidad', grams: 90, src: '/catalogo/kiwi_90gr.jpg' }],
  },
  naranja: {
    label: 'Naranja',
    variants: [
      { label: 'mediana', grams: 170, src: '/catalogo/naranja_grande_230gr_mediana_170gr.jpg' },
      { label: 'grande', grams: 230, src: '/catalogo/naranja_grande_230gr_mediana_170gr.jpg' },
    ],
  },
  prepizza: {
    label: 'Pizza personal',
    variants: [
      { label: 'porción/tajada', grams: 35, src: '/catalogo/prepizza_35gr_completa_280gr.jpg' },
      { label: 'pizza completa', grams: 280, src: '/catalogo/prepizza_35gr_completa_280gr.jpg' },
    ],
  },
  queso_duro: {
    label: 'Queso duro',
    variants: [
      { label: 'pequeño', grams: 50, src: '/catalogo/queso_duro_mediano_100gr_peque_50gr.jpg' },
      { label: 'mediano', grams: 100, src: '/catalogo/queso_duro_mediano_100gr_peque_50gr.jpg' },
    ],
  },
  queso_semiduro: {
    label: 'Queso semiduro',
    variants: [{ label: 'porción', grams: 100, src: '/catalogo/queso_semiduro_100gr.jpg' }],
  },
  sardina: {
    label: 'Sardina',
    variants: [
      { label: 'porción', grams: 150, src: '/catalogo/sardina_150gr.jpg' },
      { label: 'porción grande', grams: 270, src: '/catalogo/sardina_270gr.jpg' },
    ],
  },
}
