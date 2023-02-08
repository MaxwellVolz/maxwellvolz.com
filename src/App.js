import { useState, useEffect, useTransition, useRef, useMemo } from 'react';
import { useControls } from 'leva';
import { Canvas, useLoader, useFrame, useThree, extend } from '@react-three/fiber';
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
  ScrollControls,
  Sky,
  useScroll,
} from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper'
import * as THREE from 'three'

// import HutModel from './components/Hut';
// import HutModel from './components/Hut3';
// import HutModel from './components/Hut5';
// import HutModel from './components/Hut6';
// import HutModel from './components/Hut8';
// import Seabar from './components/Seabar';

import Maxtower_base from './components/Maxtower_base';
import Maxtower_01 from './components/Maxtower_01';
import Maxtower_02 from './components/Maxtower_02';
import Maxtower_03 from './components/Maxtower_03';

import LogoJS from './components/logo_js';
import LogoPY from './components/logo_py';


import Snowboard from './components/snowboard';


import { Water } from 'three-stdlib'


extend({ Water })


function Ocean() {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, '/textures/water_normal.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 2,
      fog: false,
      format: gl.encoding
    }),
    [waterNormals]
  )
  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta / 4))
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />
}


function Rig(camera_focus) {
  const { camera, mouse } = useThree()
  const vec = new Vector3()

  return useFrame(() => {
    // camera.position.lerp(vec.set(mouse.x, mouse.y, camera.position.z), 0.05)
    // console.log(camera_focus)

    if (camera_focus.camera_focus == 1) {
      camera.lookAt(-2, 9, -2)
      camera.position.lerp(vec.set(0.2, 18, 0.2), 0.01)
    }
    else if (camera_focus.camera_focus == 2) {
      camera.lookAt(1.5, 5, -2)
      camera.position.lerp(vec.set(7, 7, 4), 0.01)
    }
    else if (camera_focus.camera_focus == 3) {
      camera.lookAt(0, 5, -1)
      camera.position.lerp(vec.set(6, 1, 9), 0.01)
    }
    else {
      camera.lookAt(0, 6, 0)
      camera.position.lerp(vec.set(8, 8, 12), 0.05)

    }
  })
}


export default function App() {

  const { group_x } = useControls({ group_x: { value: 0, min: -20, max: 20 } });

  const [camera_focus, setFocus] = useState("0");

  return (
    // <Canvas shadows flat dpr={[1, 2]} camera={{ fov: 35, position: [0, 10, 30] }}>
    <Canvas shadows flat dpr={[1, 2]} >
      {/* <Camera fov={35} position={camera_position} /> */}
      <ambientLight intensity={0.125} />

      <group position={[0, 0.0, 0]}>

        <Ocean />
      </group>
      <OrbitControls autoRotate={false} autoRotateSpeed={0} enableZoom={true} makeDefault minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} />

      <pointLight position={[100, 100, 100]} intensity={.2} />
      <pointLight position={[-100, -100, -100]} intensity={.2} />

      <color attach="background" args={['black']} onClick={() => setFocus(4)} />
      <group position={[group_x, 0, 0]}>
        {/* 
        <ScrollControls pages={2}>
          <ControlTheScroll />
        </ScrollControls> */}
        <Rig camera_focus={camera_focus} />

        <group >
          <Maxtower_base />
        </group>

        <group onClick={() => setFocus(1)}>
          <Maxtower_01 />

        </group>
        <group onClick={() => setFocus(2)}>

          <Maxtower_02 />
        </group>
        <group onClick={() => setFocus(3)}>

          <Maxtower_03 />
        </group>

        <Snowboard />

        {/* Temp Tower Stuff */}
        <pointLight position={[5, 10, 5]} intensity={.8} />
        {/* <pointLight position={[3, 20, -2]} intensity={.8} /> */}


      </group>

      <CrazyLight />

      {/* <ReflectiveGround /> */}

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


function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)
  useFrame((state) => {
    light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
    light.current.target.updateMatrixWorld()
  })
  return <SpotLight castShadow ref={light} penumbra={1} distance={6} angle={0.35} attenuation={5} anglePower={4} intensity={3} {...props} />
}
