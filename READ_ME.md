# Infinite Scrolling in React TypeScript

This app implements infinite scrolling with an Intesection Observer API (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

Styling is implemented with Tailwind.

It obtains images from the picsum api.

## How to install and run
In a terminal execute:
```
npm i
```

To run, execute the below in a terminal:
```
npm run start
```
## Explanation

The last image needs to be monitored with an Intersection Observer, so that when it intersects with the viewport, new images are requested.

All the useful logic takes place in 'Images/tsx'.

An Intersection Observer object is created:
```
const intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
    if (entries[0].isIntersecting) {
      setPageNum((n) => n + 1)
    }
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  }

  const observer = new IntersectionObserver(intersectionObserverCallback, options)
```
A `threshold` property of `0` means that if the target element is about to enter the viewport, the callback function get triggered.

A `threshold` property of `1` means that the callback function is only triggered if the entire target element enters the viewport.

A `useRef` is used to track the newly created `observer`. This will come useful in the clean-up function of the `useEffect`.

Another `useRef` is required to track the last element which the Intersection Observer needs to observe. So, every time new material is pulled from the picsum api, the last element needs to be observed, so that when it intersects the viewport, another call to the api is made:

```
const refLastElement = useRef(null)
```
Whenever an intersection occurs, the callback function of the intersection observer, `intersectionObserverCallback`, gets called. This function will increment the page number, which is saved in State.
```
const [pageNum, setPageNum] = useState(1)
...
const intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
  if (entries[0].isIntersecting) {
    setPageNum(n => n + 1)
  }
}
```
When the page number changes, the below `useEffect` gets triggered:
```
useEffect(() => {
  getImages()
}, [pageNum])
```
`getImages` is the function that makes the picsum api calls, and also saves the downloaded image data to state:
```
const [images, setImages] = useState<IPicsumImage[]>([])
...
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
```
When new images are downloaded, React reacts to render the new images, and `refLastElement` is assigned to the last element:
```
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
```
The below `useEffect` has no dependendies and therefore runs after each render, including after the images are rendered. It updates the target element of the Intersection Observer:
```
useEffect(() => {
  if (refLastElement.current !== null) {
    refObserver.current.observe(refLastElement.current)
  }
})
```

## Disconnect an Intersection Observer

In some cases, the code would be more complex than this example, such as when there is more rendering taking place, such as with some variables stored in Redux.

In this example code, an Intersection Observer is being created with every render. These persist between renders. One good test is to trigger intersections several times by scrolling down, and then scrolling back up: past elements that were being observered should not re-trigger infinite scrolling.

If this problem happens, disconnect an Intersection Observer in a useEffect:
```
if (refObserver.current !== null) {
  refObserver.current.disconnect()
}
```

## View the element targeted by the Intersection Observer
`entries` can be accessed and the inner html for the element output to console:
```
const intersectionObserverCallback = (entries: IntersectionObserverEntry[]): void => {
  if (entries[0].isIntersecting) {
    console.log('Callback:', entries[0]?.target?.querySelector('div')?.querySelector('span')?.innerHTML)
    setPageNum(n => n + 1)
  }
}
```


