
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

        // Parte 1
        function estudiantesDestacadosPorAsignatura(estudiantesList, asignatura) {
            return [...estudiantesList]
                .sort((a, b) => b.calificaciones[asignatura] - a.calificaciones[asignatura])
                .slice(0, 3);
        }
        function probarParte1() {
            const res = estudiantesDestacadosPorAsignatura(estudiantes, 'matematicas');
            document.getElementById('resultado1').textContent = JSON.stringify(res, null, 2);
        }

        // Parte 2
        function asignaturaMenorRendimiento(estudiantesList) {
            const asignaturas = Object.keys(estudiantesList[0].calificaciones);
            let menorPromedio = Infinity;
            let peorAsignatura = '';

            asignaturas.forEach(asig => {
                let suma = estudiantesList.reduce((acc, curr) => acc + curr.calificaciones[asig], 0);
                let promedio = suma / estudiantesList.length;
                if (promedio < menorPromedio) {
                    menorPromedio = promedio;
                    peorAsignatura = asig;
                }
            });
            return peorAsignatura;
        }
        function probarParte2() {
            const res = asignaturaMenorRendimiento(estudiantes);
            document.getElementById('resultado2').textContent = res;
        }

        // Parte 3
        function mejoraNotasBeca(estudiantesList) {
            return estudiantesList.map(est => {
                let nuevasCalificaciones = { ...est.calificaciones };
                if (est.beca) {
                    for (let asig in nuevasCalificaciones) {
                        let mejorada = nuevasCalificaciones[asig] * 1.1;
                        nuevasCalificaciones[asig] = Number(Math.min(mejorada, 10).toFixed(2));
                    }
                }
                return { ...est, calificaciones: nuevasCalificaciones };
            });
        }
        function probarParte3() {
            const res = mejoraNotasBeca(estudiantes).filter(e => e.beca);
            document.getElementById('resultado3').textContent = JSON.stringify(res, null, 2);
        }

        // Parte 4
        function filtrarPorCiudadYAsignatura(estudiantesList, ciudad, asignatura) {
            return estudiantesList
                .filter(est => est.ciudad === ciudad)
                .sort((a, b) => b.calificaciones[asignatura] - a.calificaciones[asignatura]);
        }
        function probarParte4() {
            const res = filtrarPorCiudadYAsignatura(estudiantes, 'Madrid', 'fisica');
            document.getElementById('resultado4').textContent = JSON.stringify(res, null, 2);
        }

        // Parte 5
        function estudiantesSinBecaPorCiudad(estudiantesList, ciudad) {
            return estudiantesList.filter(est => est.ciudad === ciudad && !est.beca).length;
        }
        function probarParte5() {
            const res = estudiantesSinBecaPorCiudad(estudiantes, 'Madrid');
            document.getElementById('resultado5').textContent = `Cantidad: ${res} (Juan, Pedro, Jose y Roberto)`;
        }

        // Parte 6
        function promedioEdadEstudiantesConBeca(estudiantesList) {
            const becados = estudiantesList.filter(est => est.beca);
            if (becados.length === 0) return 0;
            const sumaEdades = becados.reduce((acc, curr) => acc + curr.edad, 0);
            return sumaEdades / becados.length;
        }
        function probarParte6() {
            const res = promedioEdadEstudiantesConBeca(estudiantes);
            document.getElementById('resultado6').textContent = res;
        }

        // Parte 7
        function mejoresEstudiantes(estudiantesList) {
            const conPromedio = estudiantesList.map(est => {
                const notas = Object.values(est.calificaciones);
                const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
                return { ...est, promedioGeneral: promedio };
            });
            conPromedio.sort((a, b) => b.promedioGeneral - a.promedioGeneral);
            return conPromedio.slice(0, 2);
        }
        function probarParte7() {
            const res = mejoresEstudiantes(estudiantes);
            document.getElementById('resultado7').textContent = JSON.stringify(res, null, 2);
        }

        // Parte 8
        function estudiantesAprobados(estudiantesList) {
            return estudiantesList
                .filter(est => Object.values(est.calificaciones).every(nota => nota >= 5))
                .map(est => est.nombre);
        }
        function probarParte8() {
            const res = estudiantesAprobados(estudiantes);
            document.getElementById('resultado8').textContent = JSON.stringify(res, null, 2);
        }
    