package com.movecare.fisio.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName

/**
 * Clase de datos que representa un perfil de usuario en Android.
 * Colección Firestore: `/usuarios`
 */
data class Usuario(
    /** ID del documento, mapea al UID generado por Firebase Auth */
    @DocumentId
    val id: String = "",

    val nombre: String = "",

    val correo: String = "",

    /** Rol del usuario: "paciente", "fisioterapeuta" o "admin" */
    val rol: String = "",

    /** Fecha y hora del registro del usuario en la plataforma */
    @get:PropertyName("fecha_registro")
    @field:PropertyName("fecha_registro")
    val fechaRegistro: Timestamp = Timestamp.now()
)
