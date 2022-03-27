import {
    CylinderGeometry,
    Mesh,
    Group, MeshPhysicalMaterial
} from "three"
import {convertVerticesToVectors, getMatchingVertices, convertVectorsToVertices,updateVertices} from "./globalFunctions"
import * as THREE from "three"

const decoder = (string, trunkTop) => {
    let splitData = string.split("&")
    return ({
        color: splitData[0],
        data: convertStringToData(splitData[1], trunkTop)
    })
}

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

export const generateTop = (trunkTop, scene, topData) => {
    let {color, data} = decoder(topData, trunkTop)

    const material = new MeshPhysicalMaterial({color: parseInt(color.replace("#","0x"),16), flatShading: true})
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
        getMatchingVertices(vertices, i).forEach(index => {
            vertices[index].y -= 0.7
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



