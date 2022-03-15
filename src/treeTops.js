import {
    CylinderGeometry,
    Mesh,
    Vector3,
    Group, SphereGeometry, MeshBasicMaterial
} from "three"
import {getRandomFloat, updateVertices} from "./globalFunctions";

export const generateTop = (trunkTop, treeTopDimensions, material, scene) => {
    const segmentAmount = 10
    let data = []
    const coneAmount = 1

    for (let i = 0; i < coneAmount; i++){
        if (i === 0){
            let bottomRadius = getRandomFloat(4, 5)
            data.push(
                {
                    bottomRadius: bottomRadius,
                    topRadius: bottomRadius - 1.5,
                    height: getRandomFloat(2.5, 3.5),
                    x: trunkTop.x,
                    y: trunkTop.y,
                    z: trunkTop.z,
                    rotationX: getRandomFloat(0, 5),
                }
            )
        }
        else if (i > 0){
            data.push(
                {
                    bottomRadius: getRandomFloat(2, 4),
                    topRadius: getRandomFloat(2, 4),
                    height: getRandomFloat(2, 3),
                    x: data[i - 1].x + getRandomFloat(0, 1),
                    y: data[i - 1].y + getRandomFloat(2, 3),
                    z: data[i - 1].z + getRandomFloat(0, 1),
                    rotationX: getRandomFloat(0, 5),
                }
            )
        }
    }
    const group = new Group()
    data.forEach(item => {
        const topGeometry = new CylinderGeometry(item.topRadius, item.bottomRadius, item.height, segmentAmount)
        const topMesh = new Mesh(topGeometry, material)
        topMesh.position.set(item.x, item.y, item.z)
        topMesh.rotation.set(item.rotationX * 0.0174532925, 0, 0)
        updateVertices(topMesh)
        getVertices(topMesh, scene)
        group.add(topMesh)
    })
    scene.add(group)

    return group
}

export const getVertices = (topMesh, scene) => {
    let vertices = []
    let verticesArray = topMesh.geometry.attributes.position.array
    for (let i = 0; i < verticesArray.length; i += 3){
        vertices.push(new Vector3(verticesArray[i], verticesArray[i + 1], verticesArray[i + 2]))
    }
    vertices.sort((a, b) => (a.y > b.y) ? 1 : -1)

    vertices.forEach((item, i) => {
        const mesh = new Mesh(new SphereGeometry(0.4), new MeshBasicMaterial())
        mesh.position.set(item.x, item.y, item.z)
        scene.add(mesh)
    })


    return vertices
}
