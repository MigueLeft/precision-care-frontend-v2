# Contenido clínico: Medicamentos, Síntomas, Enfermedades y Antecedentes

## 1. Medicamentos

### Catálogo de medicamentos
Cada medicamento del catálogo tiene:

| Dato | Descripción | Ejemplo |
|---|---|---|
| Nombre comercial | Marca del medicamento | Glucophage |
| Nombre genérico | Principio activo | Metformina |
| Presentación | Subcatálogo de formas farmacéuticas | Tableta, cápsula, jarabe… |
| Concentración | Dosis por unidad (opcional) | 850 mg |
| Categoría | Subcatálogo de grupo terapéutico (opcional) | Antidiabético |

### Medicamentos del paciente
Cada medicamento que toma el paciente registra:

- **Estado:** **Actual** (lo sigue tomando) o **Previo** (ya no lo toma).
- **Esquema:** dosis, frecuencia, duración, cantidad y presentación.
- **Fechas:** inicio del tratamiento (si no se indica, se usa la fecha de alta) y fin.
- **Médico que lo prescribió.**
- **Motivo de suspensión**, cuando deja de tomarlo.
- **Adherencia:** Buena, Parcial o Mala, con notas.
- **RAM (reacción adversa al medicamento):** No, Sospecha o Confirmada, con notas.

### Acciones sobre un tratamiento
- **Finalizar tratamiento:** el medicamento pasa a *Previo*, con el motivo que se capture. Si no se captura motivo, se usa "Tratamiento finalizado".
- **RAM confirmada:** confirmar una RAM **no suspende** el medicamento por sí solo. El médico decide si lo suspende. Si lo hace, el motivo por defecto es "RAM confirmado". El medicamento sigue visible en esa consulta, marcado en rojo como "Suspendido por RAM confirmado".
- **Reemplazar por otro medicamento:** el medicamento actual pasa a *Previo* con el motivo "Reemplazado por *[nombre]*". El nuevo medicamento queda como *Actual*.

### Recetas
En la consulta también se pueden emitir recetas. Cada receta indica medicamento, dosis, vía de administración, frecuencia, duración e indicaciones.

### En el expediente
- **Medicamentos actuales:** muestra dosis, médico que lo prescribió, adherencia y RAM.
- **Medicamentos previos:** muestra el motivo de suspensión y las notas de adherencia y RAM.

---

## 2. Síntomas

### Catálogo de síntomas
Es un catálogo **fundamentado en el CIE-10**. Ejemplos: dolor torácico no especificado, palpitaciones, disnea, síncope, fiebre de origen desconocido, fatiga crónica. El catálogo crece con los síntomas que se agregan desde la consulta. Los nombres solo admiten letras.

### Qué se registra de cada síntoma
- **Síntoma** (del catálogo).
- **Severidad:** leve, moderada o grave.
- **Estado:**
  - **Activo**: el paciente lo presenta actualmente.
  - **Bajo investigación**: se está estudiando su causa.
  - **Controlado**: está presente, pero bajo control.
  - **Descartado**: se determinó que no aplica.
  - **Resuelto**: ya desapareció.
- **Enfermedad asociada:** permite vincular el síntoma a una enfermedad del paciente (opcional).
- **Fecha de inicio:** si no se indica, se usa la fecha de la consulta.
- **Notas** clínicas.

---

## 3. Enfermedades

### Catálogo de enfermedades
Cada enfermedad del catálogo tiene:

- **Nombre.**
- **Código de referencia** (opcional), por ejemplo el código **CIE-10**. Se muestra junto al nombre.
- **Crónica o aguda:** define qué estados puede tener la enfermedad.
- **Aparato o sistema:** se asigna en el catálogo y se copia a cada registro del paciente. Ya no se elige durante la consulta.

### Catálogo de aparatos y sistemas
Está organizado según los capítulos del CIE-10:
Sistema nervioso · Aparato circulatorio · Aparato respiratorio · Aparato digestivo · Aparato genitourinario · Sistema musculoesquelético y tejido conjuntivo · Sistema endocrino, nutricional y metabólico · Sangre y órganos hematopoyéticos · Piel y tejido subcutáneo · Ojo y anexos oculares · Oído y apófisis mastoides · Trastornos mentales y del comportamiento · Sistema reproductor · Sistema inmunológico.

### Qué se registra de cada enfermedad del paciente
- **Enfermedad** (del catálogo) y su **aparato o sistema**.
- **Estado**, que depende de si la enfermedad es aguda o crónica:

| Enfermedad aguda | Enfermedad crónica |
|---|---|
| Activa | Controlada |
| Resuelta | En remisión |
| Descartada | Descartada |
| A diagnosticar | |

- **Fecha de diagnóstico:** acepta fechas incompletas. Si no se indica, se usa la fecha de la consulta. Si la enfermedad se agrega desde el expediente, se usa la fecha del día.
- **Notas** clínicas.
- **Consulta** en la que se registró.
---

## 4. Antecedentes

Los antecedentes guardan la historia clínica previa del paciente. Se dividen en cinco tipos:

| Tipo | Qué registra |
|---|---|
| **Familiar** | Enfermedades de padres, abuelos o hermanos |
| **Personal** | Enfermedades que el propio paciente tiene o tuvo |
| **Cirugía** | Procedimientos quirúrgicos previos |
| **Hospitalización** | Internamientos previos |
| **Otro** | Cualquier antecedente que no encaje en los tipos anteriores |

### Datos comunes a todos los antecedentes
- **Nombre** del antecedente (obligatorio).
- **Código CIE-10** (opcional).
- **Descripción.**
- **Fecha del evento.**
- **Estado:** Activo, En seguimiento, Resuelto o Inactivo.

### Antecedentes familiares
- **El parentesco es obligatorio**: padre, madre, abuelo, hermano, etc.

### Antecedentes personales

### Cirugías
Además de los datos comunes, registran:
- **Procedimiento**, del catálogo de cirugías. Ejemplos: apendicectomía, colecistectomía, cesárea, bypass gástrico, reemplazo de cadera.
- **Institución** donde se realizó.
- **Médico tratante.**
- **Complicaciones.**

### Hospitalizaciones
Además de los datos comunes, registran:
- **Motivo**, del catálogo de hospitalizaciones. Ejemplos: neumonía, COVID-19, infarto agudo de miocardio, crisis hipertensiva, cetoacidosis diabética, parto o cesárea.
- **Fecha de ingreso** y **fecha de egreso**.
- **Institución.**
- **Diagnóstico de egreso** con su código CIE-10.

