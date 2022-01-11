import {getRandomNumber} from "./globalFunctions"
import * as THREE from "three";

export const generateTopBranchesTops = (topBranchesAmount, lowestTopVertices) => {
  let topBranchesTops = []
    for (let i = 0; i < topBranchesAmount; i++){
        topBranchesTops.push(lowestTopVertices[i])
    }
    return(topBranchesTops)
}

export const generateTopBranchesSteps = (topBranchesAmount, topBranchesTops, coreData) => {
    let newTopBranchesSteps = []
    for (let i = 0; i < topBranchesAmount; i++){
        let topBranchesStepsAmount = Math.floor(getRandomNumber(2,4))
        let newTopBranches = []
        for (let j = 0; j < topBranchesStepsAmount; j++){
            newTopBranches.push({
                x: ((topBranchesTops[i].x - coreData[coreData.length - 1].vector.x) / topBranchesStepsAmount),
                y: ((topBranchesTops[i].y - coreData[coreData.length - 1].vector.y) / topBranchesStepsAmount),
                z: ((topBranchesTops[i].z - coreData[coreData.length - 1].vector.z) / topBranchesStepsAmount),
                width: j === 0 ? -60 : getRandomNumber(-5,5)
            })

        }
        newTopBranchesSteps.push(newTopBranches)
    }
    return(newTopBranchesSteps)
}

export const generateTopBranchData = (startPoint, endpoint, stepAmount, startingWidth) => {
    let data = [{vector: startPoint, width: startingWidth}]
    const curve = new THREE.CubicBezierCurve3(
        startPoint,
        new THREE.Vector3( startPoint.x + (endpoint.x * 0.43), startPoint.y + (endpoint.y * 0.18), endpoint.z + startPoint.z),
        new THREE.Vector3( startPoint.x + (endpoint.x * 0.79), startPoint.y + (endpoint.y * 0.48), endpoint.z + startPoint.z),
        endpoint
    )
    curve.getPoints(stepAmount).forEach(point => {
        data.push({
            vector: point,
            width: startingWidth * 0.5
        })
    })
    return data
}

export const generateTopBranches = (scene, material, topBranchesAmount, generateBranchData, coreData,
                                    generateBranch, lowestTopVertices) => {
    for (let i = 0; i < topBranchesAmount; i++){
        let branchData = generateTopBranchData(
                coreData[coreData.length - 1].vector, lowestTopVertices[i], 12, coreData[coreData.length - 1].width, scene
            )
        generateBranch(branchData, scene, material)
        console.log("coreData", coreData)
        console.log(`branch data [${i}]`, branchData)
    }
}