import {getRandomFloat} from "./globalFunctions";

const trunkColors = [
	"#d59168", "#b97952",
	"#a46239", "#6e3b1c",
	"#4f2409", "#593e30"
]

const topColors = [
	"#b8da67", "#99b93e",
	"#91b341", "#647a26",
	"#384d10", "#313b0b",
	"#2f3b17", "#1e2309",
]

const pointArrayGenerator = (segmentAmount, endPoint) => {
	let pointArray = []
	for (let i = 0; i <= segmentAmount; i++){
	    pointArray.push(
	        {
	            x: getRandomFloat(0, 0.5),
	            y: (endPoint.y / segmentAmount) * i,
	            z: 0,
	            seed: getRandomFloat(0, 100)
	        }
	    )
	}
	return pointArray
}
