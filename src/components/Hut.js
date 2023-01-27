/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\hut.glb
*/

import React, { useRef } from 'react'
import { Canvas, useLoader, extend } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import Effects from './Effects'

export default function Model(props) {
    const group = useRef();
    const { nodes, materials } = useGLTF("./hut.glb");

    // const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    //     'textures/PavingStones092_1K_Color.jpg',
    //     'textures/PavingStones092_1K_Displacement.jpg',
    //     'textures/PavingStones092_1K_Normal.jpg',
    //     'textures/PavingStones092_1K_Roughness.jpg',
    //     'textures/PavingStones092_1K_AmbientOcclusion.jpg',
    // ])
    const colorMap = useLoader(TextureLoader, 'textures/PavingStones092_1K_Color.jpg')

    // const composer = new THREE.EffectComposer(renderer);

    return (
        // <Canvas>
        <group {...props} dispose={null}>
            <group scale={0.03}>
                <mesh geometry={nodes.group_0.geometry} material={materials.Stone_Flagstone_Ashlar} position={[-60, 0, 60]} />
                <mesh geometry={nodes.group_1.geometry} material={materials.Wood_Veneer_02} position={[54, 0, -54]} />
                <mesh geometry={nodes.group_2.geometry} material={materials.Stone_Marble} position={[-54, 0, -42]} />
                <mesh geometry={nodes.group_3.geometry} position={[-53.5, 24, -42]}>
                    <meshStandardMaterial map={colorMap} />
                    {/* <meshStandardMaterial
                        map={colorMap}
                        displacementMap={displacementMap}
                        normalMap={normalMap}
                        roughnessMap={roughnessMap}
                        aoMap={aoMap}
                    /> */}
                    <Effects />

                </mesh>

                <mesh geometry={nodes.group_4.geometry} material={materials.Metal_Steel_Textured_White} position={[60, 90, 48]} />
                <mesh geometry={nodes.group_5.geometry} material={materials.Metal_Steel_Textured_White} position={[60, 90, 12]} />
                <mesh geometry={nodes.group_6.geometry} material={materials.Metal_Steel_Textured_White} position={[30, 6, 66]} />
                <group position={[49, 30, 65]}>
                    <mesh geometry={nodes.ID105.geometry} material={materials.Metal_Silver} />
                    <mesh geometry={nodes.ID105_1.geometry} material={materials.Metal_Silver_0} />
                </group>
                <group position={[49, 30, 65]}>
                    <mesh geometry={nodes.ID123.geometry} material={materials.Metal_Silver} />
                    <mesh geometry={nodes.ID123_1.geometry} material={materials.Metal_Silver_0} />
                </group>
                <mesh geometry={nodes.instance_0.geometry} material={materials['Chris_Shirt.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0001.geometry} material={materials['Chris_Shirt.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0002.geometry} material={materials['Chris_Shoe.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0003.geometry} material={materials['Chris_Shirt.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0004.geometry} material={materials['Chris_Skin.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0005.geometry} material={materials['Chris_Shoe_Sole.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0006.geometry} material={materials['Chris_Shoe_Sole.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0007.geometry} material={materials['Chris_Skin.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0008.geometry} material={materials['Chris_Hair.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0009.geometry} material={materials['Chris_Shoe_Sole.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0010.geometry} material={materials['Chris_Hair.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0011.geometry} material={materials['Chris_Skin.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0012.geometry} material={materials['Chris_Shoe.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0013.geometry} material={materials['Chris_Pants.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
                <mesh geometry={nodes.instance_0014.geometry} material={materials['Chris_Skin.001']} position={[-41.5, 0, 46]} rotation={[0, 1.22, 0]} />
            </group>
        </group>
        // </Canvas>
    );
}

useGLTF.preload('/hut.glb')
