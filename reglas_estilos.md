## Sistema de marca

### Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `brand-primary` | `#046ea3` | Color principal de marca. Botones primarios, links activos, estado seleccionado en navegación, encabezados de tabla. |
| `brand-dark` | `#001d4a` | Color de mayor jerarquía. Títulos principales, texto sobre fondos claros con máxima jerarquía, navegación lateral (fondo o texto destacado). |
| `brand-accent` | `#00cccc` | Acento. Estados activos secundarios, badges, indicadores de progreso, foco en inputs, highlights puntuales. Usar con moderación. |
| `brand-soft` | `#b9d6f2` | Fondo suave. Filas resaltadas, badges informativos, hover de items, fondos de tarjetas seleccionadas. |
| Grises | `gray-50` a `gray-900` de Tailwind | Texto neutral, bordes, fondos, separadores, estados deshabilitados. |
| Blanco | `#ffffff` | Fondo principal de cards y contenedores. |

**Reglas de uso:**
- El fondo general de la app es blanco o `gray-50`. Las cards y paneles van en blanco con borde gris claro (`gray-200`).
- `brand-primary` (`#046ea3`) es el color de acción. Botones principales, links, tabs activos, ítem seleccionado en sidebar.
- `brand-dark` (`#001d4a`) se usa para texto de alta jerarquía (títulos h1/h2 de sección) y para el fondo del sidebar lateral si lo hay.
- `brand-accent` (`#00cccc`) es un acento, no un color de acción. Úsalo para estados secundarios, badges, anillos de foco en inputs y barras de progreso. No lo uses en botones primarios.
- `brand-soft` (`#b9d6f2`) es un fondo informativo. Hover de filas en tablas, fondo de la fila/card seleccionada, fondo de badges informativos.
- Los estados semánticos (éxito, error, advertencia) sí pueden usar verdes/rojos/ámbar estándar de Tailwind cuando sean clínicamente significativos (ej. valor de laboratorio fuera de rango).

### Tipografía

- **Familia única**: Montserrat para todo.
- **Pesos disponibles**: Regular (400), Semibold (600).
- **Estilo cursiva**: Italic, usado únicamente para texto secundario tipo notas, descripciones de placeholder, leyendas de gráficas, o citas (no como decoración).
- **Escala tipográfica**:
  - 12px regular — meta (timestamps, IDs, etiquetas pequeñas)
  - 14px regular — cuerpo
  - 14px semibold — labels, encabezados de tabla, texto de botón
  - 16px semibold — títulos de card / sub-sección
  - 18px semibold — títulos de página
  - 22px semibold — solo para títulos principales con jerarquía máxima (`brand-dark`)
- **Importar Montserrat** desde Google Fonts en el artifact: `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;1,400&display=swap`.

### Otros tokens

- Bordes: 1px sólido `gray-200` en cards, tablas y separadores. Border-radius `rounded-md` (6px) como default; `rounded-lg` (8px) para cards grandes.
- Sombras: ninguna. Los contenedores se separan por borde, no por sombra.
- Espaciado: usa la escala de Tailwind (`p-4`, `p-6`, `gap-4`, etc.) de forma consistente.
- Iconos: Lucide-react en outline, 16px de default. Solo cuando aportan claridad (papelera, lápiz, calendario, búsqueda, filtro, descarga, chevron). Color heredado del texto.
- Imágenes y avatares: cuadros gris claro con la inicial del nombre o el texto "img" en gris medio. No uses imágenes reales.
- Gráficas: usa Recharts con líneas/barras en `brand-primary`. Sin colores adicionales salvo gris para series secundarias. Ejes etiquetados, sin grid decorativo.

### Modo único
Claro. No diseñes para modo oscuro en esta fase.

## Patrones de componentes

