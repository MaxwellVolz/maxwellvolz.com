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

import LogoJS from './components/logo_js';
import LogoPY from './components/logo_py';
import LogoGithub from './components/logo_github';

import RayBans from './components/Raybans'
import Drone from './components/Drone'
import Tower from './components/tower'


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

export default function App() {

  const [camera_focus, setFocus] = useState("0");

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

        <group position={[0, 0.0, 0]}>

          <Ocean />
        </group>
        <OrbitControls autoRotate={false} enableZoom={true} makeDefault minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} />

        <color attach="background" args={['black']} onClick={() => setFocus(4)} />
        <group position={[0, 0, 0]}>

          <Tower />

          <BakeShadows />

          <Drone />
          <RayBans />
          <LogoGithub position={[-5, 0, 1]} scale={10} />
          <LogoJS position={[-2, 5, 7]} />
          <LogoPY position={[-13, 5, 15]} />

          {/* Temp Tower Stuff */}
          {/* <pointLight position={[5, 10, 5]} intensity={.1} /> */}
          {/* <pointLight position={[3, 20, -2]} intensity={.8} /> */}


        </group>


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
