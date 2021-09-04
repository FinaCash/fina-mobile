import React from 'react'
import { Recipient } from '../types/recipients'
import usePersistedState from '../utils/usePersistedState'
import { useAccountsContext } from './AccountsContext'

interface RecipientsState {
  recipients: Recipient[]
  addRecipient(recipient: Recipient): void
  updateRecipient(recipient: Recipient): void
  deleteRecipient(address: string): void
}

const initialState: RecipientsState = {
  recipients: [],
  addRecipient: () => null,
  updateRecipient: () => null,
  deleteRecipient: () => null,
}

const RecipientsContext = React.createContext<RecipientsState>(initialState)

const RecipientsProvider: React.FC = ({ children }) => {
  const { address } = useAccountsContext()
  const [recipients, setRecipients] = usePersistedState('recipients', initialState.recipients)

  // On logout
  React.useEffect(() => {
    if (!address) {
      setRecipients(initialState.recipients)
    }
  }, [address, setRecipients])

  return (
    <RecipientsContext.Provider
      value={{
        recipients,
        addRecipient: (recipient) => setRecipients((rs) => [...rs, recipient]),
        updateRecipient: (recipient) =>
          setRecipients((rs) => rs.map((r) => (r.address === recipient.address ? recipient : r))),
        deleteRecipient: (address) =>
          setRecipients((rs) => rs.filter((r) => r.address !== address)),
      }}
    >
      {children}
    </RecipientsContext.Provider>
  )
}

const useRecipientsContext = (): RecipientsState => React.useContext(RecipientsContext)

export { RecipientsProvider, useRecipientsContext }
