import {Mesh, TetrahedronGeometry, Vector3} from "three";
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

export const generateTop = (posVector, material, scene, top) => {
    posVector.y += 0.5
    const topGeometry = new TetrahedronGeometry(1, 5)
    const topMesh = new Mesh(topGeometry, material)
    topMesh.position.set(posVector.x, posVector.y, posVector.z)
    const k = 2
    const vertices = topMesh.geometry.attributes.position.array;
    for (let i = 0; i <= vertices.length; i += 3) {
        let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
        p.normalize().multiplyScalar(1 + 0.2 * simplex.noise3d(p.x * k, p.y * k, p.z * k))
        topMesh.geometry.attributes.position.array[i] = p.x
        topMesh.geometry.attributes.position.array[i + 1] = p.y
        topMesh.geometry.attributes.position.array[i + 2] = p.z
    }
    topMesh.geometry.attributes.position.needsUpdate = true
    topMesh.geometry.computeVertexNormals()
    topMesh.scale.set(
        top.x,
        top.y,
        top.z
    )
    scene.add(topMesh)
}
