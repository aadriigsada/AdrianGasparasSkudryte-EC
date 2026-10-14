// 1. Selección de elementos del DOM
const inputNum1 = document.getElementById('num1');
const inputNum2 = document.getElementById('num2');
const selectOperacion = document.getElementById('operacion');
const btnCalcular = document.getElementById('btnCalcular');
const spanResultado = document.getElementById('resultado');

// 2. Función principal para realizar el cálculo
function calcular() {
  const valor1 = inputNum1.value.trim();
  const valor2 = inputNum2.value.trim();

  // Validación: asegurarse de que los campos no estén vacíos
  if (valor1 === "" || valor2 === "") {
    spanResultado.innerText = "Por favor, completa ambos campos.";
    return;
  }

  // Convertir los valores a números flotantes
  const n1 = parseFloat(valor1);
  const n2 = parseFloat(valor2);
  const operacion = selectOperacion.value;

  let res;

  // Realizar la operación según la opción seleccionada
  switch (operacion) {
    case '+':
      res = n1 + n2;
      break;
    case '-':
      res = n1 - n2;
      break;
    case '*':
      res = n1 * n2;
      break;
    case '/':
      // Validación especial: división entre cero
      if (n2 === 0) {
        spanResultado.innerText = "INDEFINIDO";
        return;
      }
      res = n1 / n2;
      break;
    default:
      spanResultado.innerText = "Operación no válida";
      return;
  }

  // Mostrar el resultado en el DOM
  spanResultado.innerText = res;
}

// 3. Asignación del evento click al botón "Calcular"
btnCalcular.addEventListener('click', calcular);