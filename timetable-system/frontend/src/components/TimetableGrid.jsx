import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function TimetableGrid({ rowData, onCellUpdate }) {
  const columnDefs = useMemo(
    () => [
      { field: 'day', editable: true, minWidth: 120 },
      { field: 'time_slot', headerName: 'Time Slot', editable: true, minWidth: 120 },
      { field: 'semester', editable: true, minWidth: 110 },
      { field: 'section', editable: true, minWidth: 100 },
      { field: 'subject', editable: true, minWidth: 160 },
      { field: 'teacher', editable: true, minWidth: 160 },
      { field: 'room', editable: true, minWidth: 100 },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      resizable: true,
      cellClassRules: {
        'bg-red-200': (params) => Boolean(params.data?.clash),
      },
    }),
    []
  );

  return (
    <div className="ag-theme-alpine h-[500px] w-full rounded-lg border border-slate-200">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={(params) => String(params.data.id ?? params.data.tempId)}
        onCellValueChanged={(event) => onCellUpdate(event.data)}
      />
    </div>
  );
}

export default TimetableGrid;
