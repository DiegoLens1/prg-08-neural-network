const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

const button = document.querySelector("#btn")
const input = document.querySelector("#prijs")
const result = document.querySelector("#result")

button.addEventListener("click", () => makePrediction(input.value))

function modelLoaded() {
    console.log("Model loaded!")
}

function makePrediction(data) {
    let toInt = parseInt(data)
    console.log(nn)
    const results = nn.predict({ Retailvalue: toInt })
    console.log(results)
    result.innerHTML = `Geschatte prijs: ${results[0]}`
}