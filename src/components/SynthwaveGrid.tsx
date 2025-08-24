import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'
import { Global, css } from '@emotion/react'

/**
 * SynthwaveGridBackground
 *
 * Drop-in CSS grid (wall + floor) that replaces the SVG/video.
 * - Keeps vertical lines aligned between wall and floor.
 * - Cell ratio is 3:4 (width:height) *in-plane* with NO tilt compensation.
 * - Floor overflows left/right and stays centered.
 *
 * Props (set via CSS vars on the wrapper):
 *  - floorWidth: CSS length (e.g. "180vw")
 *  - tilt: CSS angle for the floor plane (e.g. "75deg")
 */
export const SynthwaveGridBackground: FC<{
  floorWidth?: string
  tilt?: string
  showCover?: boolean
  zIndex?: number
}> = ({ floorWidth = '180vw', tilt = '75deg', showCover = false, zIndex = 0 }) => {
  return (
    <Box
      className="synthwave"
      position="absolute"
      inset={0}
      pointerEvents="none"
      zIndex={zIndex}
      /* Pass CSS variables down for easy tuning */
      style={{
        // wider than viewport so it overhangs on X
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--floor-width' as any]: floorWidth,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--floor-tilt' as any]: tilt
      }}
    >
      <Global
        styles={css`
          .synthwave {
            /* shared vars */
            --floor-rise: 22.35%; /* visual lift; tweak to taste */
            --grid-phase-x: 0px; /* shared X offset so wall & floor stay in phase */

            /* unified column spacing in screen space (try 3vmax..8vmax) */
            --grid-col-screen: 5vmax;

            /* wall transform & compensation so columns match floor on screen */
            --wall-scale: 1.6;
            /* perspective factor ~ p/(p+z), with p≈90vmax, z≈45vmax; tweak if you adjust those */
            --wall-persp: 0.666666667;
          }

          .synthwave, .synthwave * { box-sizing: border-box; }

          .scene {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            perspective: 90vmax; /* matches your page perspective */
          }

          /* static back wall that connects to the floor's far edge */
          .wall-grid {
            position: absolute;
            inset: 0;
            --grid-color: rgba(0, 0, 0, 0.2);
            --grid-weight: 3.15px;
            --grid-glow: 10px;
            --grid-glow-color: rgba(0, 0, 0, 0);

            /* 3:4 rectangles on the WALL (no tilt) */
            --grid-col: calc(var(--grid-col-screen) / (var(--wall-scale) * var(--wall-persp)));
            --grid-row: calc(var(--grid-col) * 4 / 3);

            background-position:
              calc(50% + var(--grid-phase-x)) 50%,
              calc(50% + var(--grid-phase-x)) 50%,
              calc(50% + var(--grid-phase-x)) 50%,
              calc(50% + var(--grid-phase-x)) 50%;
            background-image:
              repeating-linear-gradient(
                0deg,
                var(--grid-color),
                var(--grid-color) var(--grid-weight),
                transparent var(--grid-weight),
                transparent var(--grid-row)
              ),
              repeating-linear-gradient(
                0deg,
                var(--grid-glow-color),
                var(--grid-glow-color) var(--grid-weight),
                transparent calc(var(--grid-weight) + var(--grid-glow)),
                transparent calc(var(--grid-row) - var(--grid-glow)),
                var(--grid-glow-color) var(--grid-row)
              ),
              repeating-linear-gradient(
                -90deg,
                var(--grid-color),
                var(--grid-color) var(--grid-weight),
                transparent var(--grid-weight),
                transparent var(--grid-col)
              ),
              repeating-linear-gradient(
                -90deg,
                var(--grid-glow-color),
                var(--grid-glow-color) var(--grid-weight),
                transparent calc(var(--grid-weight) + var(--grid-glow)),
                transparent calc(var(--grid-col) - var(--grid-glow)),
                var(--grid-glow-color) var(--grid-col)
              );

            /* push the wall back in Z so it meets the floor's far edge */
            transform: translateZ(-45vmax) scale(var(--wall-scale));
            z-index: 0; /* behind the floor */
            animation: wall-move 20s linear infinite;
          }

          /* floor wrapper for screen-space rise (avoids breaking wall alignment) */
          .floor-wrap {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) translateY(var(--floor-rise)); /* 2D move only */
            transform-style: preserve-3d;
            z-index: 1;
            width: 100%;
            height: 100%;
          }

          /* moving floor */
          .floor-grid {
            --grid-color: rgba(0, 0, 0, 0.2);
            --grid-weight: 5px;
            --grid-glow: 10px;
            --grid-glow-color: rgba(0, 0, 0, 0);

            /* 3:4 rectangles on the FLOOR (NO tilt compensation) */
            --grid-col: var(--grid-col-screen);
            --grid-row: calc(var(--grid-col) * 4 / 3);

            background-color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            height: 100vmax;
            width: var(--floor-width); /* overflow on X but centered */
            transform: rotate3d(1, 0, 0, var(--floor-tilt));
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            will-change: transform;
          }

          .floor-grid::before {
            content: '';
            z-index: -1;
            position: absolute;
            top: 0;
            left: calc(var(--floor-width) / 2 - 50vw);
            height: 200%;
            width: 200vw;
            background-position:
              calc(50% + var(--grid-phase-x)) 50%,
              calc(50% + var(--grid-phase-x)) 50%,
              calc(50% + var(--grid-phase-x)) 50%,
              calc(50% + var(--grid-phase-x)) 50%;
            background-image:
              repeating-linear-gradient(
                0deg,
                var(--grid-color),
                var(--grid-color) var(--grid-weight),
                transparent var(--grid-weight),
                transparent var(--grid-row)
              ),
              repeating-linear-gradient(
                0deg,
                var(--grid-glow-color),
                var(--grid-glow-color) var(--grid-weight),
                transparent calc(var(--grid-weight) + var(--grid-glow)),
                transparent calc(var(--grid-row) - var(--grid-glow)),
                var(--grid-glow-color) var(--grid-row)
              ),
              repeating-linear-gradient(
                -90deg,
                var(--grid-color),
                var(--grid-color) var(--grid-weight),
                transparent var(--grid-weight),
                transparent var(--grid-col)
              ),
              repeating-linear-gradient(
                -90deg,
                var(--grid-glow-color),
                var(--grid-glow-color) var(--grid-weight),
                transparent calc(var(--grid-weight) + var(--grid-glow)),
                transparent calc(var(--grid-col) - var(--grid-glow)),
                var(--grid-glow-color) var(--grid-col)
              );
            animation: move 20s linear infinite;
          }

          .cover {
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: white;
            height: 70vh;
            width: 100vw;
            border-top: 5px solid black;
          }

          @keyframes wall-move {
            0% {
              background-position:
                calc(50% + var(--grid-phase-x)) -100vmax,
                calc(50% + var(--grid-phase-x)) -100vmax,
                calc(50% + var(--grid-phase-x)) -100vmax,
                calc(50% + var(--grid-phase-x)) -100vmax;
            }
            100% {
              background-position:
                calc(50% + var(--grid-phase-x)) 0,
                calc(50% + var(--grid-phase-x)) 0,
                calc(50% + var(--grid-phase-x)) 0,
                calc(50% + var(--grid-phase-x)) 0;
            }
          }

          @keyframes move {
            0% { transform: translate(0, -50%); }
            100% { transform: translate(0, 0); }
          }
        `}
      />

      <Box className="scene">
        <Box className="wall-grid" />
        <Box className="floor-wrap">
          <Box className="floor-grid" />
        </Box>
      </Box>

      {showCover && <Box className="cover" />}
    </Box>
  )
}

export default SynthwaveGridBackground
