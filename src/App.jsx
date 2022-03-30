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
import * as THREE from "three";
import {BsArrowsMove} from "react-icons/bs"
import {generate} from "./generators"
import {createIsland} from "./island"
import {updateVertices} from "./globalFunctions";
export const cylinderFaceAmount = 12

const decoder = (data) => {
    const splitData = data.split("^")
    return ({
        trunkData: splitData[0],
        topData: splitData[1],
    })
}

const App = () => {
    const [scene, setScene] = useState(new Scene())
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const [scale, setScale] = useState(1)
    const [treArray, setTreeArray] = useState([])
    const container = useRef(null)

    const growTree = (i, islandPoints, dna) => {
        islandPoints = islandPoints.filter((v,i,a)=>a.findIndex(v2=>['x','z'].every(k=>v2[k] ===v[k]))===i)
        islandPoints = islandPoints.sort((a, b) => {
            let v = new Vector3(0, 0, 0)
            let vector1 = new Vector3(a.x, a.y, a.z).distanceTo(v)
            let vector2 = new Vector3(b.x, b.y, b.z).distanceTo(v)
            return vector1 - vector2
        })
        const start = islandPoints[i]
        const {trunkData, topData} = decoder(dna)
        const {trunkMesh, trunkTop} = generateTrunk(scene, trunkData)
        const topMesh = generateTop(trunkTop, scene, topData)
        const group = new Group()
        group.add(trunkMesh)
        group.add(topMesh)
        group.position.set(start.x, start.y, start.z)
        group.scale.set(scale, scale, scale)
        group.scale.set(1,1,1)
        return group
     }

    useEffect(() => {
        let islandPoints = createIsland(scene, 7)
        // // for (let i = 0; i < 20; i++) {
        let tree = growTree(1, islandPoints, generate())
        // // }
        scene.add(tree)

        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3( 5, 0, 0 ),
            new THREE.Vector3( 5, 8, 0 ),
            new THREE.Vector3( 7, 15, 0 ),
        );
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
        const splineObject = new THREE.Line( geometry, material );
        scene.add(splineObject)
        generateModel(scene, setScene, container, camera, setCamera)
    }, [])

    return (
        <React.Fragment>
            {window.innerWidth <= 1000 && <BsArrowsMove className={"moveButton"}/>}
            <div ref={container} className={"container"} style={window.innerWidth > 1000 ? {backgroundImage: "url('https://uploads-ssl.webflow.com/5d64ad209093d7b315c3591a/5e9697299bac7ccab1b35410_unity-game-asset-low-poly-modular-terrain-pack-very-large_2.jpg')"} : {}}/>
        </React.Fragment>
    )
}

export default App
