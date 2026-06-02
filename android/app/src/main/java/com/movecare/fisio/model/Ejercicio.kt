package com.movecare.fisio.model

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName

/**
 * Clase de datos que representa un ejercicio clínico de rehabilitación.
 * Colección Firestore: `/ejercicios`
 */
data class Ejercicio(
    /** Identificador único del ejercicio o slug */
    @DocumentId
    val id: String = "",

    val titulo: String = "",

    val descripcion: String = "",

    /** Región anatómica. Ej. "rodilla", "lumbar", "cuello", "hombro" */
    @get:PropertyName("zona_anatomica")
    @field:PropertyName("zona_anatomica")
    val zonaAnatomica: String = "",

    /** Tipo de patología. Ej. "esguince", "post-quirúrgico" */
    @get:PropertyName("tipo_lesion")
    @field:PropertyName("tipo_lesion")
    val tipoLesion: String = "",

    /** Pasos ordenados para realizar la rehabilitación */
    val instrucciones: List<String> = emptyList(),

    /** URL de Cloud Storage que contiene el video instructivo */
    @get:PropertyName("multimedia_url")
    @field:PropertyName("multimedia_url")
    val multimediaUrl: String = ""
)
