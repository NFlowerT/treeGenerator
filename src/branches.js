import {CylinderGeometry, Matrix4, Mesh, MeshBasicMaterial, Object3D, Vector3} from "three";
import * as THREE from "three";
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import {getVertices, updateVertices} from "./globalFunctions";
import {cylinderFaceAmount} from "./App";




export const cylinderMesh = (pointX, pointY, material, width) => {
    const geometry = new CylinderGeometry(width, width, 0, 9)
    const mesh = new Mesh(geometry, material)
    mesh.position.set(pointX.x, pointX.y, pointX.z)
    updateVertices(mesh)

    return mesh
}

export const generateBranchData = (startingVector, startingWidth, steps) => {
    let data = [{vector: startingVector, width: startingWidth}]
    steps.forEach(step => {
        data.push({
            vector: new Vector3(
                data[data.length - 1].vector.x + step.x,
                data[data.length - 1].vector.y + step.y,
                data[data.length - 1].vector.z + step.z,
            ),
            width: data[data.length - 1].width + (data[data.length - 1].width * (step.width / 100))
        })
    })
    return data
}

export const generateBranch = (branchData, scene, material) => {
    let previousCylinder = null
    let data = []
    for (let i = 0; i < branchData.length - 1; i++){
        const cylinder = cylinderMesh(branchData[i].vector, branchData[i + 1].vector, material, branchData[i].width, branchData[i + 1].width)
        scene.add(cylinder)
        if (previousCylinder !== null) {
            let currentVertices = getVertices(cylinder)
            let previousVertices = getVertices(previousCylinder)
            let allVertices = [...currentVertices, ...previousVertices]
            const geometry = new ConvexGeometry( allVertices )
            const mesh = new THREE.Mesh( geometry, material )
            scene.add( mesh )
        }
        data.push(cylinder)
        previousCylinder = cylinder
    }
    return data
}
