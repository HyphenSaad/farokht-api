import React from 'react'
import MaterialReactTable from 'material-react-table'

const CustomDataTable = ({ rowCount, onPaginationChange, state, columns, data,
  renderTopToolbarCustomActions, renderRowActions }) => {

  return (
    <MaterialReactTable
      manualPagination={true}
      rowCount={rowCount}
      onPaginationChange={onPaginationChange}
      state={state}
      columns={columns}
      data={data}
      initialState={{ density: 'compact' }}
      enableColumnFilters={true}
      enablePagination={true}
      enableSorting={true}
      enableBottomToolbar={true}
      enableTopToolbar={true}
      enableEditing={true}
      enableFullScreenToggle={false}
      enableDensityToggle={false}
      enableHiding={false}
      positionActionsColumn='last'
      renderTopToolbarCustomActions={renderTopToolbarCustomActions}
      renderRowActions={renderRowActions}
    />
  )
}

export default CustomDataTable
