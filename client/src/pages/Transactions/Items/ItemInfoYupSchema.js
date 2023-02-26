import * as Yup from 'yup'

const ItemInfoSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),

  minOrderNumber: Yup.number()
    .typeError('Invalid')
    .min(1, 'Too Short!')
    .required('Required!'),

  description: Yup.string()
    .trim()
    .min(10, 'Too Short!')
    .max(255, 'Too Long!')
    .required('Required!'),

  unitOfMeasure: Yup.object()
    .shape({
      value: Yup.string().trim().required('Required!'),
      label: Yup.string()
        .trim()
        .min(1, 'Too Short!')
        .max(25, 'Too Long!')
        .required('Required!')
    })
    .required('Required!'),

  tags: Yup.array()
    .of(Yup.object().shape({
      value: Yup.string().required('Required!'),
      label: Yup.string()
        .trim()
        .min(1, 'Too Short!')
        .max(25, 'Too Long!')
        .required('Required!')
    }))
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
    .max(100, 'Not Possible!')
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
    .of(Yup.object().shape({
      id: Yup.object().shape({
        value: Yup.string().required('Required!'),
        label: Yup.string()
          .typeError('Invalid')
          .min(2, 'Too Short!')
          .max(25, 'Too Long!')
          .required('Required!'),
      }),

      value: Yup.string()
        .typeError('Invalid')
        .min(1, 'Too Short!')
        .max(75, 'Too Long!')
        .required('Required!'),
    }))
    .min(1, 'At Least 1 Required!'),

  priceSlabs: Yup.array()
    .of(Yup.object().shape({
      price: Yup.number()
        .typeError('Invalid')
        .min(1, 'Too Short!')
        .required('Required!'),

      slab: Yup.number()
        .typeError('Invalid')
        .min(1, 'Too Short!')
        .required('Required!'),
    }))
    .min(1, 'At Least 1 Required!'),

  shipmentCosts: Yup.array()
    .of(Yup.object().shape({
      location: Yup.string()
        .typeError('Invalid')
        .min(2, 'Too Short!')
        .max(75, 'Too Long!')
        .required('Required!'),

      cost: Yup.number()
        .typeError('Invalid')
        .min(1, 'Too Short!')
        .required('Required!'),

      days: Yup.number()
        .typeError('Invalid')
        .min(1, 'Too Short!')
        .required('Required!')
    }))
    .min(1, 'At Least 1 Required!'),
})

export default ItemInfoSchema