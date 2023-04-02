import { createChart, updateChart } from "./scatterplot.js"

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })

const saveModel = document.querySelector("#save")

saveModel.addEventListener("click", () => nn.save())

loadData()

function loadData(){
    Papa.parse("./data/utrecht-houseprices.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => dataLoaded(results.data)
    })
}

function dataLoaded(data){
    checkData(data)
    proccesdata(data)
    console.log(nn.data)
}

function proccesdata(data){
    // shuffle
    data.sort(() => (Math.random() - 0.5))
    // een voor een de data toevoegen aan het neural network
    for (let prices of data) {
        nn.addData({ LotArea: prices.LotArea }, { Retailvalue: prices.retailvalue })
    }
    console.log(data)
    nn.normalizeData()
    startTraining()
}

function startTraining() {
    nn.train({ epochs: 10 }, () => finishedTraining()) 
}

async function finishedTraining(){
    console.log("Finished training!")
    let predictions = []
    for (let hp = 0; hp < 1300; hp += 5) {
        const pred = await nn.predict({LotArea: hp})
        predictions.push({x: hp, y: pred[0].Retailvalue})
    }
    console.log(predictions)
    updateChart("Predictions", predictions)
}

async function makePrediction(data) {
    let toInt = parseInt(data)
    const results = await nn.predict({ Retailvalue: toInt })
    console.log(`Geschat verbruik: ${results[0].retailvalue}`)
}

function checkData(data) {
    console.table(data)
    const xydata = data.map(prices => ({
        x: prices.LotArea,
        y: prices.retailvalue,
    }))
    createChart(xydata, "Retailvalue", "LotArea")
}