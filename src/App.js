import logo from './logo.svg';
import './App.css';

// ThreeJS dependencies
import { Canvas, useFrame } from '@react-three/fiber'

import { Suspense } from 'react'
import { Environment, OrbitControls, AccumulativeShadows, RandomizedLight } from "@react-three/drei";

// Components
import Box from './components/Box';
import Model from './components/Airpods';
import Sleeves from './components/Sleeves';
// import Base_01 from './components/Base_01';
import Hut from './components/Hut';
import Hut2 from './components/Hut2';


function App() {
  return (
    <div className="App">
      <Canvas shadows camera={{ fov: 50, position: [0, 10, 10], near: 0.1, far: 1000, }}>
        {/* <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <Model position={[0, 0, 0]} /> */}


        <Suspense fallback={null}>
          {/* <Model /> */}
          {/* <Sleeves /> */}
          {/* <Base_01 /> */}
          {/* <Hut /> */}
          <Hut2 />

          <group position={[0, -0.65, 0]}>
            <Sphere />
            <AccumulativeShadows temporal frames={200} color="purple" colorBlend={0.5} opacity={1} scale={10} alphaTest={0.85}>
              <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
            </AccumulativeShadows>
          </group>
          <OrbitControls />
          <Environment preset="forest" background />
        </Suspense>
      </Canvas>

    </div>
  );
}

export default App;
