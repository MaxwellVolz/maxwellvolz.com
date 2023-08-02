/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\hut.glb
*/
import { useRef, useState, Suspense } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { useGLTF, SpotLight, useVideoTexture, useTexture, useAspect } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { easing } from 'maath'
import { useSpring, animated, config } from '@react-spring/three'
import { Vector3, Color } from 'three'
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import Effects from './Effects'



export default function HutModel() {
    const { nodes, materials } = useGLTF('/maxtower_01_interactive.glb')

    const monitor_left = useRef();
    const monitor_center = useRef();
    const monitor_vertical = useRef();

    const monitor_left_phong = useRef();
    const monitor_center_phong = useRef();
    const monitor_vertical_phong = useRef();

    const [redActive, setRedActive] = useState(false);
    const [greenActive, setGreenActive] = useState(false);
    const [blueActive, setBlueActive] = useState(false);


    useFrame(({ clock }) => {
        const a = clock.getElapsedTime();

        let new_color = new Color(`rgb(
            ${redActive ? 255 : 0}, 
            ${greenActive ? 255 : 0}, 
            ${blueActive ? 255 : 0})`
        );

        monitor_left_phong.current.color = new_color;
        monitor_center_phong.current.color = new_color;
        monitor_vertical_phong.current.color = new_color;

        // garage door
        // if (!active && garage_door.current.position.y < 100) garage_door.current.position.y += decimals * .2;
        // if (active && garage_door.current.position.y > 0) garage_door.current.position.y -= 3;

    });

    const set_all_inactive = () => {
        setRedActive(false)
        setGreenActive(false)
        setBlueActive(false)
    }

    return (
        <group dispose={null}>


            <group scale={0.03}>
                <group position={[-16.64, 276.07, -19.74]} rotation={[0, 0, -2.99]} scale={1.66}>
                    <mesh geometry={nodes.group_7.geometry} material={materials['Chris_Shoe_Sole.001']} position={[0, 0.25, 0]} />
                    <group position={[0, 0.25, 0]}>
                        <mesh geometry={nodes.ID71.geometry} material={materials['Chris_Shoe_Sole.001']} />
                        <mesh geometry={nodes.ID71_1.geometry} material={materials['Color_M06.004']} />
                    </group>
                    <mesh geometry={nodes.group_7002.geometry} material={materials['Chris_Shoe_Sole.001']} position={[0, 0.25, 0]} />
                    <mesh geometry={nodes.group_7003.geometry} material={materials['Chris_Shoe_Sole.001']} position={[0, 0.25, 0]} />
                    <mesh geometry={nodes.group_7004.geometry} material={materials['Chris_Shoe_Sole.001']} position={[0, 0.25, 0]} />
                    <mesh geometry={nodes.group_7005.geometry} material={materials['Chris_Shoe_Sole.001']} position={[0, 0.25, 0]} />
                </group>
                <group position={[-30.11, 246.5, -7.76]}>
                    <group position={[6.1, 26.81, -11.98]}>
                        <mesh geometry={nodes.group_2.geometry} material={materials['Color_M07.001']} position={[1.97, 1.54, -19.27]} scale={1.66} onClick={set_all_inactive} />
                        <mesh geometry={nodes.group_4.geometry} material={materials['Color_A05.001']} position={[1.93, 1.54, -13.51]} scale={1.66} onClick={() => setRedActive(!redActive)} />
                        <mesh geometry={nodes.group_3.geometry} material={materials['Color_G06.001']} position={[1.93, 1.54, -7.83]} scale={1.66} onClick={() => setGreenActive(!greenActive)} />
                        <mesh geometry={nodes.group_5.geometry} material={materials['Color_I04.001']} position={[1.93, 1.54, -2.11]} scale={1.66} onClick={() => setBlueActive(!blueActive)} />
                    </group>
                </group>

                <mesh geometry={nodes.group_0002.geometry} material={materials['Color_M09.003']} position={[-30.11, 246.5, -7.76]} ref={monitor_left}>
                    <meshPhongMaterial ref={monitor_left_phong} />
                </mesh>
                <mesh geometry={nodes.group_0001.geometry} material={materials['Color_M09.003']} position={[-30.11, 246.5, -7.76]} ref={monitor_center}>
                    <meshPhongMaterial ref={monitor_center_phong} />
                </mesh>
                <mesh geometry={nodes.group_0.geometry} material={materials['Color_M09.003']} position={[-30.11, 246.5, -7.76]} ref={monitor_vertical}>
                    <meshPhongMaterial ref={monitor_vertical_phong} />
                </mesh>

            </group>
        </group>
    );
}
