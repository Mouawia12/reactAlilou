import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

export default function MyTable({ data = [], initialFilters, columns = [] }) {
    const [filters, setFilters] = useState(initialFilters || {});
    const [selectedRows, setSelectedRows] = useState([]); // ✅ store selected rows

    // Initialize filters if not provided
    useEffect(() => {

        if (!initialFilters && columns.length > 0) {
            const defaultFilters = {};
            columns.forEach((col) => {
                if (col.field && col.filter !== false) {
                    defaultFilters[col.field] = {
                        value: null,
                        matchMode: FilterMatchMode.CONTAINS,
                    };
                }
            });
            setFilters(defaultFilters);
        } else if (initialFilters) {
            setFilters(initialFilters);
        }
    }, [initialFilters, columns]);

    const renderFilter = (field) => (
        <InputText
            value={filters[field]?.value || ''}
            onChange={(e) => {
                setFilters((prev) => ({
                    ...prev,
                    [field]: { ...prev[field], value: e.target.value },
                }));
            }}
            placeholder={`Search ${field}`}
            className="p-column-filter"
        />
    );

    return (
        <div className="mytable-container">
            <div className="card">
                <DataTable
                    value={data}
                    paginator
                    paginatorPosition="top"
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sortMode="multiple"
                    tableStyle={{ minWidth: '50rem' }}
                    filters={filters}
                    filterDisplay="row"
                    emptyMessage="No data found."
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    currentPageReportTemplate="Showing lines {first} to {last} of {totalRecords}"
                    //selection={selectedRows} // ✅ bind selection state
                    //onSelectionChange={(e) => setSelectedRows(e.value)} // ✅ update on change
                    dataKey="id" // ✅ unique identifier for rows (make sure your data has `id`)
                >
                    {/* ✅ Checkbox column
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />*/}

                    {columns.map((col) => (
                        <Column
                            key={col.field}
                            field={col.field}
                            header={col.header}
                            sortable={col.sortable !== false}
                            filter={col.filter !== false}
                            filterElement={
                                col.filterElement
                                    ? (options) => col.filterElement(options) // ✅ fix: pass options, not field
                                    : renderFilter(col.field)
                            }
                            style={col.style}
                            body={col.body}
                        />
                    ))}
                </DataTable>


            </div>
        </div>
    );
}
