import React, { FunctionComponent } from 'react'
import { IPicsumImage } from './interfaces'

interface IImage {
  image: IPicsumImage
  n: number
}

export const Image: FunctionComponent<IImage> = ({ image, n }) =>
  <div className='w-full'>
    <img
      className='m-2'
      // src={image.url} // hard-coded below because of CORS issues
      src='https://picsum.photos/200/300'
    />
    <span className='m-4'>{n + 1}</span>
  </div>
