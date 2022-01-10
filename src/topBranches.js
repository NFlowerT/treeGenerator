import {Vector3} from "three";
import {generateBranch, generateBranchData} from "./branches"
import {getRandomNumber} from "./globalFunctions"

const evenRanges = {
    0: 0,
    1: 1,
    2: 0.5,
    3: 0.25
}

const unevenRanges = {
    0: 0.33,
    1: 0.66,
    2: 1
}

export const generateTopBranchesTops = (topBranchesAmount, lowestTopVertices) => {
      let topBranchesTops = []
    let indexes = Math.floor(lowestTopVertices.length / topBranchesAmount)
    for (let i = 0; i < topBranchesAmount; i++){
        topBranchesTops.push(lowestTopVertices[i])
    }
    console.log("top branches tops: ", topBranchesTops)
    return(topBranchesTops)
}

export const generateTopBranchesSteps = (topBranchesAmount, topBranchesTops, coreData, setTopBranchesSteps) => {
    let newTopBranchesSteps = []
    for (let i = 0; i < topBranchesAmount; i++){
        let topBranchesStepsAmount = Math.floor(getRandomNumber(2,4))
        let newTopBranches = []
        for (let j = 0; j < topBranchesStepsAmount; j++){
            if (j < topBranchesStepsAmount - 1){
                newTopBranches.push({
                    x: ((topBranchesTops[i].x - coreData[coreData.length - 1].vector.x) / topBranchesStepsAmount),
                    y: ((topBranchesTops[i].y - coreData[coreData.length - 1].vector.y) / topBranchesStepsAmount),
                    z: ((topBranchesTops[i].z - coreData[coreData.length - 1].vector.z) / topBranchesStepsAmount),
                    width: j === 0 ? -60 : getRandomNumber(-5,5)
                })
            } else {
                newTopBranches.push({
                    x: ((topBranchesTops[i].x - coreData[coreData.length - 1].vector.x) / topBranchesStepsAmount),
                    y: ((topBranchesTops[i].y - coreData[coreData.length - 1].vector.y) / topBranchesStepsAmount),
                    z: ((topBranchesTops[i].z - coreData[coreData.length - 1].vector.z) / topBranchesStepsAmount),
                    width: j === 0 ? -60 : getRandomNumber(-5,5)
                })
            }

        }
        newTopBranchesSteps.push(newTopBranches)
    }
    console.log("setting top branches steps to:", newTopBranchesSteps)
    setTopBranchesSteps(newTopBranchesSteps)
}

export const generateTopBranchesHeights = (topBranchesAmount, setTopBranchesHeights, min, max) => {
    let newTopBranchesHeights = []
    for (let i = 0; i < topBranchesAmount; i++) {
        newTopBranchesHeights.push(getRandomNumber(min, max))
    }
    setTopBranchesHeights(newTopBranchesHeights)
}

export const generateTopBranches = (scene, material, topBranchesAmount, generateBranchData, coreData,
        topBranchesSteps, generateBranch, setTopBranchData) => {
    let newBranchData = []
    for (let i = 0; i < topBranchesAmount; i++){
        newBranchData.push(
            generateBranchData(
                coreData[coreData.length - 1].vector, coreData[coreData.length - 1].width, topBranchesSteps[i]
            )
        )
        generateBranch(newBranchData[i], scene, material)
    }
    setTopBranchData(newBranchData)
}

export const growTopBranches = (generation, topBranchesAmount, topBranchesRadii, setTopBranchesRadii,
         setTopBranchesHeights, coreData, topBranchesHeights, setTopBranchesTops, topBranchesSteps,
         setTopBranchesSteps, setTopBranchData, topMaterial, scene, lowestTopVertices) => {
    if (generation === 10) {
        generateTopBranchesSteps(topBranchesAmount,
            generateTopBranchesTops(topBranchesAmount, lowestTopVertices),
            coreData, setTopBranchesSteps
        )
    }
    if (generation > 11){
        incrementTopBranchesRadii(0.1, topBranchesRadii, setTopBranchesRadii)
        incrementTopBranchesHeights(0.1, topBranchesRadii, setTopBranchesRadii)
        generateTopBranchesTops(topBranchesAmount, topBranchesRadii, coreData, topBranchesHeights, setTopBranchesTops)
        generateTopBranchesSteps(topBranchesAmount,
            generateTopBranchesTops(topBranchesAmount, lowestTopVertices),
            coreData, setTopBranchesSteps
        )
        generateTopBranches(scene, topMaterial, topBranchesAmount, generateBranchData,
            coreData, topBranchesSteps, generateBranch, setTopBranchData)
    }
}

export const incrementTopBranchesRadii = (i, topBranchesRadii, setTopBranchesRadii) => {
    let newTopBranchesRadii = []
    topBranchesRadii.forEach(radius => {
        newTopBranchesRadii.push(radius + i)
    })
    setTopBranchesRadii(newTopBranchesRadii)
}

export const incrementTopBranchesHeights = (i, topBranchesRadii, setTopBranchesHeights) => {
    let newTopBranchesHeights = []
    topBranchesRadii.forEach(radius => {
        newTopBranchesHeights.push(radius + i)
    })
    setTopBranchesHeights(newTopBranchesHeights)
}
