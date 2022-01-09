import './App.css'
import * as React from 'react'
import {
    MeshPhysicalMaterial,
    PerspectiveCamera,
    Scene,
} from 'three'
import {useEffect, useRef, useState} from "react"
import {growTopBranches} from "./topBranches";
import {generateTop, generateTopPosition} from "./treeTops";
import {growTrunk, incrementCoreSteps} from "./trunk";
import {getRandomNumber} from "./getRandomNumber";
import {generateModel} from "./generateModel";


const App = () => {
    const [generation, setGeneration] = useState(0)
    const container = useRef(null);
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
    const [topBranchesRadii, setTopBranchesRadii] = useState([])
    const [topBranchesHeights, setTopBranchesHeights] = useState([])
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const [topBranchesTops, setTopBranchesTops] = useState([])
    const [topBranchesAmount] = useState(Math.floor(getRandomNumber(2, 5)))
    const [topBranchesSteps, setTopBranchesSteps] = useState([])
    const [topBranchesData, setTopBranchData] = useState([])
    const [top, setTop] = useState({x: getRandomNumber(1.2, 1.4), y: 1, z: getRandomNumber(1.2, 1.4)})

    const growTree = () => {
        growTrunk(coreSteps, setCoreSteps, trunkSegmentAmount,
            generation, trunkTop, coreData, setCoreData, incrementCoreSteps, setTrunkStartWidth,
            trunkStartWidth, scene, woodMaterial)
        growTopBranches(generation, topBranchesAmount, topBranchesRadii, setTopBranchesRadii,
            setTopBranchesHeights, coreData, topBranchesHeights, setTopBranchesTops, topBranchesSteps,
            setTopBranchesSteps, setTopBranchData, topMaterial, scene, top, setTop)
        if (generation > 10){
            generateTop(generateTopPosition(topBranchesData, top), topMaterial, scene, top)
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
