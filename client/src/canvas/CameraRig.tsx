import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import * as THREE from 'three';
import state from '../store';

const CameraRig = ({ children }: { children: ReactNode }) => {
  const group = useRef<THREE.Group | null>(null);
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    const isBreackpoint = window.innerHeight <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set initial position
    let targetPosition: [number, number, number] = [-0.4, 0, 2];

    if (snap.intro) {
      if (isBreackpoint) targetPosition = [0, 0, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2];
    }

    // set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // model rotation
    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 2, -state.pointer.x / 2, 0],
        0.25,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
