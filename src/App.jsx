import './App.css'
import * as React from 'react'
import {PerspectiveCamera, Scene, Group, Vector3} from 'three'
import {useEffect, useRef, useState} from "react"
import {generateTop} from "./treeTops"
import {generateTrunk} from "./trunk"
import {generateModel} from "./generateModel"
import {BsArrowsMove} from "react-icons/bs"
import {generate} from "./generators"
import {createIsland} from "./island"
import {getRandomFloat, getRandomInt} from "./globalFunctions"
import {decoder} from "./decoder"
import {rock} from "./rock"
import {grass} from "./grass"
import {MeshSurfaceSampler} from "./MeshSurfaceSampler"

const App = () => {
    const [scene, setScene] = useState(new Scene())
    const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const container = useRef(null)

    const growTree = (start, dna, age) => {
        const {trunkData, topData, scale} = decoder(dna, age)
        const {trunkMesh, trunkTop} = generateTrunk(scene, trunkData)
        const topMesh = topData && generateTop(trunkTop, scene, topData)
        const group = new Group()
        group.add(trunkMesh)
        topData && group.add(topMesh)
        group.position.set(start.x, start.y, start.z)
        group.scale.set(scale,scale,scale)
        return {mesh: group, width: topData.data[0].bottomRadius}
     }

    useEffect(() => {
        const islandMesh = createIsland(scene, 10)
        const group = new Group()
        group.add(islandMesh)
        islandMesh.translateY(-4)

        const sampler = new MeshSurfaceSampler(islandMesh).build()
        const tempPosition = new Vector3()
        const meshPositions = []

        let treeCounter = 0
        while (treeCounter <= 5){
            sampler.sample(tempPosition)
            if(new Vector3(0,0,0).distanceTo(tempPosition) < 9){
                const {mesh, width} = growTree(
                    tempPosition,
                    generate(),
                    getRandomFloat(11, 20)
                )
                mesh.translateY(-3)
                let check = true
                meshPositions.forEach(item => {
                    if (item.position.distanceTo(mesh.position) < item.width + 1.5)
                        check = false
                })
                if (check){
                    group.add(mesh)
                    meshPositions.push({position: mesh.position, width: width})
                    treeCounter++
                }
            }
        }

        let rockCounter = 0
        while (rockCounter <= 20){
            sampler.sample(tempPosition)
            let mesh = rock(tempPosition)
            if (tempPosition.y > -3 && new Vector3(0,0,0).distanceTo(tempPosition) < 9){
                mesh.position.set(tempPosition.x, tempPosition.y - 3, tempPosition.z);
                let check = true
                meshPositions.forEach(item => {
                    if (item.position.distanceTo(mesh.position) < 1)
                        check = false
                })
                if (check){
                    group.add(mesh)
                    meshPositions.push({position: mesh.position, width: 1})
                    rockCounter++
                }
            }
        }

        const grassModels = []
        for (let i = 0; i < 10; i++){
            grassModels.push(grass())
        }
        let grassCounter = 0
        while (grassCounter <= 5000){
            sampler.sample(tempPosition)
            let mesh = grassModels[getRandomInt(0, 9)].clone()
            if (tempPosition.y > -3 && new Vector3(0,1,0).distanceTo(tempPosition) < 9.4){
                mesh.position.set(tempPosition.x, tempPosition.y - 3, tempPosition.z);
                let check = true
                meshPositions.forEach(item => {
                    if (item.position.distanceTo(mesh.position) < 0.8)
                        check = false
                })
                if (check){
                    group.add(mesh)
                    grassCounter++
                }
            }
        }
        scene.add(group)
        generateModel(scene, setScene, container, camera, setCamera, group)
    }, [])

    return (
        <React.Fragment>
            {window.innerWidth <= 1000 && <BsArrowsMove className={"moveButton"}/>}
            <div ref={container} className={"container"} style={window.innerWidth > 1000 ? {backgroundImage: "url('http://i.imgur.com/HAhyJxB.png?1')"} : {}}/>
        </React.Fragment>
    )
}

export default App
