import type {AnyFn, EventFilter, ThrottleFilterOptions, TimerHandle} from '@vueuse/core';
import type {MaybeRefOrGetter} from 'vue';
import {isRef, toValue} from 'vue';

const noop = () => {}

/**
 * Throttle filter with burst. Got ms is not used statically, but dynamically increases by 1/throttleSteps from zero with each continuous call.
 * When used for the keypress handler - when the key is held down, the control is smooth. But with fast single keys, it is more responsive.
 */


export function throttleFilterWithBurst(ms: MaybeRefOrGetter<number>, trailing?: boolean, leading?: boolean, rejectOnCancel?: boolean): EventFilter
export function throttleFilterWithBurst(options: ThrottleFilterOptions): EventFilter
export function throttleFilterWithBurst(...args: any[]) {
    const throttleSteps = 10;

    let lastExec = 0
    let timer: TimerHandle
    let isLeading = true
    let lastRejector: AnyFn = noop
    let lastValue: any
    let ms: MaybeRefOrGetter<number>
    let trailing: boolean
    let leading: boolean
    let rejectOnCancel: boolean

    let executionCount = 0;

    if (!isRef(args[0]) && typeof args[0] === 'object')
        ({ delay: ms, trailing = true, leading = true, rejectOnCancel = false } = args[0])
    else
        [ms, trailing = true, leading = true, rejectOnCancel = false] = args

    const clear = () => {
        if (timer) {
            clearTimeout(timer)
            timer = undefined
            lastRejector()
            lastRejector = noop;
        }
    }


    const getCurrentDelay = () => {
        const maxDelay = toValue(ms);

        if (executionCount === 0) return 0;
        if (executionCount >= throttleSteps) return maxDelay;

        return maxDelay * (executionCount * (1 / throttleSteps));
    }
    const resetSequence = () => {
        executionCount = 0
    }

    const filter: EventFilter = (_invoke) => {
        const maxDuration = toValue(ms)
        const elapsed = Date.now() - lastExec
        const invoke = () => {
            executionCount++
            return lastValue = _invoke()
        }

        clear()

        if (maxDuration <= 0) {
            lastExec = Date.now()
            resetSequence()
            return invoke()
        }

        const currentDuration = getCurrentDelay()
        const shouldExecute = elapsed > currentDuration

        if (elapsed > maxDuration) {
            resetSequence()
        }

        if (shouldExecute) {
            lastExec = Date.now()
            if (leading || !isLeading) {
                return invoke()
            }
        }
        else if (trailing) {
            lastValue = new Promise((resolve, reject) => {
                lastRejector = rejectOnCancel ? reject : resolve
                const remainingTime = Math.max(0, currentDuration - elapsed)
                timer = setTimeout(() => {
                    lastExec = Date.now()
                    isLeading = true
                    executionCount++
                    resolve(invoke())
                    clear()
                }, remainingTime)
            })
        }

        if (!leading && !timer)
            timer = setTimeout(() => {
                isLeading = true
                executionCount++
            }, getCurrentDelay())

        isLeading = false
        return lastValue
    }

    return filter
}
