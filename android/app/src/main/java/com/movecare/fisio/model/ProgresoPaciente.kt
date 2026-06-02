package com.movecare.fisio.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.DocumentReference
import com.google.firebase.firestore.PropertyName

/**
 * Clase de datos que registra la realización de una sesión de ejercicio por un paciente.
 * Colección Firestore: `/progreso_pacientes`
 */
data class ProgresoPaciente(
    /** ID autogenerado del documento de progreso */
    @DocumentId
    val id: String = "",

    /** Referencia directa al documento del paciente en la colección `/usuarios` */
    @get:PropertyName("usuario_id")
    @field:PropertyName("usuario_id")
    val usuarioId: DocumentReference? = null,

    /** Referencia directa al documento del ejercicio en la colección `/ejercicios` */
    @get:PropertyName("ejercicio_id")
    @field:PropertyName("ejercicio_id")
    val ejercicioId: DocumentReference? = null,

    /** Fecha y hora en la que se reportó la actividad */
    val fecha: Timestamp = Timestamp.now(),

    /** True si el paciente completó la sesión correctamente */
    val completado: Boolean = false,

    /** Observaciones descritas por el paciente o su fisioterapeuta */
    val observaciones: String = ""
)
