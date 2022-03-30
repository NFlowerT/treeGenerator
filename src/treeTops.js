import {
    CylinderGeometry,
    Mesh,
    Group, MeshPhysicalMaterial, Vector3, MeshBasicMaterial, Matrix4, Object3D
} from "three"
import {convertVerticesToVectors, getMatchingVertices, convertVectorsToVertices,updateVertices} from "./globalFunctions"
import * as THREE from "three"

const cylinderMesh = (pointX, pointY, material, bottomWidth, topWidth, rotationY, lastVerticle, tipHeight, tipOffsetX, tipOffsetZ) => {
    const direction = new Vector3().subVectors(pointY, pointX)
    const orientation = new Matrix4()
    orientation.lookAt(pointX, pointY, new Object3D().up)
    orientation.multiply(new Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1))
    const edgeGeometry = new CylinderGeometry(topWidth, bottomWidth, direction.length(), 10, 2, false)
    const edge = new THREE.Mesh(edgeGeometry, material)
    let vertices = convertVerticesToVectors(edge.geometry.attributes.position.array)
    vertices.sort((a, b) => a.y > b.y ? 1 : a.y < b.y ? -1 : 0)

    for (let i = 0; i < 11; i += 2){
        getMatchingVertices(vertices, i).forEach(index => {
            vertices[index].y -= 0.7
        })
    }

    getMatchingVertices(vertices, 20).forEach(index => {
        vertices[index].y += 1
    })

    if (lastVerticle){
        getMatchingVertices(vertices, 60).forEach(index => {
            vertices[index].y += tipHeight
            vertices[index].x += tipOffsetX
            vertices[index].z += tipOffsetZ
        })
    }
    edge.geometry.setAttribute('position', new THREE.Float32BufferAttribute(convertVectorsToVertices(vertices), 3))
    updateVertices(edge)
    edge.applyMatrix4(orientation)
    edge.position.x = (pointY.x + pointX.x) / 2
    edge.position.y = (pointY.y + pointX.y) / 2
    edge.position.z = (pointY.z + pointX.z) / 2
    edge.rotateY(rotationY * 0.0174532925)

    updateVertices(edge)

    return edge
}

export const generateTop = (trunkTop, scene, topData) => {
    let {color, tipHeight, data, tipOffsetX, tipOffsetZ, segmentHeight, topOffsetX, topOffsetZ} = topData
    const material = new MeshPhysicalMaterial({color: parseInt(color.replace("#","0x"),16), flatShading: true})
    const group = new Group()
    const height = data.length * segmentHeight
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3( trunkTop.x, trunkTop.y, trunkTop.z ),
        new THREE.Vector3( trunkTop.x - (topOffsetX > 1 ? -1 : topOffsetX), trunkTop.y + (height / 2), trunkTop.z - (topOffsetZ > 1 ? -1 : topOffsetZ) ),
        new THREE.Vector3( trunkTop.x + topOffsetX, trunkTop.y + height, trunkTop.z + topOffsetZ ),
    );
    const points = curve.getPoints(data.length - 1);
    let previousPoint = null
    points.forEach((point, i) => {
        if (previousPoint) {
            const item = data[i]
            const topMesh = cylinderMesh(
                new Vector3(previousPoint.x, previousPoint.y - 0.3, previousPoint.z),
                point, material, item.bottomRadius, item.topRadius, item.rotationY,
                i === points.length - 1, tipHeight, tipOffsetX, tipOffsetZ)
            updateVertices(topMesh)
            topMesh.geometry.attributes.position.needsUpdate = true
            group.add( topMesh );
        }
        previousPoint = point
    })
    group.translateY(-1)
    return group
}