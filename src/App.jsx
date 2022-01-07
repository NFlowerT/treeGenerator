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
    MeshNormalMaterial,
} from 'three'
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import {useEffect} from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {Mesh} from "three"
var Simplex = require('perlin-simplex')
var simplex = new Simplex()

const App = () => {
    const cylinderMesh = (pointX, pointY, material, shrink, coreWidth) => {
        const direction = new Vector3().subVectors(pointY, pointX)
        const orientation = new Matrix4()
        orientation.lookAt(pointX, pointY, new Object3D().up)
        orientation.multiply(new Matrix4().set(1, 0, 0, 0,
            0, 0, 1, 0,
            0, -1, 0, 0,
            0, 0, 0, 1))
        const edgeGeometry = new CylinderGeometry(coreWidth - shrink, coreWidth, direction.length(), 8, 1, false)
        const edge = new THREE.Mesh(edgeGeometry, material)
        edge.applyMatrix4(orientation)
        edge.position.x = (pointY.x + pointX.x) / 2
        edge.position.y = (pointY.y + pointX.y) / 2
        edge.position.z = (pointY.z + pointX.z) / 2
        edge.updateMatrixWorld();
        edge.updateMatrix();
        edge.geometry.applyMatrix( edge.matrix );
        edge.position.set( 0, 0, 0 );
        edge.rotation.set( 0, 0, 0 );
        edge.scale.set( 1, 1, 1 );
        return edge
    }

    const generateBranch = (vectors, coreWidth, shrink, scene, material) => {
        let previousCylinder = null
        for (let i = 0; i < vectors.length - 1; i++){
            const cylinder = cylinderMesh(vectors[i], vectors[i + 1], material, shrink, coreWidth)
            scene.add(cylinder)
            coreWidth -= shrink
            if (previousCylinder !== null) {
                console.log(previousCylinder)
                let currentVertices = getBottomVertices(cylinder)
                let previousVertices = getTopVertices(previousCylinder)
                let allVertices = [...currentVertices, ...previousVertices]
                console.log("All vertices",allVertices)
                // currentVertices.forEach(verticle => {
                //     let sphere = new Mesh(new SphereGeometry(1), new MeshNormalMaterial())
                //     sphere.position.set(verticle.x, verticle.y, verticle.z)
                //     scene.add(sphere)
                // })
                const geometry = new ConvexGeometry( allVertices )
                const mesh = new THREE.Mesh( geometry, material )
                scene.add( mesh )
            }
            previousCylinder = cylinder
        }
    }

    const generateTop = (posVector, material, scene, yScale, radius) => {
        const topGeometry = new TetrahedronGeometry(radius, 5)
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
            xz,
            Math.floor(Math.random() * (4 - 3)) + 3,
            xz
        )
        scene.add(topMesh)
    }

    const getTopVertices = (cylinder) => {
        let bottomVertices = []
        let vertices = cylinder.geometry.attributes.position.array
        for (let i = 3; i < 24; i += 3){
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
        const renderer = new WebGLRenderer()
        renderer.setSize( window.innerWidth, window.innerHeight )
        document.body.innerHTML = ""
        document.body.appendChild( renderer.domElement )

        //materials
        const woodMaterial = new MeshPhysicalMaterial({color: "#8f6246", flatShading: true})
        const topMaterial = new MeshPhysicalMaterial({color: "#91b341", flatShading: true})

        //generating shapes
        const corePoints = [
            new Vector3( 0, 0, 0 ),
            new Vector3( 0, 6, 0 ),
            new Vector3( 1, 15, 0 ),
            new Vector3( -0.5, 20, 0 ),
            new Vector3( -0.5, 27, 0 )
        ]

            //core
            generateBranch(corePoints, 2, 0.4, scene, woodMaterial)

            //branches
            const branch1Points = [corePoints[1], new Vector3( corePoints[1].x - 3, corePoints[1].y + 1, corePoints[1].z + 2 )]
            generateBranch(branch1Points, 1, 0, scene, woodMaterial)

            const branch2Points = [corePoints[2], new Vector3( corePoints[2].x + 4, corePoints[2].y + 1, corePoints[2].z - 1 ) , new Vector3( corePoints[2].x + 8, corePoints[2].y + 5, corePoints[2].z )]
            generateBranch(branch2Points, 1, 0.5, scene, woodMaterial)

            const branch3Points = [corePoints[3], new Vector3( corePoints[3].x - 8, corePoints[3].y + 2, corePoints[3].z )]
            generateBranch(branch3Points, 0.8, 0.5, scene, woodMaterial)

            const branch4Start = new Vector3(
                corePoints[2].x + (corePoints[3].x - corePoints[2].x) / 2,
                corePoints[2].y +(corePoints[3].y - corePoints[2].y) / 2,
                corePoints[2].z +(corePoints[3].z - corePoints[2].z) / 2
            )
            const branch4Points = [
                branch4Start,
                new Vector3(branch4Start.x, branch4Start.y + 2, branch4Start.z - 4),
                new Vector3(branch4Start.x + 2, branch4Start.y + 5, branch4Start.z - 5.5)
            ]
            generateBranch(branch4Points, 0.8, 0.2, scene, woodMaterial)

            //tree tops
            let top1 = generateTop(corePoints[corePoints.length - 1], topMaterial, scene, 0.65, 6)
            generateTop(branch2Points[branch2Points.length - 1], topMaterial, scene, 0.7, 4)
            generateTop(branch3Points[branch3Points.length - 1], topMaterial, scene, 0.65, 4)
            generateTop(branch4Points[branch4Points.length - 1], topMaterial, scene, 0.8, 3)




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
    }, [])
    return (
        <div/>
    )
}

export default App
