export const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min
}

export const updateVertices = (mesh) => {
    mesh.updateMatrix()
    mesh.geometry.applyMatrix4( mesh.matrix )
    mesh.position.set( 0, 0, 0 )
    mesh.rotation.set( 0, 0, 0 )
    mesh.scale.set( 1, 1, 1 )
    mesh.updateMatrix()
}
