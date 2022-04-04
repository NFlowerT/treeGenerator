import {ConeGeometry, Mesh, MeshPhysicalMaterial, Float32BufferAttribute, Group} from "three"
import {convertVectorsToVertices, convertVerticesToVectors, getRandomFloat} from "./globalFunctions"

export const grass = () => {
	const geometry = new ConeGeometry( 0.05, 1, 3, 4)
	const material = new MeshPhysicalMaterial({color: "#5c7a3a", flatShading: true})
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
		matchingHeight.forEach(verticle => {
			vertices[vertices.indexOf(verticle)].x += getRandomFloat(-0.05, 0.05)
			vertices[vertices.indexOf(verticle)].z += getRandomFloat(-0.05, 0.05)
		})
	})

	let newVertices = convertVectorsToVertices(vertices)
	mesh.geometry.setAttribute('position', new Float32BufferAttribute(newVertices, 3))
	return mesh
}

export const grassPatch = (point) => {
	const offsets = [[1,1], [1,-1], [-1, 1], [-1, -1]]
	const group = new Group()
	for (let i = 0; i < 4; i++){
		let single = grass()
		group.add(single)
	}
	return group
}
