import {getRandomFloat, getRandomInt} from "./globalFunctions"
import {
	tipHeightData, tipOffsetData, topBottomWidthData,
	topColorsData, topHeightData, topRotationData, treeRotationData,
	trunkColorsData,
	trunkHeightData,
	trunkSegmentAmountData,
	trunkShrinkData,
	trunkWidthData
} from "./dataSets";

const dataArrayGenerator = (data) => {
	let array = []
	data.forEach(item => {
		for (let i = 0; i < item.probability; i++){
			array.push(item.value)
		}
	})
	return array
}

const generateItemFromDataset = (dataArray) => {
	const generatedArray = dataArrayGenerator(dataArray)
	return (generatedArray[getRandomInt(0, generatedArray.length - 1)])
}

const trunkArrayGenerator = (segmentAmount, endPoint) => {
	let pointArray = []
	for (let i = 0; i <= segmentAmount; i++){
		let array = [
			getRandomFloat(0, 0.5).toFixed(2), // x
			((endPoint / segmentAmount) * i).toFixed(2), // y
			0, // z
			getRandomFloat(0, 100).toFixed(2) // seed
		]
	    pointArray.push(array.join("|"))
	}
	return pointArray.join(",")
}

const topArrayGenerator = (segmentAmount) => {
	let segmentArray = []
	let y = 0
	for (let i = 0; i <= segmentAmount; i++){
		let bottomRadius = generateItemFromDataset(topBottomWidthData)
		let height = generateItemFromDataset(topHeightData)
		let rotationX = generateItemFromDataset(topRotationData)
		let array = [
			bottomRadius, // bottom radius
			(bottomRadius * 0.6666).toFixed(2), // top radius
			height, // height
			"x", // x
			"y+" + y.valueOf().toString(), // y
			"z", // z
			rotationX // rotation x
		]
		y = (parseFloat(y) + (i === 0 ? 0 : (height - 0.3))).toFixed(2)
		segmentArray.push(array.join("|"))
	}
	return segmentArray.join(",")
}

export const generate = () => {
	// trunk
	const trunkColor = generateItemFromDataset(trunkColorsData)
	const trunkWidth = generateItemFromDataset(trunkWidthData)
	const trunkShrink = generateItemFromDataset(trunkShrinkData)
	const trunkArray = trunkArrayGenerator(
		generateItemFromDataset(trunkSegmentAmountData),
		generateItemFromDataset(trunkHeightData),
	)

	// top
	const topColor = generateItemFromDataset(topColorsData)
	const tipHeight = generateItemFromDataset(tipHeightData)
	const tipOffsetX = generateItemFromDataset(tipOffsetData)
	const tipOffsetY = generateItemFromDataset(tipOffsetData)
	const topArray = topArrayGenerator(
		generateItemFromDataset(trunkSegmentAmountData)
	)

	// whole rotation
	const rotationX = generateItemFromDataset(treeRotationData)
	const rotationZ = generateItemFromDataset(treeRotationData)

	// assembly
	const trunk = [trunkColor, trunkWidth, trunkShrink, trunkArray].join("&")
	const top = [topColor, tipHeight, tipOffsetX, tipOffsetY, topArray].join("&")
	const rotations = [rotationX, rotationZ].join("&")
	return [trunk, top, rotations].join("^")
}


