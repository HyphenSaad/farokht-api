export const InitialValues = {
  name: '',
  minOrderNumber: '',
  description: '',
  unitOfMeasure: { value: '', label: 'Choose Unit of Measure' },
  tags: [],
  status: { value: '', label: 'Choose Status' },
  vendorPayoutPercentage: '',
  completionDays: '',
  user: { value: '', label: 'Choose Vendor' },
  attributes: [],
  priceSlabs: [],
  shipmentCosts: [],
}

export const StatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'suspended', label: 'Suspended' }
]