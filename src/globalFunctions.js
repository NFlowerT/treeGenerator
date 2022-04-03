import {Vector3} from "three";

export const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const updateVertices = (mesh) => {
    mesh.updateMatrix()
    mesh.geometry.applyMatrix4( mesh.matrix )
    mesh.position.set( 0, 0, 0 )
    mesh.rotation.set( 0, 0, 0 )
    mesh.scale.set( 1, 1, 1 )
    mesh.updateMatrix()
}

export const getVertices = (mesh) => {
    let verticesArray = []
    let vertices = mesh.geometry.attributes.position.array
    for (let i = 0; i < (vertices.length - 1); i += 3){
        verticesArray.push(new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]))
    }
    return verticesArray
}

export const convertVerticesToVectors = (verticesArray) => {
    let vertices = []
    for (let i = 0; i < verticesArray.length; i += 3){
        vertices.push({x: verticesArray[i], y: verticesArray[i + 1], z: verticesArray[i + 2], index: i})
    }
    return vertices
}

export const convertVectorsToVertices = (vectorArray) => {
    let verticesArray = []
    vectorArray.sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0)
    vectorArray.forEach((vector) => {
        verticesArray.push(vector.x, vector.y, vector.z)
    })
    return verticesArray
}

export const getMatchingVertices = (vertices, index) => {
    let indexArray = []
    vertices.forEach((verticle, i) => {
        if (vertices[index].x === verticle.x && vertices[index].y === verticle.y && vertices[index].z === verticle.z){
            indexArray.push(i)
        }
    })
    return indexArray
}

export const convertStringToNumber = (s) => {
    let total = 0
    s = s.replace(/\s/g, '').match(/[+\-]?([0-9\.\s]+)/g) || []
    while(s.length) total += parseFloat(s.shift())
    return total
}
