import {CylinderGeometry, Matrix4, Object3D, Vector3} from "three";
import * as THREE from "three";
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";

export const getTopVertices = (cylinder) => {
    let bottomVertices = []
    let vertices = cylinder.geometry.attributes.position.array
    for (let i = 0; i < 24; i += 3){
        bottomVertices.push(new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]))
    }
    return bottomVertices
}

export const getBottomVertices = (cylinder) => {
    let topVertices = []
    let vertices = cylinder.geometry.attributes.position.array
    for (let i = vertices.length - 3; i >= vertices.length - 24; i -= 3){
        topVertices.push(new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]))
    }
    return topVertices
}

export const cylinderMesh = (pointX, pointY, material, bottomWidth, topWidth) => {
    const direction = new Vector3().subVectors(pointY, pointX)
    const orientation = new Matrix4()
    orientation.lookAt(pointX, pointY, new Object3D().up)
    orientation.multiply(new Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1))
    const edgeGeometry = new CylinderGeometry(topWidth, bottomWidth, direction.length(), 8, 1, false)
    const edge = new THREE.Mesh(edgeGeometry, material)
    edge.applyMatrix4(orientation)
    edge.position.x = (pointY.x + pointX.x) / 2
    edge.position.y = (pointY.y + pointX.y) / 2
    edge.position.z = (pointY.z + pointX.z) / 2
    edge.updateMatrixWorld()
    edge.updateMatrix()
    edge.geometry.applyMatrix4( edge.matrix )
    edge.position.set( 0, 0, 0 )
    edge.rotation.set( 0, 0, 0 )
    edge.scale.set( 1, 1, 1 )
    return edge
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

export const generateBranch = (coreData, scene, material) => {
    let previousCylinder = null
    for (let i = 0; i < coreData.length - 1; i++){
        const cylinder = cylinderMesh(coreData[i].vector, coreData[i + 1].vector, material, coreData[i].width, coreData[i + 1].width)
        scene.add(cylinder)
        if (previousCylinder !== null) {
            let currentVertices = getBottomVertices(cylinder)
            let previousVertices = getTopVertices(previousCylinder)
            let allVertices = [...currentVertices, ...previousVertices]
            const geometry = new ConvexGeometry( allVertices )
            const mesh = new THREE.Mesh( geometry, material )
            scene.add( mesh )
        }
        previousCylinder = cylinder
    }
}
