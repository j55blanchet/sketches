
import Segment from './segment'

console.log(import.meta);

export default interface IMotion {

    performMotion(s: Segment): void

    isDone(): boolean
}