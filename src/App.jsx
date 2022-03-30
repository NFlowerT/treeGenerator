import './App.css'
import * as React from 'react'
import {
    PerspectiveCamera,
    Scene,
    Group,
    Mesh,
    DodecahedronGeometry,
    Vector3,
    MeshPhysicalMaterial,
    MeshBasicMaterial,
    CylinderGeometry,
    SplineCurve,
    CubicBezierCurve,
    ConeGeometry,
    Matrix4,
    Object3D
} from 'three'
import {useEffect, useRef, useState} from "react"
import {generateTop} from "./treeTops"
import {generateTrunk} from "./trunk"
import {generateModel} from "./generateModel"
import {BsArrowsMove} from "react-icons/bs"
import {generate} from "./generators"
import {createIsland} from "./island"
import {convertStringToNumber, getRandomFloat, getRandomInt} from "./globalFunctions";
import {decoder} from "./decoder";
export const cylinderFaceAmount = 12

const App = () => {
    const [scene, setScene] = useState(new Scene())
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const container = useRef(null)

    const growTree = (i, islandPoints, dna, age) => {
        islandPoints = islandPoints.filter((v,i,a)=>a.findIndex(v2=>['x','z'].every(k=>v2[k] ===v[k]))===i)
        islandPoints = islandPoints.sort((a, b) => {
            let v = new Vector3(0, 0, 0)
            let vector1 = new Vector3(a.x, a.y, a.z).distanceTo(v)
            let vector2 = new Vector3(b.x, b.y, b.z).distanceTo(v)
            return vector1 - vector2
        })
        const start = islandPoints[i]
        const {trunkData, topData, scale} = decoder(dna, age)
        const {trunkMesh, trunkTop} = generateTrunk(scene, trunkData)
        const topMesh = topData && generateTop(trunkTop, scene, topData)
        const group = new Group()
        group.add(trunkMesh)
        topData && group.add(topMesh)
        group.position.set(start.x, start.y, start.z)
        group.scale.set(scale,scale,scale)
        return group
     }

    useEffect(() => {
        let {islandPoints, islandMesh} = createIsland(scene, 30)
        const group = new Group()
        group.add(islandMesh)
        islandMesh.translateY(-4)
        for (let i = 0; i < 20; i += 1) {
            let tree = growTree(
                i,
                islandPoints,
                generate(),
                getRandomFloat(0, 20)
            )
            tree.translateY(-3)
            group.add(tree)
        }
        scene.add(group)
        generateModel(scene, setScene, container, camera, setCamera, group)
    }, [])

    return (
        <React.Fragment>
            {window.innerWidth <= 1000 && <BsArrowsMove className={"moveButton"}/>}
            <div ref={container} className={"container"} style={window.innerWidth > 1000 ? {backgroundImage: "url('https://uploads-ssl.webflow.com/5d64ad209093d7b315c3591a/5e9697299bac7ccab1b35410_unity-game-asset-low-poly-modular-terrain-pack-very-large_2.jpg')"} : {}}/>
            {/*<button onClick={() => setAge(age + 0.1)}> AGE </button>*/}
        </React.Fragment>
    )
}

export default App
