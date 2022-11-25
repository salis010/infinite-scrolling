import React, { FunctionComponent } from 'react'
import { Images } from './Images'

export const App: FunctionComponent = () => {
  return (
    <div className='h-screen'>
      <h1 className='m-4 text-5xl font-bold text-red-700'>Infinite Scrolling</h1>
      <Images />
    </div>
  )
}
