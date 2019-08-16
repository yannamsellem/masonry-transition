/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import { animated, useTransition } from 'react-spring'
import shuffle from 'lodash.shuffle'

import './App.css'

import useMedia from './useMedia'
import useMeasure from './useMeasure'

const data = Array.from({ length: 15 }, (_, i) => ({ key: i + 1 }))

function App() {
  const columns = useMedia(
    ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
    [5, 4, 3],
    2,
  )

  const [{ ref }, { width }] = useMeasure()

  const [items, set] = useState(data)

  useEffect(() => {
    const id = setTimeout(() => set(shuffle), 2000)
    return () => clearTimeout(id)
  })

  const heights = new Array(columns).fill(0)

  const gridItems = items.map((child) => {
    const column = heights.indexOf(Math.min(...heights))
    const xy = [(width / columns) * column, heights[column]]
    heights[column] += width / columns
    return {
      ...child,
      xy,
      width: width / columns,
      height: width / columns,
    }
  })

  const transitions = useTransition(gridItems, item => item.key, {
    from: ({ xy, width, height }) => ({
      xy,
      width,
      height,
      opacity: 0,
    }),
    enter: ({ xy, width, height }) => ({
      xy,
      width,
      height,
      opacity: 1,
    }),
    update: ({ xy, width, height }) => ({ xy, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  })

  return (
    <div ref={ref} className="list" style={{ height: Math.max(...heights) }}>
      {transitions.map(({ item, props: { xy, ...style }, key }) => (
        <animated.div
          key={key}
          style={{
            ...style,
            transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
          }}
        >
          <div>{item.key}</div>
        </animated.div>
      ))}
    </div>
  )
}

export default App
