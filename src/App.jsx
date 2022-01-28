import './App.css'
import * as React from 'react'
import {
    MeshPhysicalMaterial,
    PerspectiveCamera,
    Scene, Vector3,
} from 'three'
import {useEffect, useRef, useState} from "react"
import {generateTop} from "./treeTops"
import {generateTrunk, growTrunk, incrementCoreSteps} from "./trunk"
import {getRandomNumber,connectTrunkWithBranches} from "./globalFunctions"
import {generateModel} from "./generateModel"
import {generateBranch, generateBranchData} from "./branches"
import {generateTopBranches} from "./topBranches";
export const cylinderFaceAmount = 12


const App = () => {
    const [generation, setGeneration] = useState(0)
    const container = useRef(null)
    const [woodMaterial] = useState(new MeshPhysicalMaterial({color: "#8f6246", flatShading: true}))
    const [topMaterial] = useState(new MeshPhysicalMaterial({color: "#91b341", flatShading: true}))
    const [scene, setScene] = useState(new Scene())
    const [trunkTop, setTrunkTop] = useState(new Vector3(0,18,0))
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    // const [topBranchesAmount] = useState(Math.floor(getRandomNumber(3, 5)))
    const [treeTopDimensions, setTreeTopDimensions] = useState({x: getRandomNumber(5, 6), y: 4, z: getRandomNumber(5, 6)})


    const growTree = () => {
        let trunkTopMesh = generateTrunk(new Vector3(0,0,0), trunkTop, 5, .4, scene, woodMaterial)
        let lowestTopVertices = generateTop(trunkTop, treeTopDimensions, topMaterial, scene)
        let topBranchesData = [
            [0.5, 0.5, 0.5, 0.5, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.1, 0.1],
            [0.5, 0.5, 0.5, 0.5, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.1, 0.1],
            [0.5, 0.5, 0.5, 0.5, 0.4, 0.4, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35,   0.1, 0.1],
        ]
        let bottomMeshes = generateTopBranches(new Vector3(0, 9,0), lowestTopVertices, topBranchesData, scene, woodMaterial)
        // connectTrunkWithBranches(trunkTopMesh, bottomMeshes, scene, woodMaterial)
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
