import {OctahedronGeometry, Mesh, MeshPhysicalMaterial, Float32BufferAttribute} from "three"
import {convertVectorsToVertices, getRandomFloat, getVertices} from "./globalFunctions"
import {makeNoise3D} from "open-simplex-noise";
export const rock = () => {
	const mesh = new Mesh(new OctahedronGeometry(3,1), new MeshPhysicalMaterial({color: "#919191", flatShading: true}))
	const vertices = getVertices(mesh)
	const noise3D = makeNoise3D(Math.random() * 100)
	vertices.forEach(verticle => {
		const k = 1
		verticle.normalize().multiplyScalar(1 + 0.2 * noise3D(verticle.x * k, verticle.y * k, verticle.z * k))
	})
	const newVertices = convertVectorsToVertices(vertices)
	mesh.geometry.setAttribute('position', new Float32BufferAttribute(newVertices, 3))

	// mesh.position.set(point.x, point.y, point.z)
	mesh.scale.set(getRandomFloat(0.5,1),0.5,getRandomFloat(0.5,1))
	return mesh
}