- **Botón primario**: fondo `brand-primary`, texto blanco, 14px semibold, padding horizontal generoso.
- **Botón secundario**: fondo blanco, borde 1px `brand-primary`, texto `brand-primary`.
- **Botón terciario / link**: solo texto `brand-primary` con hover subrayado.
- **Botón destructivo**: borde 1px rojo, texto rojo, fondo blanco.
- **Input**: borde 1px `gray-300`, label arriba (14px semibold, `gray-700`), placeholder `gray-400` en italic. Foco con anillo `brand-accent`.
- **Tabs**: barra horizontal, borde inferior `gray-200`. Tab activa con borde inferior 2px `brand-primary` y texto en `brand-primary` semibold.
- **Sidebar**: fondo `brand-dark` con texto blanco; ítem activo con fondo `brand-primary` o un borde lateral `brand-accent`.
- **Cards**: fondo blanco, borde 1px `gray-200`, `rounded-lg`, padding 24px. Título 16px semibold `brand-dark`.
- **Tabla**: encabezado con fondo `gray-50`, texto `gray-700` semibold 12px. Filas separadas por borde inferior `gray-100`. Fila hover `brand-soft`. Sin zebra striping.
- **Drawer lateral**: ancho 480px en desktop. Header con título y botón cerrar.
- **Modal**: centrado, ancho 480-720px. Sin overlay decorativo.
- **Estados vacíos**: caja con borde discontinuo `gray-300`, texto centrado italic explicando qué iría ahí y una acción primaria si aplica.
- **Badges**: pequeños, `rounded` (no pill), 12px semibold. Variante informativa: fondo `brand-soft`, texto `brand-dark`. Variante neutra: fondo `gray-100`, texto `gray-700`. Semánticas (éxito/error/advertencia) con sus colores estándar.
- **PDFs/archivos**: card con borde, ícono de documento (Lucide `FileText`), nombre, fecha, tamaño, botón de descarga.

## Contexto del producto

Plataforma de gestión clínica para una clínica (en el futuro será SaaS multi-clínica, pero el diseño inicial es para una sola). Atiende a pacientes a través de distintos tipos de profesionales: médicos generales y especialistas, psicólogos, nutriólogos y especialistas del deporte. Los profesionales pueden estar en diferentes países y zonas horarias.

## Tipos de usuario

1. **Especialistas** (médicos, psicólogos, nutriólogos, etc.): atienden pacientes, generan consultas, ordenan exámenes, prescriben, llenan notas evolutivas.
2. **Pacientes**: acceden a un portal donde ven sus citas, sus entregables (PDFs), llenan cuestionarios y consultan su historia clínica (sin notas médicas internas).
3. **Administrativos**: gestionan agenda, catálogos, configuración, usuarios y roles.

Los permisos son granulares: por módulo, por acción (crear/leer/actualizar/borrar) y por scope (`own` = solo sus pacientes, `all` = todos). Por defecto, un especialista solo ve a sus propios pacientes.

## Módulos del sistema

1. **Pacientes**: datos demográficos completos (nombre, apellidos, fecha de nacimiento, nacionalidad, países de origen y residencia, idiomas que habla, estado civil, raza, nivel socioeconómico, dirección). Identificador MRN tipo `PC-DDMMYYYY`. Tabla de alergias por tipo (alimentaria, medicamento, ambiental).

2. **Especialistas**: perfil, tipo profesional, especialidades (uno puede tener varias), zona horaria IANA, disponibilidad recurrente semanal y excepciones (vacaciones, días bloqueados).

3. **Citas**: estados (programada, confirmada, en curso, terminada, cancelada paciente, cancelada clínica, no asistió), modalidad (presencial o telemedicina), una cita puede tener varios especialistas. Recordatorios por email y WhatsApp con registro de envío.

4. **Consultas**: nacen de una cita. Incluyen motivo, plan diagnóstico, plan de tratamiento, evolución, diagnósticos múltiples (texto libre, no atados a CIE), síntomas (catálogo), prescripciones y notas evolutivas. Una consulta puede tener varias notas evolutivas, una por especialista cuando la cita es múltiple. Las notas usan plantillas configurables por tipo profesional.

5. **Antecedentes**: familiares, personales, cirugías y hospitalizaciones. Para cirugías y hospitalizaciones hay campos adicionales (institución, complicaciones, fechas de ingreso/egreso, motivo). Atados a CIE-10 cuando aplica.

6. **Medicamentos**: paciente_medicamento (actuales o previos que toma o tomaba el paciente) + prescripciones (recetadas en consulta). Catálogo propio. Validación contra alergias del paciente.

7. **Examen físico**: signos vitales estructurados + contenido flexible que llena el especialista.

8. **Composición corporal**: peso, talla, IMC, masa grasa (% y kg), masa magra (% y kg), masa muscular esquelética y prevista. Cada valor se mide por segmento: brazo izquierdo, brazo derecho, pierna izquierda, pierna derecha, torso, total.

