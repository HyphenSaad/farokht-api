import * as Yup from 'yup'

const UnitOfMeasureInfoYupSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),
})

export default UnitOfMeasureInfoYupSchema