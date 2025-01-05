import React from "react";
import { chakra, ChakraProps } from "@chakra-ui/react";

/**
 * Convert a hex color string (e.g., "#1e0522") to [r, g, b] values (0..1).
 */
function hexToRgbNormalized(hex: string): [number, number, number] {
  // Remove leading '#' if present
  const cleanHex = hex.replace(/^#/, "");

  // Parse 3-digit or 6-digit hex
  let r: number, g: number, b: number;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }

  // Normalize to 0..1
  return [r / 255, g / 255, b / 255];
}

interface MountainProps extends ChakraProps {
  seed?: number;              // Seed for random number generation
  startHeight?: number;       // Starting vertical offset of the mountain
  minMountainHeight?: number; // Minimum mountain height from “ground” level
  maxMountainHeight?: number; // Maximum mountain height
  topOffset?: number;         // Vertical offset from the top (formerly airGap)
  bottomOffset?: number;      // Vertical offset from the bottom
  maxOffsetHeight?: number;   // Maximum step for vertical changes
  width?: number;             // The total width of the mountain range
  minOffsetWidth?: number;    // Minimum horizontal step
  maxOffsetWidth?: number;    // Maximum horizontal step
  baseColour?: string;        // Shape color (both fill and stroke base)
  turbulenceOpacity?: number; // Allows controlling the opacity of fractal noise
}

