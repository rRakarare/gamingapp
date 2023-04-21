"use client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { KeyboardControls } from "@react-three/drei";

function Sceen() {
  return (
    <KeyboardControls map={[
      {name: "forward", keys: ["ArrowUp", "KeyW"]},
      {name: "backward", keys: ["ArrowDown", "KeyS"]},
      {name: "leftward", keys: ["ArrowLeft", "KeyA"]},
      {name: "rightward", keys: ["ArrowRight", "KeyD"]},
      {name: "jump", keys: ["Space"]},
    ]}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
      >
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default Sceen;
