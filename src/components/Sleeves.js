import React, { useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";

// Animation
import { useSpring, animated } from '@react-spring/three'

export default function Sleeves(props) {
    const group = useRef();
    const { nodes, materials } = useGLTF("/sleeves.glb");


    // Animation
    const [active, setActive] = useState(false);

    const { scale } = useSpring({ 
        scale: active ? 1.5 : 1
    });

    const { position } = useSpring({ 
        // position: active ?  (0,0,0): (-2.36, -1.46, 0.34)
        position: active ?  [0,0,0]: [0, -1, 0]
    });


    return (
        <animated.group position={position} onClick={() => setActive(!active)} ref={group} {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder.geometry}
                material={materials["Material.002"]}
                position={[-2.36, -1.46, 0.34]}
                scale={[0.39, 0.51, 0.39]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder001.geometry}
                material={materials["Material.004"]}
                position={[2.35, -1.46, 0.34]}
                scale={[0.39, 0.51, 0.39]}
            />
        </animated.group>
    );
}

useGLTF.preload("/sleeves.glb");