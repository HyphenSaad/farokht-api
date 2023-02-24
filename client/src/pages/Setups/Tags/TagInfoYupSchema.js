import * as Yup from 'yup'

const TagInfoSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),
})

export default TagInfoSchema