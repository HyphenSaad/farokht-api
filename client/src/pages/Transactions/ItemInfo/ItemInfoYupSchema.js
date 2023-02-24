import * as Yup from 'yup'

const ItemInfoSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),

  minOrderNumber: Yup.number()
    .typeError('Invalid')
    .min(1, 'Too Short!')
    .required('Required!'),

  description: Yup.string()
    .min(10, 'Too Short!')
    .max(255, 'Too Long!')
    .required('Required!'),

  unitOfMeasure: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  tags: Yup.array()
    .min(1, 'At Least 1 Required!'),

  status: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  vendorPayoutPercentage: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  completionDays: Yup.number()
    .typeError('Invalid')
    .min(1, 'Too Short!')
    .required('Required!'),

  user: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  attributes: Yup.array()
    .min(1, 'At Least 1 Required!'),

  priceSlabs: Yup.array()
    .min(1, 'At Least 1 Required!'),

  shipmentCosts: Yup.array()
    .min(1, 'At Least 1 Required!'),
})

export default ItemInfoSchema