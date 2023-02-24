import * as Yup from 'yup'

const UserInfoBase = {
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Only Alphabets Allowed!')
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required!'),

  lastName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Only Alphabets Allowed!')
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required!'),

  phoneNumber1: Yup.string()
    .matches(/^[0-9]+$/, 'Only Digits Allowed!')
    .min(10, 'Too Short!')
    .max(10, 'Too Long!')
    .required('Required!'),

  phoneNumber2: Yup.string()
    .matches(/^[0-9]+$/, 'Only Digits Allowed!')
    .min(10, 'Too Short!')
    .max(10, 'Too Long!'),

  landline: Yup.string()
    .matches(/^[0-9]+$/, 'Only Digits Allowed!')
    .min(9, 'Too Short!')
    .max(11, 'Too Long!'),

  email: Yup.string()
    .email('Invalid Email!')
    .min(5, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  role: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  companyName: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  location: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  address: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  paymentMethod: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  bankName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Only Alphabets Allowed!')
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  bankBranchCode: Yup.string()
    .matches(/^[0-9]+$/, 'Only Digits Allowed!')
    .min(4, 'Too Short!')
    .max(7, 'Too Long!')
    .required('Required!'),

  bankAccountNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Only Digits Allowed!')
    .min(10, 'Too Short!')
    .max(15, 'Too Long!')
    .required('Required!'),
}

const UserInfoAddSchema = Yup.object().shape({
  ...UserInfoBase,
  password: Yup.string().min(8, 'Too Short!').required('Required!'),
})

const UserInfoEditSchema = Yup.object().shape({
  ...UserInfoBase,
  password: Yup.string().min(8, 'Too Short!'),
})

export { UserInfoAddSchema, UserInfoEditSchema }