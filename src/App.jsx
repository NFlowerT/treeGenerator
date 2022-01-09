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
    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min
    }

    const [hS, setHS] = useState(1) // scale
    const [vS, setVS] = useState(1) // scale
    const [generation, setGeneration] = useState(0)
    const container = useRef(null);
    const [coreData, setCoreData] = useState([])
    const [coreSteps, setCoreSteps] = useState([])
    const [trunkSegmentAmount, setTrunkSegmentAmount] = useState(Math.floor(getRandomNumber(6, 8)))
    const [trunkStartWidth, setTrunkStartWidth] = useState(0.4)

    const trunkTop = {
        x: getRandomNumber(-0.2, 0.2),
        z: getRandomNumber(-0.2, 0.2)
    }

    const growTrunk = () => {
        if (coreSteps.length === 0) {
            setCoreSteps(coreSteps.concat({
                x: 0,
                y: getRandomNumber(0.3, 0.6),
                z: 0,
                width: -20
            }))
        } else if (coreSteps.length < trunkSegmentAmount) {
            if (generation % 4 === 0) {
                if (coreSteps.length < Math.floor(trunkSegmentAmount / 2)) {
                    setCoreSteps(coreSteps.concat({
                        x: getRandomNumber(-0.1, 0.1),
                        y: getRandomNumber(0.4, 1),
                        z: getRandomNumber(-0.1, 0.1),
                        width: getRandomNumber(-15, 1)
                    }))
                } else {
                    setCoreSteps(coreSteps.concat({
                        x: ((trunkTop.x - coreData[Math.floor(trunkSegmentAmount / 2)].vector.x / Math.floor(trunkSegmentAmount / 2))),
                        y: getRandomNumber(0.5, 1),
                        z: ((trunkTop.z - coreData[Math.floor(trunkSegmentAmount / 2)].vector.z / Math.floor(trunkSegmentAmount / 2))),
                        width: getRandomNumber(-15, 5)
                    }))
                }
            }
        } else {
            incrementCoreSteps(0.01)
            setTrunkStartWidth(trunkStartWidth + 0.02)
        }
    }

    const incrementCoreSteps = (height) => {
        let newCoreSteps = []
        coreSteps.forEach(step => {
            console.log("step", step)
            newCoreSteps.push({
                x: step.x,
                y: step.y + height,
                z: step.z,
                width: step.width
            })
        })
        setCoreSteps(newCoreSteps)
    }

    const [topBranchesRadii, setTopBranchesRadii] = useState([])
    const [topBranchesHeights, setTopBranchesHeights] = useState([])

    const growTopBranches = () => {
        if (generation === 7){
            generateTopBranchesRadii()
            generateTopBranchesHeights()
        }
        if (generation === 8) {
            generateTopBranchesTops()
        }
        if (generation === 9) {
            generateTopBranchesSteps()
        }
        if (generation > 9){
            incrementTopBranchesRadii(0.1)
            incrementTopBranchesHeights(0.1)
            generateTopBranchesTops()
            generateTopBranchesSteps()
            setTop({x: top.x + 0.08, y: top.y + 0.05, z: top.z + 0.08})
        }
    }

    const growTree = () => {
        growTrunk()
        growTopBranches()
        generateModel()
        setGeneration(generation + 1)
    }

    const incrementTopBranchesRadii = (i) => {
        let newTopBranchesRadii = []
        topBranchesRadii.forEach(radius => {
            newTopBranchesRadii.push(radius + i)
        })
        setTopBranchesRadii(newTopBranchesRadii)
    }

    const generateTopBranchesRadii = () => {
        let newTopBranchesRadii = []
        for (let i = 0; i < topBranchesAmount; i++){
            newTopBranchesRadii.push(getRandomNumber(0.9, 1.2))
        }
        setTopBranchesRadii(newTopBranchesRadii)
    }

    const generateTopBranchesHeights = () => {
        let newTopBranchesHeights = []
        for (let i = 0; i < topBranchesAmount; i++) {
            newTopBranchesHeights.push(getRandomNumber(0.8, 1.2))
        }
        setTopBranchesHeights(newTopBranchesHeights)
    }

    const incrementTopBranchesHeights = (i) => {
        let newTopBranchesHeights = []
        topBranchesRadii.forEach(radius => {
            newTopBranchesHeights.push(radius + i)
        })
        setTopBranchesHeights(newTopBranchesHeights)
    }

    const [topBranchesTops, setTopBranchesTops] = useState([])
    const [topBranchesAmount] = useState(Math.floor(getRandomNumber(2, 5)))
    const [topBranchesSteps, setTopBranchesSteps] = useState([])
    const [topBranchesData, setTopBranchData] = useState([])
    const [top, setTop] = useState({x: getRandomNumber(1.2, 1.4), y: 1, z: getRandomNumber(1.2, 1.4)})

    const evenRanges = {
        0: 0,
        1: 1,
        2: 0.5,
        3: 0.25
    }

    const unevenRanges = {
        0: 0.33,
        1: 0.66,
        2: 1
    }

    const generateTopBranchesTops = (radius, height) => {
        let newTopBranchesTops = []
        for (let i = 0; i < topBranchesAmount; i++){
            let r = topBranchesRadii[i] * Math.sqrt(0.5)
            let theta = i % 2 ? evenRanges[i] * 2 * Math.PI : unevenRanges[i] * 2 * Math.PI
            const x = coreData[coreData.length - 1].vector.x + r * Math.cos(theta)
            const z = coreData[coreData.length - 1].vector.z + r * Math.sin(theta)
            const y = coreData[coreData.length - 1].vector.y + topBranchesHeights[i]
            newTopBranchesTops.push(new Vector3(x, y, z))
        }
        setTopBranchesTops(newTopBranchesTops)
    }

    const generateTopBranchesSteps = () => {
        let newTopBranchesSteps = []
        for (let i = 0; i < topBranchesAmount; i++){
            let topBranchesStepsAmount = Math.floor(getRandomNumber(2,4))
            let newTopBranches = []
            for (let j = 0; j < topBranchesStepsAmount; j++){
                if (j < topBranchesStepsAmount - 1){
                    newTopBranches.push({
                        x: ((topBranchesTops[i].x - coreData[coreData.length - 1].vector.x) / topBranchesStepsAmount) * getRandomNumber(1.1, 1.3),
                        y: ((topBranchesTops[i].y - coreData[coreData.length - 1].vector.y) / topBranchesStepsAmount),
                        z: ((topBranchesTops[i].z - coreData[coreData.length - 1].vector.z) / topBranchesStepsAmount) * getRandomNumber(1.1, 1.3),
                        width: j === 0 ? -60 : getRandomNumber(-5,5)
                    })
                } else {
                    newTopBranches.push({
                        x: ((topBranchesTops[i].x - coreData[coreData.length - 1].vector.x) / topBranchesStepsAmount) * getRandomNumber(0.7, 1),
                        y: ((topBranchesTops[i].y - coreData[coreData.length - 1].vector.y) / topBranchesStepsAmount),
                        z: ((topBranchesTops[i].z - coreData[coreData.length - 1].vector.z) / topBranchesStepsAmount) * getRandomNumber(0.7, 1),
                        width: j === 0 ? -60 : getRandomNumber(-5,5)
                    })
                }

            }
            newTopBranchesSteps.push(newTopBranches)
        }
        setTopBranchesSteps(newTopBranchesSteps)
    }

    const generateTopBranches = (scene, material) => {
        let newBranchData = []
        for (let i = 0; i < topBranchesAmount; i++){
            newBranchData.push(generateBranchData(coreData[coreData.length - 1].vector, coreData[coreData.length - 1].width, topBranchesSteps[i]))
            generateBranch(newBranchData[i], scene, material)
        }
        setTopBranchData(newBranchData)
    }

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
        edge.geometry.applyMatrix4( edge.matrix )
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
        posVector.y += 0.5
        const topGeometry = new TetrahedronGeometry(1, 5)
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
        topMesh.scale.set(
            top.x,
            top.y,
            top.z
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

    const generateTopPosition = (topBranches) => {
        let topPositions = []
        topBranches.forEach(branch => {
            topPositions.push(branch[branch.length - 1].vector)
        })
        let avgX = 0, avgY = 0, avgZ = 0
        topPositions.forEach(position => {
            avgX += position.x; avgY += position.y; avgZ += position.z
        })
        avgX /= topPositions.length; avgY /= topPositions.length; avgZ /= topPositions.length
        return new Vector3(avgX, avgY, avgZ)
    }

    const generateModel = () => {
        const scene = new Scene()

        //camera
        const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set( 0, 20, 20 )

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


        setCoreData(generateBranchData(new Vector3(0,0,0), trunkStartWidth, coreSteps))
        generateBranch(coreData, scene, woodMaterial)


        if (generation > 9) {
            generateTopBranches(scene, topMaterial)
        }

        if (generation > 10){
            generateTop(generateTopPosition(topBranchesData), topMaterial, scene)
        }

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
    }


    useEffect(() => {
        growTree()
    }, [])

    return (
        <React.Fragment>
            <button onClick={() => growTree()}> Progress </button>
            <div ref={container}/>
        </React.Fragment>
    )
}

export default App
