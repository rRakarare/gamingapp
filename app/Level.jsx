import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slatgrey" });

export const Blockstart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        receiveShadow
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
    </group>
  );
};

export const Blockend = ({ position = [0, 0, 0] }) => {
  const house = useGLTF("/house.glb");

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        receiveShadow
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        type="fixed"
        colliders="trimesh"
        restitution={0.2}
        friction={0}
      >
        <primitive object={house.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
};

export const Blockspinner = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();

  const [speed] = useState(
    () => (Math.random() + 0.5) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
};

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
};
const Bounds = ({ length = 1 }) => {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        castShadow
        position={[2.15, 0.75, -(length * 2) + 2]}
        material={wallMaterial}
        geometry={boxGeometry}
        scale={[0.3, 1.5, 4 * length]}
      />
      <mesh
        receiveShadow
        position={[-2.15, 0.75, -(length * 2) + 2]}
        material={wallMaterial}
        geometry={boxGeometry}
        scale={[0.3, 1.5, 4 * length]}
      />
      <mesh
        receiveShadow
        position={[0, 0.75, -(length * 4) + 2]}
        material={wallMaterial}
        geometry={boxGeometry}
        scale={[4, 1.5, 0.3]}
      />
      <CuboidCollider restitution={0.2} friction={1} args={[2,0.1,2*length]} position={[0,-0.1,-(length*2)+2]} />
    </RigidBody>
  );
};

export const BlockAxe = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
};

export function Level({
  count = 5,
  types = [Blockspinner, BlockAxe, BlockLimbo],
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types]);

  return (
    <>
      <Blockstart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <Blockend position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
}
