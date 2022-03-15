import {getRandomFloat, getVertices, updateVertices} from "./globalFunctions"
import * as THREE from "three";
import {CylinderGeometry, Mesh, Vector3, SphereGeometry, MeshBasicMaterial} from "three";
import {cylinderFaceAmount} from "./App";
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import {edgeTable} from "three/examples/jsm/objects/MarchingCubes";
import Simplex from "perlin-simplex";

export const generateTopBranchesTops = (topBranchesAmount, lowestTopVertices) => {
  let topBranchesTops = []
    for (let i = 0; i < topBranchesAmount; i++){
        topBranchesTops.push(lowestTopVertices[i])
    }
    return(topBranchesTops)
}

//
// export const generateTopBranchesSteps = (topBranchesAmount, topBranchesTops, coreData) => {
//     let newTopBranchesSteps = []
//     for (let i = 0; i < topBranchesAmount; i++){
//         let topBranchesStepsAmount = Math.floor(getRandomNumber(2,4))
//         let newTopBranches = []
//         for (let j = 0; j < topBranchesStepsAmount; j++){
//             newTopBranches.push({
//                 x: ((topBranchesTops[i].x - coreData[coreData.length - 1].vector.x) / topBranchesStepsAmount),
//                 y: ((topBranchesTops[i].y - coreData[coreData.length - 1].vector.y) / topBranchesStepsAmount),
//                 z: ((topBranchesTops[i].z - coreData[coreData.length - 1].vector.z) / topBranchesStepsAmount),
//                 width: getRandomNumber(-5,5)
//             })
//
//         }
//         newTopBranchesSteps.push(newTopBranches)
//     }
//     return(newTopBranchesSteps)
// }
//
// export const generateTopBranchData = (startPoint, endpoint, stepAmount, startingWidth) => {
//     let newStartPoint = new Vector3(
//         startPoint.x + (endpoint.x * 0.3),
//         startPoint.y,
//         startPoint.z + (endpoint.z * 0.3)
//     )
//     let data = [{vector: newStartPoint, width: startingWidth}]
//     const curve = new THREE.CubicBezierCurve3(
//         newStartPoint,
//         new THREE.Vector3( newStartPoint.x + (endpoint.x * 0.43), newStartPoint.y + (endpoint.y * 0.18), endpoint.z + newStartPoint.z),
//         new THREE.Vector3( newStartPoint.x + (endpoint.x * 0.79), newStartPoint.y + (endpoint.y * 0.48), endpoint.z + newStartPoint.z),
//         endpoint
//     )
//     curve.getPoints(stepAmount).forEach(point => {
//         data.push({
//             vector: point,
//             width: startingWidth * 0.5
//         })
//     })
//     return data
// }

// export const generateTopBranches = (scene, material, topBranchesAmount, generateBranchData, coreData,
//                                     generateBranch, lowestTopVertices) => {
//     let data = []
//     for (let i = 0; i < topBranchesAmount; i++){
//         let branchData = generateTopBranchData(
//                 coreData[coreData.length - 1].vector, lowestTopVertices[i], 12, coreData[coreData.length - 1].width, scene
//             )
//         let branchMeshes = generateBranch(branchData, scene, material)
//         data.push(branchMeshes)
//     }
//     return data
// }

// export const connectTopBranches = (scene, material, topBranchesData, trunkTop) => {
//     let vertices = []
//     topBranchesData.forEach(item => {
//         vertices.push(item[item.length - 1].geometry.attributes.position.array)
//     })
//     // vertices = vertices.filter((v,i,a)=>a.findIndex(t=>(t.x===v.x && t.y===v.y && t.z === v.z))===i)
//
// }

export const generateTopBranches = (startPoint, lowestTopVertices, topBranchesData, scene, material) => {
    console.log(topBranchesData)
    let bottomMeshes = []
    const endPoints = [
        lowestTopVertices.reduce((prev, current) => (prev.x + prev.y > current.x + prev.y) ? prev : current),
        lowestTopVertices.reduce((prev, current) => (prev.x + prev.y < current.x + prev.y) ? prev : current),
        lowestTopVertices[0]
    ]
    console.log(endPoints)
    for (let i = 0; i < topBranchesData.length; i++){
        const endPoint = new Vector3(endPoints[i].x, endPoints[i].y + 1, endPoints[i].z)
        let pointArray = []
        let meshArray = []
        const curve = new THREE.CubicBezierCurve3(
            startPoint,
            new THREE.Vector3( startPoint.x, startPoint.y + (endPoint.y * getRandomFloat(0.1, 0.3)), startPoint.z),
            new THREE.Vector3( endPoint.x, startPoint.y + (endPoint.y * getRandomFloat(0.1, 0.3)), endPoint.z),
            endPoint
        )

        curve.getPoints(topBranchesData[i].length - 1).forEach(point => {
            pointArray.push(point)
        })

        const geometry = new THREE.TubeGeometry( curve, 8, 0.4, 9, false );
        const mesh = new Mesh(geometry, material)
        scene.add(mesh)
        // pointArray = pointArray.slice(2)
        //
        // for (let i = pointArray.length - 1; i >= 0; i--){
        //     let point = pointArray[pointArray.length]
        //     let geometry = new CylinderGeometry(topBranchesData[i][j], topBranchesData[i][j], 0, cylinderFaceAmount)
        //     let mesh = new Mesh(geometry, material)
        //     mesh.position.set(point.x, point.y, point.z)
        //     if (j < pointArray.length - 1){
        //         mesh.lookAt(pointArray[j + 1].x, pointArray[j + 1].y, pointArray[j + 1].z)
        //     }
        //     mesh.rotateX(180)
        //     updateVertices(mesh)
        //     scene.add(mesh)
        //     meshArray.push(mesh)
        //     if (i === pointArray.length - 1) {
        //         bottomMeshes.push(mesh)
        //     }
        // }
        // pointArray.forEach((point,j) => {

            // let vertices = mesh.geometry.attributes.position.array
            // let newVertices = new Float32Array(vertices.length)
            // const simplex = new Simplex()
            // for (let i = 0; i <= vertices.length; i += 3) {
            //     let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
            //     p.normalize().multiplyScalar(1 + 0.2 * simplex.noise(p.x, p.y))
            //     newVertices[i] = p.x
            //     newVertices[i + 1] = p.y
            //     newVertices[i + 2] = p.z
            // }
            // mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3))
        //     updateVertices(mesh)
        //     scene.add(mesh)
        //     meshArray.push(mesh)
        //     if (j === 0) {
        //         bottomMeshes.push(mesh)
        //     }
        // })

        // for (let i = 1; i < meshArray.length; i++) {
        //     let meshes = [meshArray[i - 1], meshArray[i]]
        //     let vertices = []
        //     meshes.forEach(mesh => {
        //         vertices = vertices.concat(getVertices(mesh))
        //     })
        //     const geometry = new ConvexGeometry( vertices )
        //     const mesh = new THREE.Mesh( geometry, material )
        //     scene.add( mesh )
        // }
    }
    return bottomMeshes
}
