import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Partner, Category } from '../types';
import { cn } from '../lib/utils';
import { MapPin, Utensils, Moon, Bed, Heart, Star, Compass } from 'lucide-react';

// Dynamic coordinate computation based on partners list to fit on the 3D island
interface CoordinateSystem {
  centerLat: number;
  centerLng: number;
  scale: number;
}

const getCoordinateSystem = (partners: Partner[]): CoordinateSystem => {
  const lats = partners.map(p => p.latitude).filter(Boolean) as number[];
  const lngs = partners.map(p => p.longitude).filter(Boolean) as number[];

  if (lats.length === 0 || lngs.length === 0) {
    return { centerLat: -8.6478, centerLng: 115.1385, scale: 0.015 };
  }

  // Calculate midpoints
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

  // Find max distance in meters to size the island zoom dynamically
  let maxDist = 1;
  partners.forEach(p => {
    if (!p.latitude || !p.longitude) return;
    const dx = (p.longitude - centerLng) * 111000 * Math.cos(centerLat * Math.PI / 180);
    const dz = -(p.latitude - centerLat) * 111000;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > maxDist) maxDist = dist;
  });

  // We want the furthest partner to be around 14 units away from center (safely inside size 40 island)
  const scale = 14 / maxDist;

  return { centerLat, centerLng, scale };
};

// Helper to convert Lat/Lng to 3D positions (X, Z) relative to calculated center
const get3DCoords = (lat: number, lng: number, system: CoordinateSystem) => {
  const x = (lng - system.centerLng) * 111000 * Math.cos(system.centerLat * Math.PI / 180) * system.scale;
  const z = -(lat - system.centerLat) * 111000 * system.scale;
  return [x, 0, z] as [number, number, number];
};


// Hex colors mapping
const getCategoryHexColor = (catId: string) => {
  switch (catId) {
    case 'eat': return '#FFCA28'; // Yellow
    case 'nightlife': return '#42A5F5'; // Blue
    case 'stay': return '#EF5350'; // Red
    case 'wellness': return '#66BB6A'; // Green
    default: return '#AB47BC'; // Purple
  }
};

// 3D Cartoon Cloud component
function Cloud({ position, speed = 0.2 }: { position: [number, number, number]; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const offset = useRef(Math.random() * 100);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(state.clock.getElapsedTime() * speed + offset.current) * 3;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.8, -0.2, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.8, -0.2, -0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

// 3D Cartoon Tree component
function Tree({ position }: { position: [number, number, number] }) {
  const scaleY = useRef(0.8 + Math.random() * 0.5);
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.4 * scaleY.current, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.8 * scaleY.current, 5]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.9} flatShading />
      </mesh>
      {/* Leaves (Cone) */}
      <mesh position={[0, 1.1 * scaleY.current, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2 * scaleY.current, 5]} />
        <meshStandardMaterial color="#4CAF50" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// Cartoon 3D Building based on Category
function Building({ categoryId, color }: { categoryId: string; color: string }) {
  switch (categoryId) {
    case 'eat': // Cafe/Food truck style
      return (
        <group>
          {/* Main Wall */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1.2, 1, 1.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} flatShading />
          </mesh>
          {/* Roof (Flat styled / Red border) */}
          <mesh castShadow position={[0, 1.05, 0]}>
            <boxGeometry args={[1.4, 0.15, 1.4]} />
            <meshStandardMaterial color={color} roughness={0.5} flatShading />
          </mesh>
          {/* Awning */}
          <mesh castShadow position={[0, 0.7, 0.65]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[1.1, 0.1, 0.35]} />
            <meshStandardMaterial color="#FF7043" roughness={0.5} flatShading />
          </mesh>
        </group>
      );
    case 'nightlife': // Nightlife style (tall modern sleek bar)
      return (
        <group>
          {/* Main tower */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <boxGeometry args={[1, 1.6, 1]} />
            <meshStandardMaterial color="#37474F" roughness={0.3} flatShading />
          </mesh>
          {/* Glowing neon top block */}
          <mesh position={[0, 1.7, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} />
          </mesh>
        </group>
      );
    case 'stay': // Cozy villa / hotel style (gable roof)
      return (
        <group>
          {/* Main wall */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1.4, 1, 1.2]} />
            <meshStandardMaterial color="#EEEEEE" roughness={0.7} flatShading />
          </mesh>
          {/* Triangular Roof */}
          <mesh castShadow position={[0, 1.25, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[1.1, 0.6, 4]} rotation={[0, Math.PI / 4, 0]} />
            <meshStandardMaterial color={color} roughness={0.5} flatShading />
          </mesh>
        </group>
      );
    case 'wellness': // Zen round dome / pavilion
      return (
        <group>
          {/* Base */}
          <mesh castShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.65, 0.75, 0.8, 8]} />
            <meshStandardMaterial color="#ECEFF1" roughness={0.8} flatShading />
          </mesh>
          {/* Dome roof */}
          <mesh castShadow position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.6} flatShading />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      );
  }
}


