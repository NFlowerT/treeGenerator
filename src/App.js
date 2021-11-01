import * as React from 'react'
import * as THREE from 'three'
import {useEffect} from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {Mesh} from "three";


const App = () => {
    let coreWidth = 2
    const cylinderMesh = (pointX, pointY, material, shrink) => {
        const direction = new THREE.Vector3().subVectors(pointY, pointX)
        const orientation = new THREE.Matrix4()
        orientation.lookAt(pointX, pointY, new THREE.Object3D().up)
        orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
            0, 0, 1, 0,
            0, -1, 0, 0,
            0, 0, 0, 1))
        const edgeGeometry = new THREE.CylinderGeometry(coreWidth - shrink, coreWidth, direction.length(), 8, 1)
        coreWidth -= shrink
        const edge = new THREE.Mesh(edgeGeometry, material)
        edge.applyMatrix(orientation)
        edge.position.x = (pointY.x + pointX.x) / 2
        edge.position.y = (pointY.y + pointX.y) / 2
        edge.position.z = (pointY.z + pointX.z) / 2
        return edge
    }
    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set( 0, 20, 20 )

        const light = new THREE.AmbientLight( 0x404040 )
        scene.add( light )
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
        scene.add( directionalLight )

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.innerHTML = ""
        document.body.appendChild( renderer.domElement )

        let vectorArray = [
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 0, 6, 0 ),
            new THREE.Vector3( 1, 15, 0 ),
            new THREE.Vector3( -0.5, 20, 0 ),
            new THREE.Vector3( -0.5, 27, 0 ),
        ]

        const woodMaterial = new THREE.MeshPhysicalMaterial({color: "#8f6246"})
        const topMaterial = new THREE.MeshPhysicalMaterial({color: "#91b341"})

        for (let i = 0; i < vectorArray.length - 1; i++){
            const connectorGeometry = new THREE.OctahedronGeometry(coreWidth * 1.02,1)
            const connectorMaterial = woodMaterial
            const connectorMesh = new Mesh(connectorGeometry, connectorMaterial)
            connectorMesh.position.set(vectorArray[i].x, vectorArray[i].y, vectorArray[i].z)
            const cylinder = cylinderMesh(vectorArray[i], vectorArray[i + 1], woodMaterial, 0.4)
            scene.add(connectorMesh)
            scene.add(cylinder)
        }

        coreWidth = 1
        const branch1 = cylinderMesh(vectorArray[1], new THREE.Vector3( -3, 7.4, 2 ), woodMaterial, 0)
        scene.add(branch1)

        const branch2 = cylinderMesh(vectorArray[2], new THREE.Vector3( vectorArray[2].x + 8, vectorArray[2].y + 5, vectorArray[2].z ), woodMaterial, 0.3)
        scene.add(branch2)

        const topGeometry1 = new THREE.TetrahedronGeometry(6, 2)
        const topMesh1 = new Mesh(topGeometry1, topMaterial)
        topMesh1.position.y = 30
        scene.add(topMesh1)

        const topGeometry2 = new THREE.TetrahedronGeometry(4, 2)
        const topMesh2 = new Mesh(topGeometry2, topMaterial)
        topMesh2.position.set(vectorArray[2].x + 8, vectorArray[2].y + 5, vectorArray[2].z)
        scene.add(topMesh2)

        const controls = new OrbitControls( camera, renderer.domElement )
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        }
        controls.update()
        controls.addEventListener( 'change', ()=>{renderer.render(scene, camera)} );
        renderer.render( scene, camera )
    }, [])
    return (
        <div/>
    )
}

export default App
