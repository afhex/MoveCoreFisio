package com.movecare.fisio.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName

/**
 * Clase de datos que representa un perfil de usuario en Android con Ficha Clínica.
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
    val fechaRegistro: Timestamp = Timestamp.now(),

    // --- CAMPOS DE FICHA CLÍNICA (Opcionales / Valores por defecto) ---
    val cedula: String = "",
    
    val edad: Int = 0,
    
    val peso: Double = 0.0,
    
    val estatura: Double = 0.0,
    
    val sexo: String = "",
    
    val discapacidad: String = "",
    
    val diagnostico: String = "",

    @get:PropertyName("historial_clinico")
    @field:PropertyName("historial_clinico")
    val historialClinico: String = "",

    // --- CONTROL LEGAL / ÉTICO ---
    @get:PropertyName("acepto_politicas")
    @field:PropertyName("acepto_politicas")
    val aceptoPoliticas: Boolean = false,

    @get:PropertyName("fecha_aceptacion")
    @field:PropertyName("fecha_aceptacion")
    val fechaAceptacion: Timestamp? = null
)
