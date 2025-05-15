let modelo;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let dibujando = false;

(async function () {
    modelo = await tf.loadLayersModel('./modelo/model.json');
    console.log("Modelo cargado correctamente");
})();

canvas.addEventListener("mousedown", () => dibujando = true);
canvas.addEventListener("mouseup", () => {
    dibujando = false;
    ctx.beginPath();
});
canvas.addEventListener("mousemove", (e) => {
    if (!dibujando) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

function limpiar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("resultado").innerText = "";
}

async function predecir() {
    if (!modelo) {
        alert("El modelo no se ha cargado correctamente");
        return;
    }
    let img = tf.browser.fromPixels(canvas, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(255.0)
        .expandDims();

    let prediccion = await modelo.predict(img).data();
    let resultado = prediccion.indexOf(Math.max(...prediccion));
    document.getElementById("resultado").innerText = `Predicción: ${resultado}`;
}
