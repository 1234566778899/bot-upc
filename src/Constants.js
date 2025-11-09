/**
 * Constantes compartidas de la aplicación
 * Centraliza las opciones de cursos y carreras para mantener consistencia
 */

// Cursos disponibles en el sistema
export const CURSOS_DISPONIBLES = [
    'Taller de Proyecto 1',
    'Taller de Desempeño Profesional'
];

// Carreras disponibles en el sistema
export const CARRERAS_DISPONIBLES = [
    'Ingeniería de Sistemas de Información',
    'Ingeniería de Software',
    'Ciencias de la Computación',
    'Ciberseguridad'
];

// Emails autorizados para entrenar asistentes
export const AUTHORIZED_EMAILS = [
    'gabitotaipe01@gmail.com',
    'ordazhoyos2001@gmail.com'
];

// Configuración de archivos para entrenamiento
export const FILE_UPLOAD_CONFIG = {
    maxFiles: 10,
    maxFileSize: 50 * 1024 * 1024, // 50MB en bytes
    acceptedTypes: ['application/pdf'],
    acceptedExtensions: ['.pdf']
};