const MountainSVG: React.FC<MountainProps> = ({
  seed = 1234,
  startHeight = 508,
  minMountainHeight = 56,
  maxMountainHeight = 512,
  topOffset,
  bottomOffset = 0,
  maxOffsetHeight = 64,
  width = 1920,
  minOffsetWidth = 32,
  maxOffsetWidth = 96,
  baseColour = "#1e0522",
  turbulenceOpacity = 0.5,
  ...props
}) => {
  // Use 20% of the maxMountainHeight as default if topOffset is not provided
  const effectiveTopOffset = topOffset ?? Math.floor(maxMountainHeight * 0.2);

  /**
   * Seeded random generator.
   * Reference: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
   */
  const seededRandom = (randomSeed: number) => {
    const mask = 0xffffffff;
    let m_w = (123456789 + randomSeed) & mask;
    let m_z = (987654321 - randomSeed) & mask;

    return () => {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;
      const result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      return result / 4294967296;
    };
  };

  /**
   * Helper function to compute a new Y offset from the currentY,
   * constrained by minMountainHeight, maxMountainHeight, and maxOffsetHeight.
   */
  const newYOffset = (currentY: number, randomFn: () => number) => {
    let maxAddY = maxMountainHeight - currentY;
    if (maxAddY > maxOffsetHeight) {
      maxAddY = maxOffsetHeight;
    }

    let maxSubY = currentY - minMountainHeight;
    if (maxSubY > maxOffsetHeight) {
      maxSubY = maxOffsetHeight;
    }

    return Math.floor(randomFn() * (maxAddY + maxSubY)) - maxSubY;
  };

  /**
   * Helper function to compute a new X offset,
   * constrained by minOffsetWidth, maxOffsetWidth.
   */
  const newXOffset = (randomFn: () => number) => {
    return (
      Math.floor(randomFn() * (maxOffsetWidth - minOffsetWidth)) +
      minOffsetWidth
    );
  };

  // Create RNG for left and right slopes
  const mainRandom = seededRandom(seed);
  const seededRandomLeft = seededRandom(Math.floor(mainRandom() * 10000));
  const seededRandomRight = seededRandom(Math.floor(mainRandom() * 10000));

  // Starting from the middle horizontally, with a vertical offset
  const midX = Math.floor(width / 2);
  let currentY = maxMountainHeight - startHeight; // This is how tall the mountain is from 'ground' level.

  // Build right side polygon
  // We shift each Y coordinate by effectiveTopOffset so the mountain doesn't start at the very top.
  let rightPoints = `${midX},${currentY + effectiveTopOffset}`;
  let tempX = midX + newXOffset(seededRandomRight);
  let tempY = currentY;

  while (tempX < width - minOffsetWidth) {
    tempY += newYOffset(tempY, seededRandomRight);
    rightPoints += ` ${tempX},${tempY + effectiveTopOffset}`;
    tempX += newXOffset(seededRandomRight);
  }

  // Finally close off the shape on the right side.
  tempY += newYOffset(tempY, seededRandomRight);
  rightPoints += ` ${width},${tempY + effectiveTopOffset} 
    ${width},${maxMountainHeight + effectiveTopOffset} 
    ${midX},${maxMountainHeight + effectiveTopOffset} 
    ${midX},${maxMountainHeight - startHeight + effectiveTopOffset}`;

  // Build left side polygon
  let leftPoints = `${midX},${currentY + effectiveTopOffset}`;
  tempX = midX - newXOffset(seededRandomLeft);
  tempY = currentY;

  while (tempX > minOffsetWidth) {
    tempY += newYOffset(tempY, seededRandomLeft);
    leftPoints += ` ${tempX},${tempY + effectiveTopOffset}`;
    tempX -= newXOffset(seededRandomLeft);
  }

  // Finally close off the shape on the left side.
  tempY += newYOffset(tempY, seededRandomLeft);
  leftPoints += ` 0,${tempY + effectiveTopOffset} 
    0,${maxMountainHeight + effectiveTopOffset} 
    ${midX},${maxMountainHeight + effectiveTopOffset} 
    ${midX},${maxMountainHeight - startHeight + effectiveTopOffset}`;

  // Convert baseColour hex to normalized r, g, b for filter use
  const [r, g, b] = hexToRgbNormalized(baseColour);

  /**
   * We'll define an SVG filter that:
   * 1. Generates fractal noise (feTurbulence).
   * 2. Tints it with feColorMatrix to incorporate the baseColour.
   * 3. Applies user-defined turbulenceOpacity for the alpha channel.
   * 4. Uses feComposite operator="in" to keep the noise only inside the mountain shape.
   * 5. Blends the original shape and noise with feBlend (mode="multiply" for a watercolor-like effect).
   * 6. Optionally applies a slight blur to soften if desired.
   */
  const watercolorFilterId = "watercolorFilter";

  // Total height of the SVG = topOffset + mountain + bottomOffset
  const totalHeight = maxMountainHeight + effectiveTopOffset + bottomOffset;

  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${totalHeight}`}
      width={width}
      height={totalHeight}
      {...props}
    >
      <defs>
        <filter
          id={watercolorFilterId}
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
        >
          {/* 1. Generate fractal noise */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
          />
          {/* 2 & 3. Tint with baseColour + apply turbulenceOpacity as alpha */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values={`
              0 0 0 0 ${r}
              0 0 0 0 ${g}
              0 0 0 0 ${b}
              0 0 0 ${turbulenceOpacity} 0
            `}
            result="coloredNoise"
          />
          {/* 
            4. Composite 'coloredNoise' with the shape (SourceGraphic),
               so the noise is shown only inside the mountains.
          */}
          <feComposite
            in="coloredNoise"
            in2="SourceGraphic"
            operator="in"
            result="insideNoise"
          />
          {/* 
            5. Blend the shape and noise together. 
               "SourceGraphic" is again the original shape, 
               "insideNoise" is the clipped noise. 
          */}
          <feBlend
            in="SourceGraphic"
            in2="insideNoise"
            mode="multiply"
            result="blended"
          />
          {/* 6. Optional: slight blur to soften the final result */}
          <feGaussianBlur in="blended" stdDeviation="1" result="finalBlur" />
        </filter>
      </defs>

      {/* 
        Notice we apply the filter to each polygon. 
        Because of the feComposite operator="in", 
        the turbulence is clipped to the shape itself. 
      */}
      <polygon
        points={leftPoints}
        fill={baseColour}
        stroke={baseColour}
        filter={`url(#${watercolorFilterId})`}
      />

      <polygon
        points={rightPoints}
        fill={baseColour}
        stroke={baseColour}
        filter={`url(#${watercolorFilterId})`}
      />
    </chakra.svg>
  );
};

export default MountainSVG;
