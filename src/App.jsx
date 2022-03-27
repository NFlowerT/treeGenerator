import './App.css'
import * as React from 'react'
import {
    PerspectiveCamera,
    Scene,
    Group,
    Mesh,
    DodecahedronGeometry,
    Vector3,
    MeshPhysicalMaterial
} from 'three'
import {useEffect, useRef, useState} from "react"
import {generateTop} from "./treeTops"
import {generateTrunk} from "./trunk"
import {generateModel} from "./generateModel"
import {
    convertVectorsToVertices,
    convertVerticesToVectors,
    getMatchingVertices,
    getRandomFloat, getRandomInt
} from "./globalFunctions";
import * as THREE from "three";
import {makeNoise2D, makeNoise3D} from "open-simplex-noise";
import {BsArrowsMove} from "react-icons/bs"
export const cylinderFaceAmount = 12

const decoder = (data) => {
    const splitData = data.split("^")
    return ({
        trunkData: splitData[0],
        topData: splitData[1]
    })
}


const App = () => {
    const [scene, setScene] = useState(new Scene())
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const [scale, setScale] = useState(1)
    const container = useRef(null)

    const createIsland = () => {
        const mesh = new Mesh(new DodecahedronGeometry(50, 2), new MeshPhysicalMaterial({color: "#95bc82", flatShading: true}));
        let vertices = convertVerticesToVectors(mesh.geometry.attributes.position.array)
        let flatVertices = []
        vertices.forEach((verticle, i) => {
            if (verticle.y > -1){
                let matchingVertices = getMatchingVertices(vertices, i)
                const y = -1
                const noise2D = makeNoise2D()
                matchingVertices.forEach(v => {
                    vertices[v].y = y + (0.2 * noise2D(vertices[v].x * 2, vertices[v].y * 0.4)) * 20
                })
                flatVertices = flatVertices.concat(matchingVertices)
            }
        })
        mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(convertVectorsToVertices(vertices), 3))
        scene.add(mesh)
        mesh.translateY(1)
        flatVertices = flatVertices.map(i => vertices[i])
        return flatVertices
    }

    const growTree = (i) => {
        let flatVertices = createIsland()
        flatVertices = flatVertices.filter((v,i,a)=>a.findIndex(v2=>['x','z'].every(k=>v2[k] ===v[k]))===i)
        flatVertices = flatVertices.sort((a, b) => {
            let v = new Vector3(0, 0, 0)
            let vector1 = new Vector3(a.x, a.y, a.z).distanceTo(v)
            let vector2 = new Vector3(b.x, b.y, b.z).distanceTo(v)
            return vector1 - vector2
        })
        const start = flatVertices[i]
        const {trunkData, topData} = decoder("#6e3b1c&0.7&0.83&0.16|0|0|61.4,0|1.3|0|29.45,0.42|2.6|0|23.25,0.17|4|0|88.68^#91b341&4.2|3|2|x|y|z|0,4|2|2.8|x|y+2|z|5,4|2|2.8|x|y+4|z|0,4|2|2.8|x|y+6|z|0")
        const {trunkMesh, trunkTop} = generateTrunk(scene, trunkData)
        const topMesh = generateTop(trunkTop, scene, topData)
        const group = new Group()
        group.add(trunkMesh)
        group.add(topMesh)
        group.position.set(start.x, start.y, start.z)
        group.scale.set(scale, scale, scale)
        scene.add(group)
     }

    useEffect(() => {
        for (let i = 0; i < 10; i++){
            growTree(i)
        }
        generateModel(scene, setScene, container, camera, setCamera)
    }, [])

    // const doubleClick = () => {
    //     alert("fsfa")
    //     // document.body.style.webkitUserSelect = "none"
    //     // document.body.style.userSelect = "none"
    //     document.body.style.webkitAppRegion = "drag"
    // }

    const [style, setStyle] = useState({})

    return (
        <React.Fragment>
            <BsArrowsMove style={style} className={"moveButton"}/>
            <div ref={container}/>
        </React.Fragment>
    )
}

export default App
