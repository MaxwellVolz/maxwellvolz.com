import { useState, useTransition, useRef } from 'react';
import { useControls } from 'leva';
import { Canvas, useLoader } from '@react-three/fiber';
import { useGLTF, AccumulativeShadows, RandomizedLight, Center, Environment, OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import HutModel from './components/Hut';

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
      <group position={[0, -0.65, 0]}>
        <Sphere />
        <Hut />
        <AccumulativeShadows temporal frames={200} color="purple" colorBlend={0.5} opacity={1} scale={10} alphaTest={0.85}>
          <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <Env />
      <OrbitControls autoRotate autoRotateSpeed={4} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.1} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  )
}

function Sphere() {
  const { roughness } = useControls({ roughness: { value: 1, min: 0, max: 1 } })
  return (
    <Center top>
      <mesh castShadow>
        <sphereGeometry args={[0.75, 64, 64]} />
        <meshStandardMaterial metalness={1} roughness={roughness} />
      </mesh>
    </Center>
  )
}

function Hut() {
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
    <group dispose={null}>
      <group scale={0.03}>
        <mesh geometry={nodes.group_0.geometry} material={materials.Stone_Flagstone_Ashlar} position={[-60, 0, 60]} />
        <mesh geometry={nodes.group_1.geometry} material={materials.Wood_Veneer_02} position={[54, 0, -54]} />
        <mesh geometry={nodes.group_2.geometry} material={materials.Stone_Marble} position={[-54, 0, -42]} />
        <mesh geometry={nodes.group_3.geometry} position={[-53.5, 24, -42]}>
          <meshStandardMaterial map={colorMap} />

          {/* <Effects /> */}

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

function Env() {
  const [preset, setPreset] = useState('sunset')
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  const [inTransition, startTransition] = useTransition()
  const { blur } = useControls({
    blur: { value: 0.65, min: 0, max: 1 },
    preset: {
      value: preset,
      options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'],
      // If onChange is present the value will not be reactive, see https://github.com/pmndrs/leva/blob/main/docs/advanced/controlled-inputs.md#onchange
      // Instead we transition the preset value, which will prevents the suspense bound from triggering its fallback
      // That way we can hang onto the current environment until the new one has finished loading ...
      onChange: (value) => startTransition(() => setPreset(value))
    }
  })
  return <Environment preset={preset} background blur={blur} />
}
