import React from 'react'
import dropRight from 'lodash/dropRight'
import last from 'lodash/last'

type StateChangeType = 'reset' | 'replace' | 'pop'

const useStateHistory = <P>(
  initialState: P
): [
  P | undefined,
  (state: P, options?: { type?: StateChangeType }) => void,
  () => void,
  boolean,
  P | undefined
] => {
  const [states, setStates] = React.useState([initialState])
  const setNextState = React.useCallback(
    (state: P, options?: { type?: StateChangeType }) => {
      const { type } = options || {}
      setStates((s) => {
        if (type === 'reset') {
          return [state]
        }
        if (type === 'replace') {
          return [...dropRight(s), state]
        }
        return [...s, state]
      })
    },
    [setStates]
  )
  const prevState = React.useCallback(() => {
    setStates((s) => dropRight(s))
  }, [setStates])

  const isPrevStateAvailable = React.useMemo(() => states.length > 1, [states.length])

  return [last(states), setNextState, prevState, isPrevStateAvailable, states[states.length - 2]]
}

export default useStateHistory
