import {ConeGeometry, Mesh, MeshPhysicalMaterial, Float32BufferAttribute} from "three"
import {convertVectorsToVertices, convertVerticesToVectors, getRandomFloat} from "./globalFunctions"

export const grass = () => {
	const geometry = new ConeGeometry( 0.1, 2, 3, 4)
	const material = new MeshPhysicalMaterial({color: "#5c7a3a", flatShading: false})
	const mesh = new Mesh( geometry, material )

	let vertices = convertVerticesToVectors(mesh.geometry.attributes.position.array)
	let heights = vertices.filter((value, index, self) =>
			index === self.findIndex((t) => (
				t.y === value.y
			))
	)

	heights = heights.map(height => height.y)

	heights.forEach(y => {
		let matchingHeight = vertices.filter(verticle => verticle.y === y)
		let x = getRandomFloat(0, 0.2)
		let z = getRandomFloat(0, 0.2)
		matchingHeight.forEach(verticle => {
			vertices[vertices.indexOf(verticle)].x += x
			vertices[vertices.indexOf(verticle)].z += z
		})
	})

	let newVertices = convertVectorsToVertices(vertices)
	mesh.geometry.setAttribute('position', new Float32BufferAttribute(newVertices, 3))
	return mesh
}
