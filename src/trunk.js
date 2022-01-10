import {generateBranch, generateBranchData} from "./branches";
import {Vector3} from "three";
import {getRandomNumber} from "./globalFunctions";

export const growTrunk = (coreSteps, setCoreSteps, trunkSegmentAmount,
                          generation, trunkTop, coreData, setCoreData, incrementCoreSteps, setTrunkStartWidth,
                          trunkStartWidth, scene, material
    ) => {
    if (coreSteps.length === 0) {
        setCoreSteps(coreSteps.concat({
            x: 0,
            y: getRandomNumber(0.3, 0.6),
            z: 0,
            width: -20
        }))
    } else if (coreSteps.length < trunkSegmentAmount) {
        if (generation % 4 === 0) {
            if (coreSteps.length < Math.floor(trunkSegmentAmount / 2)) {
                setCoreSteps(coreSteps.concat({
                    x: getRandomNumber(-0.1, 0.1),
                    y: getRandomNumber(0.4, 1),
                    z: getRandomNumber(-0.1, 0.1),
                    width: getRandomNumber(-15, 1)
                }))
            } else {
                setCoreSteps(coreSteps.concat({
                    x: ((trunkTop.x - coreData[Math.floor(trunkSegmentAmount / 2)].vector.x / Math.floor(trunkSegmentAmount / 2))),
                    y: getRandomNumber(0.5, 1),
                    z: ((trunkTop.z - coreData[Math.floor(trunkSegmentAmount / 2)].vector.z / Math.floor(trunkSegmentAmount / 2))),
                    width: getRandomNumber(-15, 5)
                }))
            }
        }
    } else {
        incrementCoreSteps(0.01, coreSteps, setCoreSteps)
        setTrunkStartWidth(trunkStartWidth + 0.02)
    }
    setCoreData(generateBranchData(new Vector3(0,0,0), trunkStartWidth, coreSteps))
    generateBranch(coreData, scene, material)
}

export const incrementCoreSteps = (height, coreSteps, setCoreSteps) => {
    let newCoreSteps = []
    coreSteps.forEach(step => {
        newCoreSteps.push({
            x: step.x,
            y: step.y + height,
            z: step.z,
            width: step.width
        })
    })
    setCoreSteps(newCoreSteps)
}
