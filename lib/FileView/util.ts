export function rafThrottle(fn: Function) {
  let locked: boolean = false
  return function <T>(this: T, ...args: any[]) {
    if (locked) return
    locked = true
    window.requestAnimationFrame((_) => {
      fn.apply(this, args)
      locked = false
    })
  }
}
type CustomSizeObj = {
  width: number
  height: number
}
export function getContainWH(
  containerSize: CustomSizeObj,
  elementSize: CustomSizeObj
): CustomSizeObj | undefined {
  try {
    if (elementSize.width < containerSize.width && elementSize.height < containerSize.height) {
      return elementSize
    }
    const containerRatio = containerSize.width / containerSize.height
    const elementRatio = elementSize.width / elementSize.height
    let width, height
    if (containerRatio < elementRatio) {
      width = containerSize.width
      height = containerSize.width / elementRatio
    } else {
      width = containerSize.height * elementRatio
      height = containerSize.height
    }
    return { width: parseInt(String(width)), height: parseInt(String(height)) }
  } catch (error) {
    console.log(error)
  }
}
