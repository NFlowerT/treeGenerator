import {CylinderGeometry, Mesh, Vector3, Group} from "three"
import {getVertices, updateVertices} from "./globalFunctions"
import {cylinderFaceAmount} from "./App"
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry"
import * as THREE from "three"
const Simplex = require('perlin-simplex')

export const generateTrunk = (startPoint, endPoint, segmentAmount, width, scene, material, shrink) => {
    let calcWidth = width
    let pointArray = []
    let meshArray = []
    for (let i = 0; i <= segmentAmount; i++){
        pointArray.push(
            new Vector3(
                startPoint.x,
                startPoint.y + (endPoint.y / segmentAmount) * i,
                startPoint.z
            )
        )
    }

    const group = new Group()

    pointArray.forEach((point, i) => {
        let geometry = new CylinderGeometry(calcWidth, calcWidth, 0, cylinderFaceAmount)
        let mesh = new Mesh(geometry, material)
        mesh.position.set(point.x, point.y, point.z)
        mesh.scale.set(1, 1, 1)
        let vertices = mesh.geometry.attributes.position.array
        let newVertices = new Float32Array(vertices.length)
        const simplex = new Simplex()
        console.log("simplex", simplex)
        for (let i = 0; i <= vertices.length; i += 3) {
            let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
            p.normalize().multiplyScalar(calcWidth + 0.2 * simplex.noise(p.x * 2, p.y * 2))
            newVertices[i] = p.x
            newVertices[i + 1] = p.y
            newVertices[i + 2] = p.z
        }
        mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3))

        updateVertices(mesh)
        mesh.scale.set(0.7, 1, 0.7)

        group.add(mesh)
        meshArray.push(mesh)
        calcWidth *= shrink
    })

    for (let i = 1; i < meshArray.length; i++) {
        let meshes = [meshArray[i - 1], meshArray[i]]
        let vertices = []
        meshes.forEach(mesh => {
            vertices = vertices.concat(getVertices(mesh))
        })
        const geometry = new ConvexGeometry( vertices )
        const mesh = new THREE.Mesh( geometry, material )
        mesh.scale.set(0.7, 1, 0.7)
        group.add( mesh )
    }
    scene.add(group)
    return group
}
