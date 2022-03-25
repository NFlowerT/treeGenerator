import {
    CylinderGeometry,
    Mesh,
    Vector3,
    Group, SphereGeometry, MeshBasicMaterial
} from "three"
import {getRandomFloat, getRandomInt, updateVertices} from "./globalFunctions";
import * as THREE from "three";
import Simplex from "perlin-simplex";

export const generateTop = (trunkTop, treeTopDimensions, material, scene) => {
    const segmentAmount = 10
    let data = [
        {
            bottomRadius: 4,
            topRadius: 2,
            height: 2.8,
            x: trunkTop.x,
            y: trunkTop.y,
            z: trunkTop.z,
            rotationX: getRandomFloat(0, 5),
        },
        {
            bottomRadius: 4,
            topRadius: 2,
            height: 2.8,
            x: trunkTop.x,
            y: trunkTop.y + 2,
            z: trunkTop.z,
            rotationX: 5,
        },
        {
            bottomRadius: 4,
            topRadius: 2,
            height: 2.8,
            x: trunkTop.x,
            y: trunkTop.y + 4,
            z: trunkTop.z,
            rotationX: 0,
        },
    ]

    const group = new Group()
    data.forEach((item, i) => {
        const topGeometry = new CylinderGeometry(item.topRadius, item.bottomRadius, item.height, segmentAmount)
        const topMesh = new Mesh(topGeometry, material)

        topMesh.position.set(item.x, item.y, item.z)
        updateVertices(topMesh)
        modifyVertices(topMesh, scene, i === (data.length - 1))
        topMesh.rotation.set(item.rotationX * 0.0174532925, 0, 0)
        topMesh.geometry.attributes.position.needsUpdate = true

        group.add(topMesh)
    })
    scene.add(group)

    return group
}

export const modifyVertices = (topMesh, scene, lastVerticle) => {
    let vertices = convertVerticesToVectors(topMesh.geometry.attributes.position.array)
    vertices.sort((a, b) => a.y > b.y ? 1 : a.y < b.y ? -1 : 0)

    for (let i = 0; i < 12; i += 2){
        let y = getRandomInt(0.5, 1.2)
        getMatchingVertices(vertices, i).forEach(index => {
            vertices[index].y -= y
        })
    }

    getMatchingVertices(vertices, 20).forEach(index => {
        vertices[index].y += 1
    })

    if (lastVerticle){
        getMatchingVertices(vertices, 45).forEach(index => {
            vertices[index].y += 4.4
            vertices[index].x += 0.3
        })
    }

    topMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(convertVectorsToVertices(vertices), 3))

    // vertices.forEach((item, i) => {
    //     const mesh = new Mesh(new SphereGeometry(0.4), new MeshBasicMaterial())
    //     mesh.position.set(item.x, item.y, item.z)
    //     scene.add(mesh)
    // })

    console.log(vertices)

    return vertices
}


const convertVerticesToVectors = (verticesArray) => {
    let vertices = []
    for (let i = 0; i < verticesArray.length; i += 3){
        vertices.push({x: verticesArray[i], y: verticesArray[i + 1], z: verticesArray[i + 2], index: i})
    }
    return vertices
}

const convertVectorsToVertices = (vectorArray) => {
    let verticesArray = []
    vectorArray.sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0)
    vectorArray.forEach((vector) => {
        verticesArray.push(vector.x, vector.y, vector.z)
    })
    return verticesArray
}

const getMatchingVertices = (vertices, index) => {
    let indexArray = []
    vertices.forEach((verticle, i) => {
        if (vertices[index].x === verticle.x && vertices[index].y === verticle.y && vertices[index].z === verticle.z){
            indexArray.push(i)
        }
    })
    return indexArray
}
