// Seleccionar elementos del DOM
const button = document.querySelector("#getAmount");
const result = document.querySelector("#result");
const amountInput = document.querySelector("#amount");
const currencySelect = document.querySelector("#currency");

// Agregar un event listener al botón para llamar a la función getAmount cuando se haga clic
button.addEventListener("click", getAmount);

// Definir la función para obtener el resultado de la conversión
async function getAmount() {
    // Obtener el monto y la moneda seleccionada
    const amount = parseFloat(amountInput.value);
    const currencyValue = currencySelect.value;

    // Construir la URL de la API basada en la moneda seleccionada
    const apiURL = `https://mindicador.cl/api/${currencyValue}`;

    try {
        // Realizar la solicitud a la API y obtener los datos
        const res = await fetch(apiURL);
        const data = await res.json();

        // Obtener el valor de la moneda desde los datos recibidos
        const option = parseFloat(data.serie[0].valor);

        // Calcular la conversión
        const conversion = (amount / option).toFixed(2);

        // Actualizar el resultado en la página
        switch (currencyValue) {
            case "dolar":
                result.innerHTML = `$ ${conversion}`;
                break;
            case "euro":
                result.innerHTML = `€ ${conversion}`;
                break;
            case "bitcoin":
                result.innerHTML = `₿ ${conversion}`;
                break;
            case "uf":
                result.innerHTML = `UF ${conversion}`;
                break;
            case "utm":
                result.innerHTML = `UTM ${conversion}`;
                break;
            default:
                result.innerHTML = "Moneda no válida";
        }

        // Llamar a la función para graficar la moneda después de obtener la conversión
        await graphCurrency(currencyValue);
    } catch (error) {
        // Manejar errores en caso de que la solicitud falle
        console.error("Hubo un error al obtener los datos de la API:", error);
        result.innerHTML = "Hubo un error al obtener los datos de la API.";
    }
}

// Grafico
let myChart;

async function graphCurrency(currencyValue) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${currencyValue}`);
        const data = await res.json();

        const xValues = [];
        const yValues = [];
        for (let i = 9; i >= 0; i--) {
            xValues[i] = data.serie[i].fecha.substring(0, 10);
            yValues[i] = data.serie[i].valor;
        }

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart("myChart", {
            type: "line",
            data: {
                labels: xValues.reverse(),
                datasets: [{
                    label: "Últimos 10 valores registrados de " + currencyValue.toUpperCase(),
                    backgroundColor: "black",
                    borderColor: "red",
                    data: yValues.reverse(),
                    id: currencyValue
                }]
            }
        });
    } catch (error) {
        alert(error.message)
    }
}