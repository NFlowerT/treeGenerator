import {useEffect, useRef, useState} from 'react'
import {Group, PerspectiveCamera, Scene, Vector3} from "three"
import {decoder} from "./decoder"
import {generateTrunk} from "./trunk"
import {generateTop} from "./treeTops"
import {createIsland} from "./island"
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler"
import {getRandomFloat} from "./globalFunctions"
import {rock} from "./rock"
import {generateModel} from "./generateModel"

const NTree = ({dnaArray, rockAmount, islandSize}) => {
	const [scene, setScene] = useState(new Scene())
	const [camera, setCamera] = useState(new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000))
	const container = useRef(null)

	const growTree = (start, dna, age) => {
		const {trunkData, topData, scale} = decoder(dna, age)
		const {trunkMesh, trunkTop} = generateTrunk(scene, trunkData)
		const topMesh = topData && generateTop(trunkTop, scene, topData)
		const group = new Group()
		group.add(trunkMesh)
		topData && group.add(topMesh)
		group.position.set(start.x, start.y, start.z)
		group.scale.set(scale,scale,scale)
		return {mesh: group, width: topData.data[0].bottomRadius}
	}

	useEffect(() => {
		const islandMesh = createIsland(scene, islandSize)
		const group = new Group()
		group.add(islandMesh)
		islandMesh.translateY(-4)


		const sampler = new MeshSurfaceSampler(islandMesh).build()
		const tempPosition = new Vector3()
		const meshPositions = []

		let treeCounter = 0
		while (treeCounter <= dnaArray.length - 1){
			sampler.sample(tempPosition)
			if(new Vector3(0,0,0).distanceTo(tempPosition) < (islandSize - 1)){
				const {mesh, width} = growTree(
					tempPosition,
					dnaArray[treeCounter],
					getRandomFloat(11, 20)
				)
				mesh.translateY(-3)
				let check = true
				meshPositions.forEach(item => {
					if (item.position.distanceTo(mesh.position) < item.width + 1.5)
						check = false
				})
				if (check){
					group.add(mesh)
					meshPositions.push({position: mesh.position, width: width})
					treeCounter++
				}
			}
		}

		let rockCounter = 0
		while (rockCounter <= rockAmount){
			sampler.sample(tempPosition)
			let mesh = rock(tempPosition)
			if (tempPosition.y > -3 && new Vector3(0,0,0).distanceTo(tempPosition) < (islandSize - 1)){
				mesh.position.set(tempPosition.x, tempPosition.y - 3, tempPosition.z);
				let check = true
				meshPositions.forEach(item => {
					if (item.position.distanceTo(mesh.position) < 1)
						check = false
				})
				if (check){
					group.add(mesh)
					meshPositions.push({position: mesh.position, width: 1})
					rockCounter++
				}
			}
		}

		scene.add(group)
		generateModel(scene, setScene, container, camera, setCamera, group)
	}, [])

	return (
		<div ref={container}/>
	)
}

export default NTree
