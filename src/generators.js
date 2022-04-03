import {getRandomFloat, getRandomInt} from "./globalFunctions"
import {
	tipHeightData,
	tipOffsetData,
	topAmountData,
	topBottomWidthData,
	topColorsData,
	topHeightData,
	topOffset,
	topOffsetData,
	topRotationData,
	topSegmentShrinkData,
	topShrinkData,
	treeRotationData,
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

const topArrayGenerator = (segmentAmount, topSegmentShrink, topShrink) => {
	let segmentArray = []
	let bottomRadius = generateItemFromDataset(topBottomWidthData)
	for (let i = 0; i <= segmentAmount; i++){
		let tipHeight = generateItemFromDataset(tipHeightData)
		let rotationY = generateItemFromDataset(topRotationData)
		let array = [
			bottomRadius,
			(bottomRadius * topSegmentShrink).toFixed(2),
			tipHeight,
			rotationY,
		]
		segmentArray.push(array.join("|"))
		bottomRadius *= topShrink
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
		generateItemFromDataset(topAmountData),
		generateItemFromDataset(topSegmentShrinkData),
		generateItemFromDataset(topShrinkData)
	)
	const segmentHeight = generateItemFromDataset(topHeightData)
	const topOffsetX = generateItemFromDataset(topOffsetData)
	const topOffsetZ = generateItemFromDataset(topOffsetData)
	


	// assembly
	const trunk = [trunkColor, trunkWidth, trunkShrink, trunkArray].join("&")
	const top = [topColor, tipHeight, tipOffsetX, tipOffsetY, topArray, segmentHeight, topOffsetX, topOffsetZ].join("&")
	return [trunk, top].join("^")
}


