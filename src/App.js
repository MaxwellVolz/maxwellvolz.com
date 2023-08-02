import { useState, useEffect, useTransition, useRef, useMemo, Suspense } from 'react';
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
  Bounds, useBounds, ContactShadows, BakeShadows

} from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper'
import * as THREE from 'three'

// Material Base
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Material Components
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Material Icons
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import InfoIcon from '@mui/icons-material/Info';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SwipeIcon from '@mui/icons-material/Swipe';
import TouchAppIcon from '@mui/icons-material/TouchApp';

// Models
import Maxtower_base from './components/Maxtower_base';
import Maxtower_01 from './components/Maxtower_01';
import Maxtower_02 from './components/Maxtower_02';
import Maxtower_03 from './components/Maxtower_03';

import Maxtower_01_interactive from './components/Maxtower_01_interactive';

import LogoJS from './components/logo_js';
import LogoPY from './components/logo_py';
import LogoGithub from './components/logo_github';
import Snowboard from './components/snowboard';

import RayBans from './components/Raybans'
import Drone from './components/Drone'
import Terragraph from './components/terragraph'


import { Water } from 'three-stdlib'

extend({ Water })

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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

  const cameraPositions = {
    1: { position: new THREE.Vector3(0.01, 15, 2), target: new THREE.Vector3(-2, 7, -2) },
    2: { position: new THREE.Vector3(6.5, 8, 1.5), target: new THREE.Vector3(0.9, 4, -2) },
    3: { position: new THREE.Vector3(6, 3, 9), target: new THREE.Vector3(0, 1, -1) },
    default: { position: new THREE.Vector3(8, 8, 12), target: new THREE.Vector3(0, 4, 0) }
  };

  return useFrame(() => {
    // camera.position.lerp(vec.set(mouse.x, mouse.y, camera.position.z), 0.05)
    // console.log(camera_focus)

    const { position, target } = cameraPositions[camera_focus.camera_focus] || cameraPositions.default;
    camera.lookAt(target);
    camera.position.lerp(position, 0.005);
  })
}


export default function App() {

  // const { group_x } = useControls({ group_x: { value: 0, min: -20, max: 20 } });

  const [camera_focus, setFocus] = useState("0");

  const [value, setValue] = useState(0);

  const [open, setOpen] = useState(true);
  const [openGithub, setGithubOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenGithub = () => {
    setGithubOpen(true);
  };

  const handleCloseGithub = () => {
    setGithubOpen(false);
  };

  const handleCloseGithubLink = () => {
    setGithubOpen(false);

    window.open("https://github.com/MaxwellVolz")
  }


  return (
    // <Canvas shadows flat dpr={[1, 2]} camera={{ fov: 35, position: [0, 10, 30] }}>
    <div className='full_vh'>


      <Canvas shadows flat dpr={[1, 2]}>
        {/* <Camera fov={35} position={camera_position} /> */}

        <group position={[0, 0.0, 0]}>

          <Ocean />
        </group>
        <OrbitControls autoRotate={false} enableZoom={true} makeDefault minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} />

        {/* <pointLight position={[-100, -100, -100]} intensity={.2} /> */}

        <color attach="background" args={['black']} onClick={() => setFocus(4)} />
        <group position={[0, 0, 0]}>
          {/* 
        <ScrollControls pages={2}>
          <ControlTheScroll />
        </ScrollControls> */}
          {/* <Rig camera_focus={camera_focus} /> */}

          <Suspense fallback={null}>
            <Bounds fit clip observe damping={6} margin={1.2}>
              <SelectToZoom>
                <Maxtower_base />
                <Maxtower_01 />
                <Drone />

              </SelectToZoom>
              <Maxtower_02 />
              <Maxtower_03 />

            </Bounds>
            <ContactShadows rotation-x={Math.PI / 2} position={[0, -35, 0]} opacity={0.2} width={200} height={200} blur={1} far={50} />
          </Suspense>

          <Maxtower_01_interactive />
          <BakeShadows />

          {/* <Snowboard /> */}

          <RayBans />
          <Terragraph />

          {/* <LogoJS position={[3.2, 4.7, -3]} /> */}
          {/* <LogoPY position={[1.3, 4.7, -3]} /> */}

          <LogoGithub position={[0, 0, 0]} />

          {/* Temp Tower Stuff */}
          <pointLight position={[5, 10, 5]} intensity={.1} />
          {/* <pointLight position={[3, 20, -2]} intensity={.8} /> */}


        </group>

        {/* <CrazyLight /> */}

        {/* <ReflectiveGround /> */}

      </Canvas>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className='ui_layer'>
          {/* <Button variant="contained">Hello World</Button> */}

          <div className='dialog'>
            <Dialog
              open={openGithub}
              onClose={handleCloseGithub}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Open link to GitHub?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">

                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseGithub}>Maybe Later</Button>
                <Button onClick={handleCloseGithubLink} autoFocus >Ok</Button>
              </DialogActions>
            </Dialog>
          </div>

          <div className='dialog'>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Welcome :)"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Use <SwipeIcon /> to orbit and <TouchAppIcon /> to focus on objects in the scene. Hope you like the site.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>Ok</Button>
              </DialogActions>
            </Dialog>
          </div>

          {/* Bottom Nav */}
          {/* <Box className={'bottom_nav'}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction label="Zoom Out" icon={<TravelExploreIcon />} onClick={() => setFocus(4)} />

              <BottomNavigationAction label="About" icon={<InfoIcon />} onClick={() => setFocus(1)} />
              <BottomNavigationAction label="Work" icon={<HomeRepairServiceIcon />} onClick={() => setFocus(2)} />
              <BottomNavigationAction label="Projects" icon={<EmojiObjectsIcon />} onClick={() => setFocus(3)} />
            </BottomNavigation>
          </Box> */}
        </div>
      </ThemeProvider>
    </div>

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

// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
function SelectToZoom({ children }) {
  const api = useBounds()
  return (
    <group onClick={(e) => (e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit())} onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}>
      {children}
    </group>
  )
}
