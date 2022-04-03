import {DodecahedronGeometry, Mesh, MeshPhysicalMaterial, Float32BufferAttribute} from "three"
import {convertVectorsToVertices, convertVerticesToVectors, getMatchingVertices} from "./globalFunctions"
import {makeNoise2D} from "open-simplex-noise"

export const createIsland = (scene, radius) => {
    const mesh = new Mesh(new DodecahedronGeometry(radius, 2), new MeshPhysicalMaterial({color: "#e1a989", flatShading: true}));
    let vertices = convertVerticesToVectors(mesh.geometry.attributes.position.array)
    let flatVertices = []
    vertices.forEach((verticle, i) => {
        if (verticle.y > -1){
            let matchingVertices = getMatchingVertices(vertices, i)
            const y = -1
            const noise2D = makeNoise2D()
            matchingVertices.forEach(v => {
                vertices[v].y = y + (0.2 * noise2D(vertices[v].x * 2, vertices[v].y * 0.4)) * (radius / 3)
            })
            flatVertices = flatVertices.concat(matchingVertices)
        }
    })
    mesh.geometry.setAttribute('position', new Float32BufferAttribute(convertVectorsToVertices(vertices), 3))
    mesh.translateY(1)
    return mesh
}
