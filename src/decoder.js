import {convertStringToNumber} from "./globalFunctions";

const stringToPointArray = (string) => {
    let pointArray = []
    string.split(",").forEach(item => {
        let array = item.split("|")
        array = array.map(i => parseFloat(i))
        pointArray.push({
            x: array[0],
            y: array[1],
            z: array[2],
            seed: array[3],
        })
    })
    return pointArray
}

const trunkDecoder = (data) => {
    const splitData = data.split("&")
    return ({
        color: splitData[0],
        width: parseFloat(splitData[1]),
        shrink: parseFloat(splitData[2]),
        pointArray: stringToPointArray(splitData[3])
    })
}

const convertStringToData = (string, trunkTop) => {
    let data = []
    string.split(",").forEach(item => {
        item = item.replace("x", trunkTop.x)
        item = item.replace("y", trunkTop.y)
        item = item.replace("z", trunkTop.z)
        let itemArray = item.split("|")
        itemArray = itemArray.map(i => convertStringToNumber(i))
        data.push({
            bottomRadius: itemArray[0],
            topRadius: itemArray[1],
            height: itemArray[2],
            rotationY: itemArray[3],
        })
    })
    return data
}

const topDecoder = (string, trunkTop) => {
    let splitData = string.split("&")
    return ({
        color: splitData[0],
        tipHeight: parseFloat(splitData[1]),
        tipOffsetX: parseFloat(splitData[2]),
        tipOffsetZ: parseFloat(splitData[3]),
        data: convertStringToData(splitData[4], trunkTop),
        segmentHeight: parseFloat(splitData[5]),
        topOffsetX: parseFloat(splitData[6]),
        topOffsetZ: parseFloat(splitData[7])
    })
}

export const decoder = (data, age) => {
    const splitData = data.split("^")
    const trunkData = trunkDecoder(splitData[0])
    const trunkTop = trunkData.pointArray[trunkData.pointArray.length - 1].y
    const topData = topDecoder(splitData[1], trunkTop)
    if (age <= 2){
        const segmentAmount = Math.floor(age * (trunkData.pointArray.length / 10))
        const totalSegmentAmount = trunkData.pointArray.length
        trunkData.pointArray = trunkData.pointArray.splice(0, segmentAmount <= totalSegmentAmount ? segmentAmount : totalSegmentAmount)
        trunkData.color = "#74a146"
        return ({
            trunkData: trunkData,
            scale: age / 20
        })
    } else {
        topData.data = topData.data.splice(0, age - 9)
        return ({
            topData: topData,
            trunkData: trunkData,
            scale: age / 20
        })
    }
}