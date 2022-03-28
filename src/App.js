import logo from './logo.svg';
import './App.css';

// ThreeJS dependencies
import { Canvas, useFrame } from '@react-three/fiber'

import { Suspense } from 'react'
import { Environment, OrbitControls } from "@react-three/drei";

// Components
import Box from './components/Box';
import Model from './components/Airpods';
import Sleeves from './components/Sleeves';


function App() {
  return (
    <div className="App">
      <Canvas camera={{ fov: 70, position: [0, 0, 8] }}>
        {/* <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <Model position={[0, 0, 0]} /> */}


        <Suspense fallback={null}>
          <Model />
          <Sleeves />
          <OrbitControls />
          <Environment preset="forest" background />
        </Suspense>
      </Canvas>
      
    </div>
  );
}

export default App;
