import {CylinderGeometry, Mesh, Vector3, Group, MeshPhysicalMaterial} from "three"
import {getRandomFloat, getRandomInt, getVertices, updateVertices} from "./globalFunctions"
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry"
import * as THREE from "three"
import { makeNoise2D } from "open-simplex-noise"

const decoder = (data) => {
    const splitData = data.split("&")
    return ({
        color: splitData[0],
        width: parseFloat(splitData[1]),
        shrink: parseFloat(splitData[2]),
        pointArray: stringToPointArray(splitData[3])
    })
}

const stringToPointArray = (string) => {
    let pointArray = []
    string.split(",").forEach(item => {
        let array = item.split("|")
        array = array.map(i => parseFloat(i))
        pointArray.push({
            x: array[0],
            y: array[1],
            z: array[2],
            seed: array[3],
        })
    })
    return pointArray
}

export const generateTrunk = (scene, data) => {
    let {color, width, shrink, pointArray} = decoder(data)
    let meshArray = []
    const group = new Group()
    const material = new MeshPhysicalMaterial({color: parseInt(color.replace("#","0x"),16), flatShading: true})

    pointArray.forEach((point) => {
        let geometry = new CylinderGeometry(width, width, 0, 12)
        let mesh = new Mesh(geometry, material)
        mesh.position.set(point.x, point.y, point.z)
        mesh.scale.set(1, 1, 1)
        let vertices = mesh.geometry.attributes.position.array
        let newVertices = new Float32Array(vertices.length)
        const noise2D = makeNoise2D(point.seed)
        for (let i = 0; i <= vertices.length; i += 3) {
            let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
            p.normalize().multiplyScalar(width + 0.2 * noise2D(p.x * 2, p.y * 2))
            newVertices[i] = p.x
            newVertices[i + 1] = p.y
            newVertices[i + 2] = p.z
        }
        mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3))

        updateVertices(mesh)

        group.add(mesh)
        meshArray.push(mesh)
        width *= shrink
    })

    for (let i = 1; i < meshArray.length; i++) {
        let meshes = [meshArray[i - 1], meshArray[i]]
        let vertices = []
        meshes.forEach(mesh => {
            vertices = vertices.concat(getVertices(mesh))
        })
        const geometry = new ConvexGeometry( vertices )
        const mesh = new THREE.Mesh( geometry, material )

        group.add( mesh )
    }

    scene.add(group)

    return {
        trunkMesh: group,
        trunkTop: pointArray[pointArray.length - 1]
    }
}
