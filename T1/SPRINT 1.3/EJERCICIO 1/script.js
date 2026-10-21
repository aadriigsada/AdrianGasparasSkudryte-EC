const estudiantes = [
    { nombre: "Juan", ciudad: "Madrid", beca: false, edad: 21, calificaciones: { matematicas: 5, fisica: 7, historia: 6 } },
    { nombre: "Ana", ciudad: "Barcelona", beca: true, edad: 20, calificaciones: { matematicas: 9, fisica: 6, historia: 8 } },
    { nombre: "Pedro", ciudad: "Madrid", beca: false, edad: 23, calificaciones: { matematicas: 4, fisica: 5, historia: 7 } },
    { nombre: "Maria", ciudad: "Sevilla", beca: true, edad: 19, calificaciones: { matematicas: 8, fisica: 7, historia: 9 } },
    { nombre: "Jose", ciudad: "Madrid", beca: false, edad: 22, calificaciones: { matematicas: 6, fisica: 7, historia: 5 } },
    { nombre: "Isabel", ciudad: "Valencia", beca: true, edad: 20, calificaciones: { matematicas: 5, fisica: 8, historia: 7 } },
    { nombre: "David", ciudad: "Bilbao", beca: false, edad: 24, calificaciones: { matematicas: 7, fisica: 6, historia: 8 } },
    { nombre: "Laura", ciudad: "Barcelona", beca: true, edad: 19, calificaciones: { matematicas: 6, fisica: 8, historia: 7 } },
    { nombre: "Miguel", ciudad: "Sevilla", beca: false, edad: 21, calificaciones: { matematicas: 7, fisica: 7, historia: 8 } },
    { nombre: "Sara", ciudad: "Madrid", beca: true, edad: 20, calificaciones: { matematicas: 6, fisica: 5, historia: 9 } },
    { nombre: "Daniela", ciudad: "Valencia", beca: false, edad: 22, calificaciones: { matematicas: 8, fisica: 9, historia: 6 } },
    { nombre: "Alberto", ciudad: "Bilbao", beca: true, edad: 23, calificaciones: { matematicas: 5, fisica: 8, historia: 6 } },
    { nombre: "Gabriel", ciudad: "Sevilla", beca: false, edad: 19, calificaciones: { matematicas: 8, fisica: 5, historia: 7 } },
    { nombre: "Carmen", ciudad: "Barcelona", beca: true, edad: 24, calificaciones: { matematicas: 9, fisica: 9, historia: 9 } },
    { nombre: "Roberto", ciudad: "Madrid", beca: false, edad: 20, calificaciones: { matematicas: 4, fisica: 5, historia: 5 } },
    { nombre: "Carolina", ciudad: "Valencia", beca: true, edad: 22, calificaciones: { matematicas: 5, fisica: 7, historia: 6 } },
    { nombre: "Alejandro", ciudad: "Bilbao", beca: false, edad: 23, calificaciones: { matematicas: 9, fisica: 8, historia: 8 } },
    { nombre: "Lucia", ciudad: "Barcelona", beca: true, edad: 21, calificaciones: { matematicas: 7, fisica: 7, historia: 7 } },
    { nombre: "Ricardo", ciudad: "Sevilla", beca: false, edad: 19, calificaciones: { matematicas: 6, fisica: 5, historia: 6 } },
    { nombre: "Marina", ciudad: "Madrid", beca: true, edad: 20, calificaciones: { matematicas: 5, fisica: 9, historia: 8 } }
];

/* ----------------------------------------------------------------------------------------------------- */

function estudiantesDestacadosPorAsignatura(estudiantes, asignaturaBuscada) 
{
    return estudiantes
        .map(e => ({ nombre: e.nombre, nota: e.calificaciones[asignaturaBuscada] }))
        .filter(e => e.nota !== undefined) // Por si algún alumno no tiene esa asignatura
        .sort((a, b) => b.nota - a.nota)   // Ordena de mayor a menor nota
        .slice(0, 3);                      // Se queda con los 3 primeros
}

// Para usarla y ver el resultado en consola:
console.log(estudiantesDestacadosPorAsignatura(estudiantes, "matematicas"));

function asignaturaMenorRendimiento(estudiantes) {
    // Identifica la asignatura con el promedio de calificación más bajo
}
function mejoraNotasBeca(estudiantes) {
    // Aumenta todas las notas de los estudiantes con beca en un 10% (máximo 10)
}
function filtrarPorCiudadYAsignatura(estudiantes, ciudad, asignatura) {
    // Devuelve la lista de estudiantes de una ciudad ordenados descendentemente por la nota de la asignatura dada
}
function estudiantesSinBecaPorCiudad(estudiantes, ciudad) {
    // Devuelve la cantidad de estudiantes sin beca en la ciudad dada
}
function promedioEdadEstudiantesConBeca(estudiantes) {
    // Devuelve el promedio de edad de los estudiantes con beca
}
function mejoresEstudiantes(estudiantes) {
    // Devuelve un array con los 2 estudiantes con el mejor promedio general
}
function estudiantesAprobados(estudiantes) {
    // Devuelve un array con los nombres de los estudiantes que hayan aprobado todas las materias
}
