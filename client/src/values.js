export const ToastValues = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'light',
  toastId: 'xyz',
}

export const SelectMenuDisabledStyle = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: '#E9ECEF',
    borderWidth: '1px',
    borderColor: '#CED4DA',
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    color: '#212529'
  }),
}