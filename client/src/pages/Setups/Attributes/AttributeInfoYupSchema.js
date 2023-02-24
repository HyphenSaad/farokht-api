import * as Yup from 'yup'

const AttributeInfoSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),

  status: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),
})

export default AttributeInfoSchema