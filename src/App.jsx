import './App.css'
import * as React from 'react'
import {
    MeshPhysicalMaterial,
    PerspectiveCamera,
    Scene, Vector3, Group
} from 'three'
import {useEffect, useRef, useState} from "react"
import {generateTop} from "./treeTops"
import {generateTrunk, growTrunk, incrementCoreSteps} from "./trunk"
import {getRandomFloat,connectTrunkWithBranches} from "./globalFunctions"
import {generateModel} from "./generateModel"
import {generateBranch, generateBranchData} from "./branches"
import {generateTopBranches} from "./topBranches";
export const cylinderFaceAmount = 12


const App = () => {
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
    const [woodMaterial] = useState(new MeshPhysicalMaterial({color: trunkColors[Math.floor(getRandomFloat(0, trunkColors.length))], flatShading: true}))
    const [topMaterial] = useState((new MeshPhysicalMaterial({color: topColors[Math.floor(getRandomFloat(0, topColors.length))], flatShading: true})))
    useEffect(() => {
        growTree()
    }, [])
    const container = useRef(null)
    const [scene, setScene] = useState(new Scene())
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    // const [topBranchesAmount] = useState(Math.floor(getRandomNumber(3, 5)))

    const [scale, setScale] = useState(1)
    const growTree = () => {
        let trunkTop = new Vector3(0, 4, 0)
        let trunkMesh = generateTrunk(new Vector3(0,0,0), trunkTop, 3, 1, scene, woodMaterial, 0.83)
        let topMesh = generateTop(trunkTop, {x: 3, y: 1, z: 3}, topMaterial, scene)
        let group = new Group()
        group.add(trunkMesh)
        group.add(topMesh)
        group.scale.set(scale, scale, scale)
        scene.add(group)
        generateModel(scene, setScene, container, camera, setCamera)
         }

    return (
        <React.Fragment>
            <button onClick={() => {growTree()}}> Progress </button>
            <div ref={container}/>
        </React.Fragment>
    )
}

export default App
