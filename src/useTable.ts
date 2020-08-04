import { useState } from 'react';

type TableInfoType<Col> = {
  dataSource: Col[];
  total?: number;
};

interface UseTableProps<Col> {
  defaultPagination?: any;
  getTableInfo: (
    current: number,
    pageSize: number,
    newFilters: any,
    newSorter: any,
  ) => Promise<TableInfoType<Col> | false>;
}

function useTable<Col = any>(props: UseTableProps<Col>) {
  const {
    defaultPagination = {
      current: 1,
      pageSize: 10,
      total: 0,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 条记录`,
    },
    getTableInfo,
  } = props;

  const [dataSource, setDataSource] = useState<Col[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [sorter, setSorter] = useState({});

  const handleQuery = async (newPagination: any, newFilters: any, newSorter: any) => {
    const { current = 1, pageSize = 10 } = newPagination;

    const tableInfo = await getTableInfo(current, pageSize, newFilters, newSorter);

    if (tableInfo) {
      setDataSource(tableInfo.dataSource);
      const mergedPagination = { ...newPagination, total: tableInfo.total };
      setPagination(mergedPagination);
      setSorter(sorter);
    }
  };

  /** 条件查询时间 */
  const query = () => {
    handleQuery(defaultPagination, {}, {});
  };

  const refresh = () => {
    handleQuery(pagination, {}, sorter);
  };

  const clear = () => {
    setDataSource([]);
    setPagination(defaultPagination);
  };

  /** 表格分页变化 */
  const onChange: (newPagination: any, filters: any, sorter: any) => void = (
    newPagination,
    newFilters,
    newSorter,
  ) => {
    handleQuery(newPagination, newFilters, newSorter);
  };

  const tableProps = {
    dataSource,
    pagination,
    onChange,
  };

  return {
    tableProps,
    query,
    refresh,
    clear,
  };
}

export default useTable;
