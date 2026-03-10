export type Effect = () => void

export let activeEffect: undefined | Effect
export const watchEffect = (effect: Effect) => {
  activeEffect = effect
  effect()
  activeEffect = undefined
}
