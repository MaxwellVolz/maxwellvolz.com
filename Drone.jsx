/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.10 .\\models\\02-assets\\drone.glb 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/drone.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.749, 0, 0.75]} scale={0.025}>
        <mesh geometry={nodes.instance_0.geometry} material={materials['Material.001']} position={[28.262, 67.724, -211.239]} />
        <mesh geometry={nodes.instance_0001.geometry} material={materials.Color_001} position={[28.429, 47.469, -54.323]} />
        <mesh geometry={nodes.instance_0002.geometry} material={materials['Material.001']} position={[31.008, 86.456, -28.153]} />
        <mesh geometry={nodes.instance_0003.geometry} material={materials.Color_001} position={[90.499, 10.86, -46.876]} />
        <mesh geometry={nodes.instance_0004.geometry} material={materials.edge_color000255} position={[-33.927, 11.194, -46.796]} />
        <mesh geometry={nodes.instance_0005.geometry} material={materials.edge_color000255} position={[87.953, 11.194, -46.796]} />
        <mesh geometry={nodes.instance_0006.geometry} material={materials.edge_color000255} position={[29.204, 8.944, 29.954]} />
        <mesh geometry={nodes.instance_0007.geometry} material={materials.Color_001} position={[28.375, 104.383, -203.456]} />
        <mesh geometry={nodes.instance_0008.geometry} material={materials.Color_001} position={[29.032, 49.474, 76.922]} />
        <mesh geometry={nodes.instance_0009.geometry} material={materials.Color_001} position={[-31, 10.75, -46.957]} />
        <mesh geometry={nodes.instance_0010.geometry} material={materials.Color_001} position={[-36.25, 10.86, -46.876]} />
        <mesh geometry={nodes.instance_0011.geometry} material={materials.Color_001} position={[-11.845, 23.106, -49.748]} />
        <mesh geometry={nodes.instance_0012.geometry} material={materials.Color_001} position={[28.897, 15.635, 29.489]} />
        <mesh geometry={nodes.instance_0013.geometry} material={materials.Color_001} position={[91.325, 56.042, -5]} />
        <mesh geometry={nodes.instance_0014.geometry} material={materials.Color_001} position={[-33.425, 56.042, -5]} />
        <mesh geometry={nodes.instance_0015.geometry} material={materials.Color_001} position={[65.871, 23.106, -49.748]} />
        <mesh geometry={nodes.instance_0016.geometry} material={materials.Color_001} position={[85.929, 10.75, -46.957]} />
      </group>
    </group>
  )
}

useGLTF.preload('/drone.glb')
