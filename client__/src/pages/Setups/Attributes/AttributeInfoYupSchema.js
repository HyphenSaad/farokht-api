import * as Yup from 'yup'

const AttributeInfoSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),
})

export default AttributeInfoSchema