9. **Exámenes**: laboratorios e imagenología. Catálogo de exámenes con valores de referencia. Cada resultado tiene valores estructurados individuales (cada analito por separado) + un PDF adjunto. Necesita gráficas de evolución a lo largo del tiempo. Las órdenes de examen son entregables imprimibles.

10. **Estilo de vida**: 8 componentes basados en AHA Life's Essential 8 (dieta, actividad física, exposición a nicotina, sueño, IMC, lípidos en sangre, glucosa, presión arterial). Cada uno con score 0-100 + score global promedio. Histórico de evaluaciones para ver evolución.

11. **Ingresables (cuestionarios)**: soportan opción única, opción múltiple, escalas, texto libre, numérico, fecha, booleano. Lógica condicional entre preguntas. Preguntas agrupadas. Scoring configurable (suma simple, suma ponderada, lookup por rango, función custom). Versionado de cuestionarios. Los resultados pueden aterrizar en estilo de vida, antecedentes, alergias o campos del paciente. El paciente los llena en el portal o el especialista en consulta.

12. **Entregables**: plantillas predefinidas (receta, orden de laboratorio, reporte nutricional, etc.). Estructura base fija + datos dinámicos por paciente. Generación manual, output en PDF, firma manual posterior a impresión.

13. **Usuarios, roles y permisos**: roles personalizables, permisos por módulo + acción + scope.

## Consideraciones de comportamiento que deben reflejarse

- Todas las fechas/horas se muestran en la zona horaria local del usuario; indicar zona horaria cuando es relevante (citas internacionales).
- Soft delete: vista de papelera para administradores.
- Versionado de registros clínicos: los registros con ediciones deben tener un indicador visual y permitir abrir un historial de versiones.
- Multi-idioma: la UI debe poderse cambiar entre español e inglés (mostrar selector donde corresponda).
- Archivos (PDFs, imágenes) viven en S3: mostrar previews/enlaces de descarga como cards de archivo.

## Pantallas a generar (pídeme una a la vez)

### Para especialistas
1. Dashboard del especialista (citas del día, pacientes recientes, pendientes).
2. Listado de pacientes con filtros y búsqueda.
3. Expediente del paciente (vista 360° con tabs: resumen, antecedentes, consultas, exámenes, medicamentos, estilo de vida, ingresables, entregables).
4. Pantalla de consulta en curso (signos vitales, examen físico, evolución, diagnósticos, prescripción, notas evolutivas, generar entregables).
5. Editor de cuestionario / ingresable (constructor visual con preguntas, lógica condicional, grupos, scoring).
6. Vista de respuestas de un ingresable con resultados y diagnósticos generados.
7. Calendario de citas con vista día/semana/mes y filtro por especialista.
8. Comparativa histórica de exámenes (gráficas de evolución por analito).
9. Vista detallada de composición corporal con segmentos del cuerpo.

### Para pacientes (portal)
10. Dashboard del paciente (próxima cita, ingresables pendientes, últimos entregables).
11. Listado e historial de citas.
12. Llenado de un cuestionario (con barra de progreso, navegación por preguntas, lógica condicional).
13. Vista de entregables (lista descargable).
14. Mi historia clínica (resumen sin notas médicas internas).

### Para administradores
15. Gestión de usuarios, roles y permisos.
16. Gestión de catálogos (medicamentos, exámenes, listas demográficas).
17. Gestión de plantillas de notas evolutivas y entregables.
18. Configuración de la clínica.

## Cómo entregar cada pantalla

Genera la pantalla como un **artifact React funcional** usando Tailwind, con las restricciones de estilo y marca descritas arriba. Importa Montserrat al inicio del artifact y aplícalo a todo el contenido. Define los colores de marca como variables CSS o clases de Tailwind personalizadas (`bg-[#046ea3]`, etc.) para que estén centralizados.

Que la pantalla sea interactiva (clics, tabs, drawers funcionales) pero visualmente cruda y consistente con la marca. Incluye datos de ejemplo realistas. Si la pantalla tiene varios estados (vacío, cargando, error, con datos), muestra por defecto el estado con datos y al final del artifact agrega notas breves describiendo cómo cambiarían los demás estados.

Cuando termines la pantalla, lista al pie del artifact:
- Componentes reutilizables que detectaste y que deberían volverse parte de un sistema de diseño (ej. `PatientHeader`, `ClinicalRecordCard`, `EmptyState`).
- Supuestos que hiciste y que valdría la pena confirmar.
- Preguntas abiertas sobre comportamiento que aún no están definidas.
x