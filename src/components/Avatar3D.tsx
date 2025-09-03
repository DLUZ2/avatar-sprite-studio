import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface Avatar3DProps {
  config: {
    bodyType: string;
    eyeStyle: string;
    mouthStyle: string;
    hairStyle: string;
    accessory: string;
    bodyColor: string;
    hairColor: string;
    accessoryColor: string;
  };
  isDark: boolean;
}

export function Avatar3D({ config, isDark }: Avatar3DProps) {
  const groupRef = useRef<any>();

  // Subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Body geometry based on type
  const getBodyGeometry = () => {
    switch (config.bodyType) {
      case "cube":
        return <boxGeometry args={[1.2, 1.5, 1]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.7, 0.8, 1.5, 16]} />;
      default: // sphere
        return <sphereGeometry args={[0.8, 32, 32]} />;
    }
  };

  // Eye positions based on body type
  const getEyePositions = () => {
    const baseZ = config.bodyType === "cylinder" ? 0.7 : 0.9;
    switch (config.eyeStyle) {
      case "large":
        return [
          [-0.25, 0.3, baseZ],
          [0.25, 0.3, baseZ]
        ];
      case "sleepy":
        return [
          [-0.3, 0.2, baseZ],
          [0.3, 0.2, baseZ]
        ];
      default: // dots
        return [
          [-0.2, 0.25, baseZ],
          [0.2, 0.25, baseZ]
        ];
    }
  };

  // Eye size based on style
  const getEyeSize = () => {
    switch (config.eyeStyle) {
      case "large":
        return 0.15;
      case "sleepy":
        return [0.2, 0.1, 0.05]; // ellipsoid for sleepy eyes
      default: // dots
        return 0.08;
    }
  };

  const renderEyes = () => {
    const positions = getEyePositions();
    const size = getEyeSize();
    
    return positions.map((pos, index) => (
      <mesh key={`eye-${index}`} position={pos as [number, number, number]}>
        {config.eyeStyle === "sleepy" ? (
          <sphereGeometry args={size as [number, number, number]} />
        ) : (
          <sphereGeometry args={[size as number, 16, 16]} />
        )}
        <meshStandardMaterial color="#000000" />
      </mesh>
    ));
  };

  // Mouth geometry based on style
  const renderMouth = () => {
    const baseZ = config.bodyType === "cylinder" ? 0.7 : 0.9;
    
    switch (config.mouthStyle) {
      case "excited":
        return (
          <mesh position={[0, -0.1, baseZ]}>
            <sphereGeometry args={[0.15, 16, 8, 0, Math.PI]} />
            <meshStandardMaterial color="#ff4444" />
          </mesh>
        );
      case "neutral":
        return (
          <mesh position={[0, -0.05, baseZ]}>
            <boxGeometry args={[0.2, 0.05, 0.05]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        );
      default: // smile
        return (
          <mesh position={[0, -0.05, baseZ]} rotation={[0, 0, Math.PI]}>
            <sphereGeometry args={[0.12, 16, 8, 0, Math.PI]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        );
    }
  };

  // Hair geometry based on style
  const renderHair = () => {
    if (config.hairStyle === "bald") return null;
    
    const hairColor = config.hairColor || "#8B4513";
    
    switch (config.hairStyle) {
      case "spiky":
        return (
          <group>
            <mesh position={[0, 0.9, 0]}>
              <coneGeometry args={[0.1, 0.4, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[-0.3, 0.8, 0]}>
              <coneGeometry args={[0.08, 0.3, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.3, 0.8, 0]}>
              <coneGeometry args={[0.08, 0.3, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        );
      case "curly":
        return (
          <group>
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[-0.2, 0.8, 0.2]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.2, 0.8, 0.2]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        );
      case "ponytail":
        return (
          <group>
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0, 0.5, -0.6]}>
              <cylinderGeometry args={[0.08, 0.12, 0.8, 16]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        );
      case "messy":
        return (
          <group>
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const x = Math.cos(angle) * 0.3;
              const z = Math.sin(angle) * 0.3;
              return (
                <mesh key={i} position={[x, 0.8 + Math.random() * 0.2, z]}>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color={hairColor} />
                </mesh>
              );
            })}
          </group>
        );
      default: // straight
        return (
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.4, 0.3, 0.3, 16]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        );
    }
  };

  // Accessory rendering
  const renderAccessory = () => {
    if (config.accessory === "none") return null;
    
    const accessoryColor = config.accessoryColor || "#333333";
    
    switch (config.accessory) {
      case "glasses":
        return (
          <group>
            <mesh position={[-0.25, 0.25, 0.85]}>
              <torusGeometry args={[0.12, 0.02, 8, 16]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
            <mesh position={[0.25, 0.25, 0.85]}>
              <torusGeometry args={[0.12, 0.02, 8, 16]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
            <mesh position={[0, 0.25, 0.85]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.01, 0.01, 0.15]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
          </group>
        );
      case "hat":
        return (
          <group position={[0, 1.1, 0]}>
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 0.3, 16]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
          </group>
        );
      case "bow":
        return (
          <group position={[0, 0.9, 0]}>
            <mesh position={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.05, 0.15, 0.05]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
          </group>
        );
      case "antenna":
        return (
          <group position={[0, 1.0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.4]} />
              <meshStandardMaterial color={accessoryColor} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#ffff00" />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        {getBodyGeometry()}
        <meshStandardMaterial color={config.bodyColor || "#00BFFF"} />
      </mesh>
      
      {/* Eyes */}
      {renderEyes()}
      
      {/* Mouth */}
      {renderMouth()}
      
      {/* Hair */}
      {renderHair()}
      
      {/* Accessory */}
      {renderAccessory()}
    </group>
  );
}