import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/airpods.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group
        position={[-2.35, -1.39, 0.34]}
        rotation={[-Math.PI, 1.29, -Math.PI]}
        scale={0.55}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube014.geometry}
          material={nodes.Cube014.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube014_1.geometry}
          material={nodes.Cube014_1.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube014_2.geometry}
          material={nodes.Cube014_2.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube014_3.geometry}
          material={nodes.Cube014_3.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube014_4.geometry}
          material={nodes.Cube014_4.material}
        />
      </group>
      <group
        position={[2.35, -1.39, 0.34]}
        rotation={[0, -1.08, 0]}
        scale={[-0.55, 0.55, 0.55]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017.geometry}
          material={nodes.Cube017.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017_1.geometry}
          material={nodes.Cube017_1.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017_2.geometry}
          material={nodes.Cube017_2.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017_3.geometry}
          material={nodes.Cube017_3.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube017_4.geometry}
          material={nodes.Cube017_4.material}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/airpods.glb");