import { css, CSSObject } from '@emotion/react'

// Generates CSS for multiple parallax layers
// parallaxLayers is how many layers (e.g., 10)
// speedFactor scales the Z-translation for more or less "depth" between layers
const parallaxMake = (
  parallaxLayers: number,
  speedFactor: number = 1
): CSSObject => {
  let styles: CSSObject = {}

  // In this loop, i=0 corresponds to the layer that will appear the largest
  // and i=parallaxLayers will be the furthest (smallest) layer.
  for (let i = 0; i <= parallaxLayers; i++) {
    // x determines how far back along the Z-axis and how large/small the layer is
    // (parallaxLayers - i) means the earliest layer is at the front
    // dividing by 2 then adding 1 to x sets the scale
    let x = (parallaxLayers - i) / 2

    // translateZ: how far the layer is pushed back
    // scale: how large the layer is (front layers are bigger, back layers smaller)
    // multiplying by speedFactor lets you increase or decrease the distance
    styles[`.parallax__layer__${i}`] = {
      // if layer 0 top -100% to cover the viewport
      // otherwise, top 0 to stack them vertically
      top: i === 0 ? '-150%' : '0',
      transform: `translateZ(${-100 * x * speedFactor}px) scale(${x + 1})`,
      transformOrigin: 'center'
    }
  }

  return styles
}

// Returns a CSS template for a parallax section
// noScroll: if true, the container can scroll vertically
export const Section = (noScroll?: boolean) => css`
  // perspective controls the 3D effect strength
  // a small value (100px) gives a more dramatic effect
  perspective: 100px;

  // hide overflow horizontally, switch to scroll vertically if noScroll is true
  overflow-x: hidden;
  overflow-y: ${noScroll ? 'scroll' : 'hidden'};

  // let the section span its container (or the viewport)
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .parallax__layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    // consider transform-style: preserve-3d on the parent if you nest 3D children
  }

  .parallax__cover {
    background: #fff;
    display: flex;
    align-items: flex-end;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  // Create 10 layers, apply speedFactor=1 for original "size" effect
  // if you want a stronger difference in scroll speed, increase speedFactor
  ${parallaxMake(7, 1)}

  #scrollarrows {
    position: relative;
  }
  #scrollarrows span {
    position: absolute;
    top: 0;
    left: 50%;
    width: 24px;
    height: 24px;
    margin-left: -12px;
    border-left: 1px solid #E3000F;
    border-bottom: 1px solid #E3000F;
    transform: rotate(-45deg);
    animation: sdb07 2s infinite;
    opacity: 0;
    box-sizing: border-box;
    filter: drop-shadow(1px 2px 2px rgb(0 0 0 / 0.1));
  }
  #scrollarrows span:nth-of-type(1) {
    animation-delay: 0s;
  }
  #scrollarrows span:nth-of-type(2) {
    top: 16px;
    animation-delay: 0.15s;
  }
  #scrollarrows span:nth-of-type(3) {
    top: 32px;
    animation-delay: 0.3s;
  }

  @keyframes sdb07 {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`
