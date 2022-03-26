import logo from './logo.svg';
import './App.css';

// ThreeJS dependencies
import { Canvas, useFrame } from '@react-three/fiber'

// Components
import Box from './Box';


function App() {
  return (
    <div className="App">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
