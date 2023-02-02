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
  Lightformer,
  useDepthBuffer,
  MeshReflectorMaterial,
  PresentationControls
} from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper'

// import HutModel from './components/Hut';
// import HutModel from './components/Hut3';
// import HutModel from './components/Hut5';
// import HutModel from './components/Hut6';
import HutModel from './components/Hut8';

import LogoJS from './components/logo_js';
import LogoPY from './components/logo_py';


export default function App() {
  const { camera_position_x } = useControls({ camera_position_x: { value: 0, min: -20, max: 20 } })


  return (
    <Canvas shadows flat dpr={[1, 2]} camera={{ fov: 25, position: [0, 10, 30] }}>

      <ambientLight intensity={0.025} />

      <PresentationControls snap global zoom={0.8} position={[camera_position_x, 0, 0]} rotation={[0, -Math.PI / 4, 0]} polar={[0, Math.PI / 4]} azimuth={[-Math.PI / 4, Math.PI / 4]}>

        <color attach="background" args={['black']} />
        <group position={[0, 0, 0]}>
          <Sphere />
          <Hut />

          <group position={[1.4, 1.7, 1]} scale={1}>

            <group position={[0.2, .3, -1.7]} rotation={[0, -Math.PI / 2, 0]} scale={5}>
              <group>
                <LogoJS />

              </group>
            </group>
            <group position={[0, .3, .2]} rotation={[0, Math.PI / 2, 0]} scale={.4}>
              <LogoPY />

            </group>
          </group>

          {/* <AccumulativeShadows temporal frames={200} color="purple" colorBlend={0.5} opacity={1} scale={30} alphaTest={0.85}>
          <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
        </AccumulativeShadows> */}
        </group>
        {/* <fog attach="fog" args={['#202020', 5, 20]} /> */}




        {/* <Env /> */}

        {/* <OrbitControls autoRotate={false} autoRotateSpeed={1} enablePan={false} enableZoom={true} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1} /> */}

        {/* <DopeLights /> */}


        {/* Lights */}
        {/* <directionalLight position={[1, 5, 1]} color="red" />
      <directionalLight position={[1, 10, 1]} color="blue" /> */}


        <CrazyLight />
        {/* <Lightformer form="circle" intensity={10} position={[1, 2.5, 1]} /> */}


        {/* <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh> */}
        <ReflectiveGround />

      </PresentationControls>
    </Canvas>
  )
}

function CrazyLight() {
  const light = useRef()
  const light_target = useRef()
  let light_intensity = 0

  useFrame((state, delta) => {
    const t = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2
    // stripe.current.color.setRGB(1 + t * 10, 2, 20 + t * 50)
    // easing.dampE(head.current.rotation, [0, state.pointer.x * (state.camera.position.z > 1 ? 1 : -1), 0], 0.4, delta)
    light.current.intensity = 1 + t * 6
    light.current.distance = 5 + t * 1
    // light_intensity = 1 + t * 2
    // console.log(light.current.intensity)
  })

  return (
    <group>
      <mesh ref={light_target} position={[3.83, 1.7, -3.27]} />

      <SpotLight ref={light} penumbra={1} distance={5} angle={0.7} anglePower={4} intensity={1} position={[4.6, 20, -2.01]}>

      </SpotLight>

    </group>


  )
}

function ReflectiveGround() {
  const { roughness } = useControls({ roughness: { value: 1, min: 0, max: 1 } })
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 30]}
        resolution={2048}
        mixBlur={1}
        mixStrength={80}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#202020"
        metalness={0.8}
      />
    </mesh>
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

  const pos = useControls({
    x: { value: -1.6, min: -10, max: 10 },
    y: { value: 5.7, min: -10, max: 10 },
    z: { value: -1.3, min: -10, max: 10 }
  })

  return (
    <mesh>
      <MovingSpot depthBuffer={depthBuffer} color="#0c8cbf" position={[pos.x, pos.y, pos.z]} />
      <MovingSpot depthBuffer={depthBuffer} color="#b00c3f" position={[pos.x - .05, pos.y, pos.z - .05]} />
    </mesh>
  )
}

function Hut() {
  return < HutModel />
}

function Env() {
  const [preset, setPreset] = useState('park')
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
  return <SpotLight castShadow ref={light} penumbra={1} distance={6} angle={0.35} attenuation={5} anglePower={4} intensity={3} {...props} />
}
