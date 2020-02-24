
import Segment from '../arm/segment.js'

// console.log(import.meta);

export default interface IMotion {

    preload(): void

    performMotion(s: Segment): void

    isDone(): boolean

    isLoaded(): boolean
}