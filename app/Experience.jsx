"use client";

import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import {Level, } from "./Level";
import { Physics } from "@react-three/rapier";
import Player from "./Player";




function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}

export default Experience;
