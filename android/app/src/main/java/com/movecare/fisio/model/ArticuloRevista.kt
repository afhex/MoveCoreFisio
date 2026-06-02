package com.movecare.fisio.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName

/**
 * Clase de datos que representa un artículo informativo escrito por profesionales de salud.
 * Colección Firestore: `/articulos_revista`
 */
data class ArticuloRevista(
    /** ID único o slug del artículo científico */
    @DocumentId
    val id: String = "",

    val titulo: String = "",

    val autor: String = "",

    /** Contenido del artículo en formato Markdown */
    val contenido: String = "",

    /** Categoría del artículo. Ej. "prevencion", "nutricion", "estiramientos" */
    val categoria: String = "",

    /** Fecha y hora en la que se publicó el artículo */
    @get:PropertyName("fecha_publicacion")
    @field:PropertyName("fecha_publicacion")
    val fechaPublicacion: Timestamp = Timestamp.now()
)
