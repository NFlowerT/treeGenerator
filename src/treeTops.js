import {Mesh, MeshBasicMaterial, SphereGeometry, TetrahedronGeometry, Vector3} from "three"
import * as THREE from "three";
import {updateVertices} from "./globalFunctions";
const Simplex = require('perlin-simplex')
const simplex = new Simplex()

export const generateTopPosition = (topBranches, top) => {
    let topPositions = []
    topBranches.forEach(branch => {
        topPositions.push(branch[branch.length - 1].vector)
    })
    let avgX = 0, avgY = 0, avgZ = 0
    topPositions.forEach(position => {
        avgX += position.x
        avgY += position.y
        avgZ += position.z
    })
    avgX /= topPositions.length
    avgY /= topPositions.length
    avgY += top.y / 5
    avgZ /= topPositions.length
    return new Vector3(avgX, avgY, avgZ)
}

export const generateTop = (coreData, top, material, scene, setLowestTopVertices) => {
    const trunkTop = coreData[coreData.length - 1].vector
    const topGeometry = new TetrahedronGeometry(1, 5)
    const topMesh = new Mesh(topGeometry, material)
    const k = 2
    const vertices = topMesh.geometry.attributes.position.array;
    topMesh.position.set(trunkTop.x, trunkTop.y + 3, trunkTop.z)
    topMesh.geometry.attributes.position.array.needsUpdate = true
    let newVertices = new Float32Array(vertices.length)

    for (let i = 0; i <= vertices.length; i += 3) {
        let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
        p.normalize().multiplyScalar(1 + 0.2 * simplex.noise3d(p.x * k, p.y * k, p.z * k))
        newVertices[i] = p.x
        newVertices[i + 1] = p.y
        newVertices[i + 2] = p.z
    }

    topMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3));

    topMesh.scale.set(
        top.x,
        top.y,
        top.z
    )

    updateVertices(topMesh)

    scene.add(topMesh)

    setLowestTopVertices(getLowestTopVertices(topMesh, scene))
}

export const getLowestTopVertices = (topMesh, scene) => {
    let lowestTopVertices = []
    let verticesArray = topMesh.geometry.attributes.position.array
    for (let i = 0; i < verticesArray.length; i += 3){
        lowestTopVertices.push(new Vector3(verticesArray[i], verticesArray[i + 1], verticesArray[i + 2]))
    }
    lowestTopVertices.sort((a, b) => (a.y > b.y) ? 1 : -1)
    lowestTopVertices = lowestTopVertices.filter((v,i,a)=>a.findIndex(t=>(t.x===v.x && t.y===v.y && t.z === v.z))===i)
    lowestTopVertices.splice(15, lowestTopVertices.length - 15)

    lowestTopVertices.forEach(v => {
        let geometry = new SphereGeometry(0.1, 30,30)
        let mesh = new Mesh(geometry, new MeshBasicMaterial())
        scene.add(mesh)
        mesh.position.set(v.x, v.y, v.z)
    })
    return lowestTopVertices
}
