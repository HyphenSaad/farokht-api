export const InitialValues = {
  firstName: '',
  lastName: '',
  password: '',
  phoneNumber1: '',
  phoneNumber2: '',
  landline: '',
  location: '',
  address: '',
  email: '',
  companyName: '',
  paymentMethod: '',
  bankName: '',
  bankBranchCode: '',
  bankAccountNumber: '',
  role: { value: '', label: 'Choose Role' },
  status: { value: '', label: 'Choose Status' },
}

export const StatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'suspended', label: 'Suspended' }
]

export const RoleOptions = [
  { value: 'retailer', label: 'Retailer' },
  { value: 'vendor', label: 'Vendor' },
]