import {cylinderFaceAmount} from "./App";
import {Vector3} from "three";
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import * as THREE from "three";

export const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min
}

function getRandomInt(min, max) {
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

export const getVertices = (cylinder) => {
    let verticesArray = []
    let vertices = cylinder.geometry.attributes.position.array
    for (let i = 0; i < (cylinderFaceAmount * 3); i += 3){
        verticesArray.push(new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]))
    }
    return verticesArray
}
