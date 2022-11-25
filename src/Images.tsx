import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { Image } from './Image'
import { IPicsumImage } from './interfaces'

// NEXT: check for picsum examples that work without CORS
// - take notes

export const Images: FunctionComponent = () => {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<IPicsumImage[]>([])
  const [pageNum, setPageNum] = useState(1)

  const intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
    if (entries[0].isIntersecting) {
      setPageNum(n => n + 1)
    }
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1
  }

  const observer = new IntersectionObserver(intersectionObserverCallback, options)

  const refObserver = useRef(observer)
  const refLastElement = useRef(null)

  const getImages = (): void => {
    setLoading(true)

    const url = `https://picsum.photos/v2/list?page=${pageNum}&limit=2`

    fetch(url)
      .then(async response => await response.json())
      .then(data => {
        setImages([...images, ...data])

        setLoading(false)
      })
      .catch(err => {
        console.log(err)

        setLoading(false)
      })
  }

  useEffect(() => {
    getImages()
  }, [pageNum])

  useEffect(() => {
    if (refLastElement.current !== null) {
      refObserver.current.observe(refLastElement.current)
    }
  })

  useEffect(() => {
    return () => {
      if (refLastElement.current !== null) {
        refObserver.current.unobserve(refLastElement.current)
      }
    }
  }, [])

  return (
    <div className='p-6 mx-4 bg-gray-100'>
      <div className='flex flex-col'>
        {images.length > 0 &&
        images.map((image, i) => i === images.length - 1 && !loading
          ? <div
              key={`${image.id}-${i}`}
              className='border-4 border-red-500'
              ref={refLastElement}
            >
            <Image image={image} n={i} />
            </div>
          : <Image key={`${image.id}-${i}`} image={image} n={i} />
        )}
      </div>
      {loading && <p className='text-center'>loading...</p>}
    </div>
  )
}
