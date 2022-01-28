import {AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGL1Renderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

export const generateModel = (scene, setScene, container, camera, setCamera) => {
    setScene(new Scene())

    //camera
    setCamera(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
    camera.position.set( 20, 20, 20 )

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
