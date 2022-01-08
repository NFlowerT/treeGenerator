import './App.css'
import * as React from 'react'
import * as THREE from 'three'
import {
    AmbientLight,
    DirectionalLight,
    MeshPhysicalMaterial, OctahedronGeometry,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
    CylinderGeometry,
    Object3D,
    Matrix4,
    TetrahedronGeometry,
    SphereGeometry,
    MeshBasicMaterial,
    MeshNormalMaterial, WebGL1Renderer,
} from 'three'
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import {useEffect, useRef, useState} from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {Mesh} from "three"
var Simplex = require('perlin-simplex')
var simplex = new Simplex()

const App = () => {

    const [s, setS] = useState(0.2) // scale
    const [generation, setGeneration] = useState(1)

    const container = useRef(null);

    const cylinderMesh = (pointX, pointY, material, bottomWidth, topWidth) => {
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
        edge.geometry.applyMatrix( edge.matrix )
        edge.position.set( 0, 0, 0 )
        edge.rotation.set( 0, 0, 0 )
        edge.scale.set( 1, 1, 1 )
        return edge
    }

    const generateBranch = (coreData, scene, material) => {
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

    const generateTop = (posVector, material, scene) => {
        const topGeometry = new TetrahedronGeometry(s, 5)
        const topMesh = new Mesh(topGeometry, material)
        topMesh.position.set(posVector.x, posVector.y, posVector.z)
        const k = 2
        const vertices = topMesh.geometry.attributes.position.array;
        for (let i = 0; i <= vertices.length; i += 3) {
            let p = new Vector3(vertices[i],vertices[i + 1],vertices[i + 2])
            p.normalize().multiplyScalar(1 + 0.2 * simplex.noise3d(p.x * k, p.y * k, p.z * k))
            topMesh.geometry.attributes.position.array[i] = p.x
            topMesh.geometry.attributes.position.array[i + 1] = p.y
            topMesh.geometry.attributes.position.array[i + 2] = p.z
        }
        topMesh.geometry.attributes.position.needsUpdate = true
        topMesh.geometry.computeVertexNormals()
        let xz = Math.floor(Math.random() * (6 - 4)) + 4
        topMesh.scale.set(
            s * xz,
            s * (Math.floor(Math.random() * (4 - 3)) + 3),
            s * xz
        )
        scene.add(topMesh)
    }

    const getTopVertices = (cylinder) => {
        let bottomVertices = []
        let vertices = cylinder.geometry.attributes.position.array
        for (let i = 0; i < 24; i += 3){
            bottomVertices.push(new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]))
        }
        return bottomVertices
    }

    const getBottomVertices = (cylinder) => {
        let topVertices = []
        let vertices = cylinder.geometry.attributes.position.array
        for (let i = vertices.length - 3; i >= vertices.length - 24; i -= 3){
            topVertices.push(new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]))
        }
        return topVertices
    }

    const generateBranchData = (startingVector, startingWidth, steps) => {
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

    const calculateTopPosition = (topCorePoint, topBranchPoint) => {
        return new Vector3(
            topBranchPoint.x,
            topBranchPoint.y + ((topBranchPoint.y / 100) * 15),
            topCorePoint.z
        )
    }

    const treeGrower = () => {

    }

    useEffect(() => {
        const scene = new Scene()

        //camera
        const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set( 0, 40, 40 )

        //light
        const light = new AmbientLight( 0x404040 )
        scene.add( light )
        const directionalLight1 = new DirectionalLight( 0xffffff, 0.8 )
        directionalLight1.position.set(-5, 2, 8)
        scene.add( directionalLight1 )
        const directionalLight2 = new DirectionalLight( 0xffffff, 0.5 )
        directionalLight2.position.set(10, 2, -8)
        scene.add( directionalLight2 )

        //renderer
        const renderer = new WebGL1Renderer()
        renderer.setSize( window.innerWidth, window.innerHeight )
        container.current.innerHTML = ""
        container.current.appendChild( renderer.domElement )

        //materials
        const woodMaterial = new MeshPhysicalMaterial({color: "#8f6246", flatShading: true})
        const topMaterial = new MeshPhysicalMaterial({color: "#91b341", flatShading: true})

        let coreSteps = [
            {x: s * 0.1, y: s * 1.8, z: s * 0, width: -25},
            {x: s * 0.3, y: s * 2.8, z: s * 0, width: -15},
            {x: s * 0.4, y: s * 2, z: s * 0, width: -10},
            {x: s * 0.2, y: s * 1, z: s * 0, width: -5},
            {x: s * -0.1, y: s * 1, z: s * 0, width: 0},
            {x: s * -0.6, y: s * 2, z: s * 0, width: -5},
            {x: s * -0.2, y: s * 2, z: s * 0, width: 0},
        ]

        let coreData = generateBranchData(new Vector3(0,0,0), s, coreSteps)
        generateBranch(coreData, scene, woodMaterial)

        let branch1Steps = [
            {x: s * -0.5, y: s * 0.35, z: s * -0.3, width: -40},
            {x: s * -0.3, y: s * 0.8, z: s * -0.2, width: -10},
            {x: s * 0.1, y: s * 1.1, z: s * -0.2, width: -20},
        ]
        let branch1Data = generateBranchData(coreData[coreData.length - 1].vector, coreData[coreData.length - 1].width, branch1Steps)
        generateBranch(branch1Data, scene, woodMaterial)


        let branch2Steps = [
            {x: s * 0.3, y: s * 0.2, z: s * 0.2, width: -40},
            {x: s * 0.5, y: s * 1.1, z: s * 0.3, width: -20},
            {x: s * 0.1, y: s * 1.3, z: s * -0.2, width: -20},
        ]
        let branch2Data = generateBranchData(coreData[coreData.length - 1].vector, coreData[coreData.length - 1].width, branch2Steps)
        generateBranch(branch2Data, scene, woodMaterial)

        generateTop(
            calculateTopPosition(
                coreData[coreData.length - 1].vector, branch1Data[branch1Data.length - 1].vector),
                topMaterial, scene
        )

        //controls
        const controls = new OrbitControls( camera, renderer.domElement )
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        }
        controls.update()
        controls.addEventListener( 'change', () => {renderer.render(scene, camera)} )

        //render
        renderer.setClearColor("#3c3f41")
        renderer.render( scene, camera )
    }, [s])

    return (
        <React.Fragment>
            <button onClick={() => setS(s + 0.1)}> Progress </button>
            <div ref={container}/>
        </React.Fragment>

    )
}

export default App
