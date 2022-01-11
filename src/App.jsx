import './App.css'
import * as React from 'react'
import {
    MeshPhysicalMaterial,
    PerspectiveCamera,
    Scene, Vector3,
} from 'three'
import {useEffect, useRef, useState} from "react"
import {
    generateTopBranchData,
    generateTopBranches,
    generateTopBranchesSteps,
    generateTopBranchesTops
} from "./topBranches"
import {generateTop} from "./treeTops"
import {growTrunk, incrementCoreSteps} from "./trunk"
import {getRandomNumber} from "./globalFunctions"
import {generateModel} from "./generateModel"
import {generateBranch, generateBranchData} from "./branches"

const App = () => {
    const [generation, setGeneration] = useState(0)
    const container = useRef(null)
    const [coreData, setCoreData] = useState([])
    const [coreSteps, setCoreSteps] = useState([])
    const [trunkSegmentAmount, setTrunkSegmentAmount] = useState(Math.floor(getRandomNumber(6, 8)))
    const [trunkStartWidth, setTrunkStartWidth] = useState(0.4)
    const [woodMaterial] = useState(new MeshPhysicalMaterial({color: "#8f6246", flatShading: true}))
    const [topMaterial] = useState(new MeshPhysicalMaterial({color: "#91b341", flatShading: true}))
    const [scene, setScene] = useState(new Scene())
    const [trunkTop, setTrunkTop] = useState({
        x: getRandomNumber(-0.1, 0.1),
        z: getRandomNumber(-0.1, 0.1)
    })
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const [topBranchesAmount] = useState(Math.floor(getRandomNumber(3, 5)))
    const [top, setTop] = useState({x: getRandomNumber(1.2, 1.4), y: 1, z: getRandomNumber(1.2, 1.4)})

    const growTree = () => {
        let lowestTopVertices
        growTrunk(coreSteps, setCoreSteps, trunkSegmentAmount,
            generation, trunkTop, coreData, setCoreData, incrementCoreSteps, setTrunkStartWidth,
            trunkStartWidth, scene, woodMaterial)
        if (generation > 8){
            lowestTopVertices = generateTop(coreData, top, topMaterial, scene)
            generateTopBranches(scene, woodMaterial, topBranchesAmount, generateBranchData, coreData,
                generateBranch, lowestTopVertices)
            // generateTopBranchData(coreData[coreData.length - 1].vector, lowestTopVertices[1], 15, 2, scene)
            setTop({x: top.x + 0.06, y: top.y + 0.05, z: top.z + 0.06})
        }
        generateModel(scene, setScene, container, camera, setCamera)
        setGeneration(generation + 1)
    }

    useEffect(() => {
        growTree()
    }, [])

    return (
        <React.Fragment>
            <button onClick={() => growTree()}> Progress </button>
            <div ref={container}/>
        </React.Fragment>
    )
}

export default App
