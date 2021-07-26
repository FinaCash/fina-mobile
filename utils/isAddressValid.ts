const isAddressValid = (address: string): boolean => {
  return address.length === 44 && new RegExp(`^terra([0-9a-zA-Z]){39}`).test(address)
}

export default isAddressValid
