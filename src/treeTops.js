import {CylinderGeometry, Mesh, MeshBasicMaterial, SphereGeometry, TetrahedronGeometry, Vector3, ConeGeometry, Float32BufferAttribute} from "three"
import {updateVertices} from "./globalFunctions"
import Simplex from "perlin-simplex";


export const generateTop = (trunkTop, treeTopDimensions, material, scene) => {
    const segmentAmount = 10
    let data = [
        {
            bottomRadius: 3,
            topRadius: 2.4,
            height: 2,
            x: trunkTop.x,
            y: trunkTop.y,
            z: trunkTop.z,
            rotationX: 4,
            rotationZ: 5
        },
        {
            bottomRadius: 3,
            topRadius: 2.2,
            height: 2,
            x: trunkTop.x,
            y: trunkTop.y + 1.8,
            z: trunkTop.z,
            rotationX: -2,
            rotationZ: 0
        },
        {
            bottomRadius: 2.9,
            topRadius: 1.9,
            height: 2,
            x: trunkTop.x,
            y: trunkTop.y + 3.2,
            z: trunkTop.z + 0.5,
            rotationX: 10,
            rotationZ: 0
        },
        {
            bottomRadius: 2.9,
            topRadius: 0,
            height: 5,
            x: trunkTop.x,
            y: trunkTop.y + 6,
            z: trunkTop.z,
            rotationX: -5,
            rotationZ: 0
        },
    ]
    data.forEach(item => {
        const topGeometry = new CylinderGeometry(item.topRadius, item.bottomRadius, item.height, segmentAmount)
        const topMesh = new Mesh(topGeometry, material)
        topMesh.position.set(item.x, item.y, item.z)
        topMesh.rotation.set(item.rotationX * 0.0174532925, 0, item.rotationZ * 0.0174532925)
        scene.add(topMesh)
    })


    // const k = 2
    // const vertices = topMesh.geometry.attributes.position.array;
    //
    // topMesh.geometry.attributes.position.array.needsUpdate = true
    // let newVertices = new Float32Array(vertices.length)

    // for (let i = 0; i <= vertices.length; i += 3) {
    //     let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
    //     p.normalize().multiplyScalar(1 + 0.2 * simplex.noise3d(p.x * k, p.y * k, p.z * k))
    //     newVertices[i] = p.x
    //     newVertices[i + 1] = p.y
    //     newVertices[i + 2] = p.z
    // }
    //
    // topMesh.geometry.setAttribute('position', new Float32BufferAttribute(newVertices, 3));
    //
    // topMesh.scale.set(
    //     treeTopDimensions.x,
    //     treeTopDimensions.y,
    //     treeTopDimensions.z
    // )

    // updateVertices(topMesh)


    // return(getTopVertices(topMesh, scene))
}

export const getTopVertices = (topMesh, scene) => {
    let topVertices = []
    let verticesArray = topMesh.geometry.attributes.position.array
    for (let i = 0; i < verticesArray.length; i += 3){
        topVertices.push(new Vector3(verticesArray[i], verticesArray[i + 1], verticesArray[i + 2]))
    }
    topVertices.sort((a, b) => (a.y > b.y) ? 1 : -1)

    return topVertices
}
