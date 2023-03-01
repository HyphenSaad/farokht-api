import * as Yup from 'yup'

const TagInfoSchema = Yup.object().shape({
  source: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(40, 'Too Long!')
    .required('Required!'),

  destination: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(40, 'Too Long!')
    .required('Required!'),

  days: Yup.number()
    .typeError('Invalid')
    .min(1, 'Too Short!')
    .required('Required!'),

  minCost: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  maxCost: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  status: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),
})

export default TagInfoSchema