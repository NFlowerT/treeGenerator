import {
    CylinderGeometry,
    Mesh,
    Group, MeshPhysicalMaterial, Vector3, MeshBasicMaterial, Matrix4, Object3D
} from "three"
import {convertVerticesToVectors, getMatchingVertices, convertVectorsToVertices,updateVertices} from "./globalFunctions"
import * as THREE from "three"

// let previousPoint = null
// points.forEach(point => {
//     if (previousPoint) {
//         const mesh = cylinderMesh(new Vector3(previousPoint.x, previousPoint.y - 0.3, previousPoint.z), point, new MeshBasicMaterial({color: "#911c1c"}), 5,2)
//         scene.add(mesh)
//     }
//     previousPoint = point
// })

const cylinderMesh = (pointX, pointY, material, bottomWidth, topWidth) => {
    const direction = new Vector3().subVectors(pointY, pointX)
    const orientation = new Matrix4()
    orientation.lookAt(pointX, pointY, new Object3D().up)
    orientation.multiply(new Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1))
    const edgeGeometry = new CylinderGeometry(topWidth, bottomWidth, direction.length(), 12, 1, false)
    const edge = new THREE.Mesh(edgeGeometry, material)
    edge.applyMatrix4(orientation)
    edge.position.x = (pointY.x + pointX.x) / 2
    edge.position.y = (pointY.y + pointX.y) / 2
    edge.position.z = (pointY.z + pointX.z) / 2

    updateVertices(edge)

    return edge
}

const decoder = (string, trunkTop) => {
    let splitData = string.split("&")
    return ({
        color: splitData[0],
        tipHeight: parseFloat(splitData[1]),
        tipOffsetX: parseFloat(splitData[2]),
        tipOffsetZ: parseFloat(splitData[3]),
        data: convertStringToData(splitData[4], trunkTop)
    })
}

const convertStringToNumber = (s) => {
    let total = 0
    s = s.replace(/\s/g, '').match(/[+\-]?([0-9\.\s]+)/g) || []
    while(s.length) total += parseFloat(s.shift())
    return total
}

const convertStringToData = (string, trunkTop) => {
    let data = []
    let y = 0
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
            rotationY: itemArray[6],
        })
    })
    return data
}

export const generateTop = (trunkTop, scene, topData) => {
    let {color, tipHeight, data, tipOffsetX, tipOffsetZ} = decoder(topData, trunkTop)
    const material = new MeshPhysicalMaterial({color: parseInt(color.replace("#","0x"),16), flatShading: true})
    const group = new Group()
    data.forEach((item, i) => {
        const topGeometry = new CylinderGeometry(item.topRadius, item.bottomRadius, item.height, 10)
        const topMesh = new Mesh(topGeometry, material)
        topMesh.position.set(item.x, item.y, item.z)
        updateVertices(topMesh)
        modifyVertices(topMesh, scene, i === (data.length - 1), tipHeight, tipOffsetX, tipOffsetZ)
        topMesh.rotation.set(0, item.rotationY * 0.0174532925, 0)
        topMesh.geometry.attributes.position.needsUpdate = true
        group.add( topMesh );
    })
    scene.add(group)

    return group
}

export const modifyVertices = (topMesh, scene, lastVerticle, tipHeight, tipOffsetX, tipOffsetZ) => {
    let vertices = convertVerticesToVectors(topMesh.geometry.attributes.position.array)
    vertices.sort((a, b) => a.y > b.y ? 1 : a.y < b.y ? -1 : 0)

    for (let i = 0; i < 10; i += 2){
        getMatchingVertices(vertices, i).forEach(index => {
            vertices[index].y -= 0.7
        })
    }

    getMatchingVertices(vertices, 20).forEach(index => {
        vertices[index].y += 1
    })

    if (lastVerticle){
        getMatchingVertices(vertices, 45).forEach(index => {
            vertices[index].y += tipHeight
            vertices[index].x += tipOffsetX
            vertices[index].z += tipOffsetZ
        })
    }

    topMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(convertVectorsToVertices(vertices), 3))

    return vertices
}