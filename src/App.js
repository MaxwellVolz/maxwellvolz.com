import { useState, useTransition, useRef } from 'react';
import { useControls } from 'leva';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three'
import {
  AccumulativeShadows,
  RandomizedLight,
  Center,
  Environment,
  OrbitControls,
  SpotLight,
  useDepthBuffer
} from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import HutModel from './components/Hut';

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
      <group position={[0, -0.65, 0]}>
        <Sphere />
        <Hut />
        <AccumulativeShadows temporal frames={200} color="purple" colorBlend={0.5} opacity={1} scale={30} alphaTest={0.85}>
          <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <fog attach="fog" args={['#202020', 5, 20]} />
      <ambientLight intensity={0.015} />
      <Env />
      <OrbitControls autoRotate={false} autoRotateSpeed={1} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.1} maxPolarAngle={Math.PI / 2.1} />

      <DopeLights />

      {/* <mesh position={[0, -1.03, 0]} castShadow receiveShadow geometry={nodes.dragon.geometry} material={materials['Default OBJ.001']} dispose={null} /> */}
      {/* <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh> */}

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

function DopeLights() {
  const depthBuffer = useDepthBuffer({ frames: 1 })
  return (
    <mesh>
      <MovingSpot depthBuffer={depthBuffer} color="#0c8cbf" position={[1.8, 1.8, -1]} />
      <MovingSpot depthBuffer={depthBuffer} color="#b00c3f" position={[1.7, 1.8, -1.1]} />
    </mesh>
  )
}

function Hut() {
  return < HutModel />
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

function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)
  useFrame((state) => {
    light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
    light.current.target.updateMatrixWorld()
  })
  return <SpotLight castShadow ref={light} penumbra={1} distance={6} angle={0.35} attenuation={5} anglePower={4} intensity={2} {...props} />
}
