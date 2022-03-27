import {
    CylinderGeometry,
    Mesh,
    Group
} from "three"
import {getRandomInt, updateVertices} from "./globalFunctions"
import * as THREE from "three"

const convertStringToNumber = (s) => {
    var total = 0
    s = s.replace(/\s/g, '').match(/[+\-]?([0-9\.\s]+)/g) || []
    while(s.length) total += parseFloat(s.shift())
    return total
}

const convertStringToData = (string, trunkTop) => {
    let data = []
    string.split(",").forEach(item => {
        item = item.replace("x", trunkTop.x)
        item = item.replace("y", trunkTop.y)
        item = item.replace("z", trunkTop.z)
        let itemArray = item.split("|")
        itemArray = itemArray.map(i => convertStringToNumber(i))
        data.push({
            bottomRadius: itemArray[0],
            topRadius: itemArray[1],
            height: itemArray[2],
            x: itemArray[3],
            y: itemArray[4],
            z: itemArray[5],
            rotationX: itemArray[6],
        })
    })
    return data
}

export const generateTop = (trunkTop, treeTopDimensions, material, scene) => {
    const dataInString = "4.2|3|2|x|y|z|4,4|2|2.8|x|y+2|z|5,4|2|2.8|x|y+4|z|0,4|2|2.8|x|y+6|z|0"
    const data = convertStringToData(dataInString, trunkTop)

    const group = new Group()
    data.forEach((item, i) => {
        const topGeometry = new CylinderGeometry(item.topRadius, item.bottomRadius, item.height, 10)
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
            vertices[index].y += 3.6
            vertices[index].x += 0.3
        })
    }

    topMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(convertVectorsToVertices(vertices), 3))

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
