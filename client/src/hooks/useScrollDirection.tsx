import { useState, useEffect } from 'react';

export enum ScrollDirection {
  Up = 'Up',
  Down = 'Down'
}

export const useScrollDirection = (target?: HTMLElement) => {
  const [scrollDirection, setScrollDirection] = useState<string | null>(null)
  const [prevOffset, setPrevOffset] = useState(0)

  const toggleScrollDirection = () => {
    let scrollY = window.scrollY

    if (scrollY === 0) {
      setScrollDirection(null)
    }
    if (scrollY > prevOffset) {
      setScrollDirection(ScrollDirection.Down)
    } else if (scrollY < prevOffset) {
      setScrollDirection(ScrollDirection.Up)
    }

    setPrevOffset(scrollY)
  }
  useEffect(() => {
    window.addEventListener("scroll", toggleScrollDirection)
    return () => {
      window.removeEventListener("scroll", toggleScrollDirection)
    }
  })
  return scrollDirection
}