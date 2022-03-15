import React from 'react'
import { Recipient } from '../types/recipients'
import usePersistedState from '../utils/usePersistedState'

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
  const [recipients, setRecipients] = usePersistedState('recipients', initialState.recipients)

  return (
    <RecipientsContext.Provider
      value={{
        recipients,
        addRecipient: (recipient) => setRecipients((rs) => [...rs, recipient]),
        updateRecipient: (recipient) =>
          setRecipients((rs) => rs.map((r) => (r.address === recipient.address ? recipient : r))),
        deleteRecipient: (adr) => setRecipients((rs) => rs.filter((r) => r.address !== adr)),
      }}
    >
      {children}
    </RecipientsContext.Provider>
  )
}

const useRecipientsContext = (): RecipientsState => React.useContext(RecipientsContext)

export { RecipientsProvider, useRecipientsContext }