// Bouncing Marker / Building wrapper
function PartnerBuilding3D({
  partner,
  isSelected,
  onClick,
  system
}: {
  partner: Partner;
  isSelected: boolean;
  onClick: () => void;
  system: CoordinateSystem;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const color = getCategoryHexColor(partner.categoryId);

  // Bobbing / floating animation
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      // Bounces faster and higher if hovered or selected
      const freq = isSelected ? 4 : hovered ? 3 : 1.5;
      const amp = isSelected ? 0.3 : hovered ? 0.15 : 0.06;
      ref.current.position.y = Math.sin(time * freq) * amp;
      ref.current.rotation.y = time * 0.1;
    }
  });

  const position = get3DCoords(partner.latitude || system.centerLat, partner.longitude || system.centerLng, system);

  // Category Icon component in HTML overlay
  const getIcon = () => {
    switch (partner.categoryId) {
      case 'eat': return <Utensils size={12} className="text-black" />;
      case 'nightlife': return <Moon size={12} className="text-black" />;
      case 'stay': return <Bed size={12} className="text-black" />;
      case 'wellness': return <Heart size={12} className="text-black" />;
      default: return <MapPin size={12} className="text-black" />;
    }
  };

  return (
    <group position={position}>
      {/* Bobbing building model */}
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <Building categoryId={partner.categoryId} color={color} />

        {/* Selected platform indicator */}
        {isSelected && (
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[1.1, 1.15, 0.05, 16]} />
            <meshBasicMaterial color="#FFEB3B" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Floating Category Emoji/Icon Pin */}
        <group position={[0, 1.8, 0]}>
          <Html distanceFactor={12} center>
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 border-black font-black text-xs shadow-md transition-all cursor-pointer",
                isSelected ? "bg-yellow-400 scale-125" : hovered ? "bg-white scale-110" : "bg-white/90"
              )}
              style={{ borderColor: color, borderWidth: '3px' }}
            >
              {getIcon()}
            </div>
          </Html>
        </group>
      </group>

      {/* Shadow Base circle on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={isSelected ? 0.3 : hovered ? 0.2 : 0.08} />
      </mesh>
    </group>
  );
}

// Floor island / terrain
function IslandBoard({ size = 40 }: { size?: number }) {
  return (
    <group>
      {/* Floating Island Grass Top */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#81C784" roughness={0.9} flatShading />
      </mesh>

      {/* Sandy border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
        <planeGeometry args={[size + 2, size + 2]} />
        <meshStandardMaterial color="#FFE082" roughness={0.9} flatShading />
      </mesh>

      {/* Soil depth */}
      <mesh position={[0, -0.7, 0]} receiveShadow castShadow>
        <boxGeometry args={[size + 2, 1.3, size + 2]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.9} flatShading />
      </mesh>

      {/* Winding path 1 - diagonal NW to SE */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 6]} position={[-3, 0.012, 2]}>
        <planeGeometry args={[1.8, size - 6]} />
        <meshBasicMaterial color="#E0E0E0" transparent opacity={0.65} />
      </mesh>
      {/* Winding path 2 - slightly tilted horizontal */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 10]} position={[2, 0.012, -4]}>
        <planeGeometry args={[size - 8, 1.8]} />
        <meshBasicMaterial color="#D6D6D6" transparent opacity={0.55} />
      </mesh>
      {/* Small connector path */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 3]} position={[5, 0.012, 5]}>
        <planeGeometry args={[1.4, 10]} />
        <meshBasicMaterial color="#E8E8E8" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

interface AdventureMapProps {
  partners: Partner[];
  selectedPartner: Partner | null;
  onSelectPartner: (partner: Partner) => void;
}

export default function AdventureMap({ partners, selectedPartner, onSelectPartner }: AdventureMapProps) {
  // Compute coordinate system dynamically based on partners in view
  const system = getCoordinateSystem(partners);

  // Random static points on the island to generate tree props
  const [treePositions] = useState<[number, number, number][]>(() => {
    const list: [number, number, number][] = [];
    // Generate scattered trees around the island board (avoiding exact center where coordinates cross)
    for (let i = 0; i < 35; i++) {
      const x = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 36;
      // Keep away from center roads
      if (Math.abs(x) > 2 && Math.abs(z) > 2) {
        list.push([x, 0, z]);
      }
    }
    return list;
  });

  return (
    <div className="w-full h-full relative bg-[#80DEEA]">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 18, 22], fov: 45 }}
        gl={{ antialias: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 20, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Cartoon Floating Clouds */}
        <Cloud position={[-8, 8, -6]} speed={0.15} />
        <Cloud position={[7, 9, 8]} speed={0.12} />
        <Cloud position={[-12, 7, 10]} speed={0.2} />
        <Cloud position={[10, 8, -12]} speed={0.1} />

        {/* Island Board Grid */}
        <IslandBoard size={40} />

        {/* Scattered Cartoon Trees */}
        {treePositions.map((pos, idx) => (
          <Tree key={idx} position={pos} />
        ))}

        {/* Dynamic Partner Buildings */}
        {partners.map((p) => (
          <PartnerBuilding3D
            key={p.id}
            partner={p}
            isSelected={selectedPartner?.id === p.id}
            onClick={() => onSelectPartner(p)}
            system={system}
          />
        ))}

        {/* Orbit Controls (constrained for clean overview experience) */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.3} // Keep from viewing underneath the floor
          minDistance={10}
          maxDistance={35}
        />
      </Canvas>

      {/* Floating Instructions/Compass */}
      <div className="absolute bottom-4 right-4 bg-white/95 border-3 border-black p-3 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black pointer-events-none flex flex-col items-center gap-1">
        <Compass size={24} className="text-black animate-spin-slow" />
        <span className="text-[10px] font-black uppercase tracking-wider">Drag to Orbit</span>
      </div>
      {/* Fantasy map label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white border-2 border-white/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest pointer-events-none flex items-center gap-1.5">
        <span>🗺️</span> Fantasy Island View · Switch to 2D Map for real streets
      </div>
    </div>
  );
}
