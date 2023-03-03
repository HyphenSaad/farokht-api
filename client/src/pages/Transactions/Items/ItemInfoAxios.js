import { API_SERVICE } from '../../../services'
import { StatusOptions } from './ItemInfoValues'
import { HandleAxiosError } from '../../../utilities.js'

export const FetchUsers = ({ token, value, setError, max = 10, navigate }) => {
  const usersEndpoint = `/user?role=vendor&status=approved&minified=yes&contactName=${value}&limit=${max}`

  return API_SERVICE(token)
    .get(usersEndpoint)
    .then(response => {
      if (response.status === 200) {
        return response.data.users.map(user => {
          return {
            value: user._id,
            label: user.contactName,
          }
        })
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const FetchTags = ({ token, value, setError, max = 10, navigate }) => {
  const tagsEndpoint = `/tag?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token)
    .get(tagsEndpoint)
    .then(response => {
      if (response.status === 200) {
        return response.data.tags.map(tag => {
          return {
            value: tag._id,
            label: tag.name,
          }
        })
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const FetchUnitOfMeasures = ({ token, value, setError, max = 10, navigate }) => {
  const unitOfMeasuresEndpoint = `/uom?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token)
    .get(unitOfMeasuresEndpoint)
    .then(response => {
      if (response.status === 200) {
        return response.data.unitOfMeasures.map(unitOfMeasure => {
          return {
            value: unitOfMeasure._id,
            label: unitOfMeasure.name,
          }
        })
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const FetchAttributes = ({ token, value, setError, max = 10, navigate }) => {
  const attributesEndpoint = `/attribute?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token)
    .get(attributesEndpoint)
    .then(response => {
      if (response.status === 200) {
        return response.data.attributes.map(attribute => {
          return {
            value: attribute._id,
            label: attribute.name,
          }
        })
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const FetchShipmentCosts = ({ token, value, setError, max = 10, navigate }) => {
  const unitOfMeasuresEndpoint = `/shipmentCost?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token)
    .get(unitOfMeasuresEndpoint)
    .then(response => {
      if (response.status === 200) {
        return response.data.shipmentCosts.map(shipmentCost => {
          return {
            value: shipmentCost._id,
            label: `${shipmentCost.days} days, ${shipmentCost.source} to ${shipmentCost.destination}`,
            minCost: shipmentCost.minCost,
            maxCost: shipmentCost.maxCost,
          }
        })
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

const SubmitShapeAdjustment = (values) => {
  const _values = { ...values }
  _values.status = values.status.value.length < 1 ? undefined : values.status.value

  _values.tags = _values.tags.map(tag => {
    return tag.hasOwnProperty('__isNew__')
      ? { id: '', name: tag.label }
      : { id: tag.value, name: tag.label }
  })

  _values.unitOfMeasure = _values.unitOfMeasure.hasOwnProperty('__isNew__')
    ? { id: '', name: _values.unitOfMeasure.label }
    : { id: _values.unitOfMeasure.value, name: _values.unitOfMeasure.label }

  _values.attributes = _values.attributes.map(attribute => {
    return attribute.id.hasOwnProperty('__isNew__')
      ? { id: '', name: attribute.id.label, values: attribute.values }
      : { id: attribute.id.value, name: attribute.id.label, values: attribute.values }
  })

  _values.shipmentCosts = _values.shipmentCosts.map(shipmentCost => {
    return shipmentCost.value
  })

  _values.vendorId = _values.user.value
  delete _values.user

  return _values
}

export const SubmitUserData = async ({
  id,
  token,
  navigate,
  values,
  isEditMode,
  setIsLoading,
  setError,
}) => {
  setIsLoading(true)

  const editEndpoint = `/item/${id}`
  const addEndpoint = `/item/`

  const data = SubmitShapeAdjustment(values)

  const addRedirect = {
    state: {
      message: 'Item Created Successfully!',
    }, replace: true,
  }

  const editRedirect = {
    state: {
      message: 'Item Updated Successfully!',
    }, replace: true,
  }

  const HandleEditMode = async () => {
    await API_SERVICE(token)
      .patch(editEndpoint, data)
      .then(response => {
        if (response.status === 200) {
          navigate('/Items', editRedirect)
        } else {
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  const HandleCreateMode = async () => {
    await API_SERVICE(token)
      .post(addEndpoint, data)
      .then(response => {
        if (response.status === 201) {
          navigate('/Items', addRedirect)
        } else {
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  isEditMode ? HandleEditMode() : HandleCreateMode()
}

export const FetchItemData = async ({ token,
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/item/${id}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setError('')
      setInitialValues({
        name: response.data.name,
        minOrderQuantity: response.data.minOrderQuantity,
        maxOrderQuantity: response.data.maxOrderQuantity === 0 ? '' : response.data.maxOrderQuantity,
        description: response.data.description,
        unitOfMeasure: {
          value: response.data.unitOfMeasure._id,
          label: response.data.unitOfMeasure.name
        },
        tags: response.data.tags.map(tag => {
          return {
            value: tag._id,
            label: tag.name
          }
        }),
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
        vendorPayoutPercentage: response.data.vendorPayoutPercentage,
        completionDays: response.data.completionDays,
        user: {
          value: response.data.vendorId._id,
          label: response.data.vendorId.contactName
        },
        attributes: response.data.attributes.map(attribute => {
          return {
            id: {
              value: attribute._id._id,
              label: attribute._id.name,
            },
            values: attribute.values
          }
        }),
        priceSlabs: response.data.priceSlabs.map(priceSlab => {
          return {
            slab: `${priceSlab.slab}`,
            price: `${priceSlab.price}`,
          }
        }),
        shipmentCosts: response.data.shipmentCosts.map(shipmentCost => {
          return {
            value: `${shipmentCost._id}`,
            label: `${shipmentCost.days} days, ${shipmentCost.source} to ${shipmentCost.destination}`,
            maxCost: `${shipmentCost.maxCost}`,
            minCost: `${shipmentCost.minCost}`
          }
        }),
        updatedBy: response.data.updatedBy.contactName,
        createdBy: response.data.createdBy.contactName,
      })
      setIsGettingData(false)
    } else {
      setError(`${response.status} - ${response.statusText}`)
    }
  }).catch(error => {
    HandleAxiosError({ error, setError, navigate })
  })
}