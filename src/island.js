import {DodecahedronGeometry, Mesh, MeshPhysicalMaterial} from "three"
import {
    convertVectorsToVertices,
    convertVerticesToVectors,
    getMatchingVertices,
    updateVertices
} from "./globalFunctions"
import {makeNoise2D} from "open-simplex-noise"
import * as THREE from "three"

export const createIsland = (scene, radius) => {
    const mesh = new Mesh(new DodecahedronGeometry(radius, 2), new MeshPhysicalMaterial({color: "#95bc82", flatShading: true}));
    let vertices = convertVerticesToVectors(mesh.geometry.attributes.position.array)
    let flatVertices = []
    vertices.forEach((verticle, i) => {
        if (verticle.y > -1){
            let matchingVertices = getMatchingVertices(vertices, i)
            const y = -1
            const noise2D = makeNoise2D()
            matchingVertices.forEach(v => {
                vertices[v].y = y + (0.2 * noise2D(vertices[v].x * 2, vertices[v].y * 0.4)) * (radius / 2)
            })
            flatVertices = flatVertices.concat(matchingVertices)
        }
    })
    mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(convertVectorsToVertices(vertices), 3))
    mesh.translateY(1)
    flatVertices = flatVertices.map(i => vertices[i])
    return {islandMesh: mesh, islandPoints: flatVertices}
}