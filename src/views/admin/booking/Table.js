/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import DatatablePagination from 'components/DatatablePagination';
import classnames from 'classnames';

const Table = ({
  columns,
  data,
  isLoading = true,
  divided = false,
  defaultPageSize = 10,
  totalCount = 0,
  onPageChange = null,
  onSortChange = null,
  queryPageSortBy = [],
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize,
        sortBy: queryPageSortBy,
      },
      manualPagination: true,
      autoResetPage: false,
      manualSortBy: true,
      disableMultiSort: true,
      autoResetSortBy: false,
      autoResetExpanded: false,
      pageCount: Math.ceil(totalCount / defaultPageSize),
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (onSortChange) {
      onSortChange(sortBy);
    }
    gotoPage(0);
  }, [sortBy, gotoPage]);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(pageIndex, pageSize);
    }
  }, [pageIndex, pageSize]);

  useEffect(() => {
    gotoPage(0);
  }, [pageSize, gotoPage]);

  if (isLoading) {
    return <div className="loading" />;
  }
  return (
    <>
      <table
        {...getTableProps()}
        className={`r-table table ${classnames({ 'table-divided': divided })}`}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`th_${columnIndex}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'sorted-desc'
                        : 'sorted-asc'
                      : ''
                  }
                >
                  {column.render('Header')}
                  <span />
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`td_${cellIndex}`}
                    {...cell.getCellProps({
                      className: cell.column.cellClass,
                    })}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <DatatablePagination
        page={pageIndex}
        pages={pageCount}
        canPrevious={canPreviousPage}
        canNext={canNextPage}
        pageSizeOptions={[4, 10, 20, 30, 40, 50]}
        showPageSizeOptions
        // showPageJump
        defaultPageSize={pageSize}
        onPageChange={(p) => gotoPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        paginationMaxSize={5}
      />
    </>
  );
};

export default Table;
