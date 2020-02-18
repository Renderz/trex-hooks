import { useState } from 'react';
import { PaginationConfig } from 'antd/es/pagination';

type TableInfoType<Col> = {
  dataSource: Col[];
  total: number;
};

interface UseTableProps<Col> {
  defaultPagination?: PaginationConfig;
  getTableInfo: (current: number, pageSize: number) => Promise<TableInfoType<Col> | false>;
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

  const handleQuery = async (newPagination: PaginationConfig) => {
    const { current = 1, pageSize = 10 } = newPagination;

    const tableInfo = await getTableInfo(current, pageSize);

    if (tableInfo) {
      setDataSource(tableInfo.dataSource);
      const mergedPagination = { ...newPagination, total: tableInfo.total };
      setPagination(mergedPagination);
    }
  };

  /** 条件查询时间 */
  const onSearch = async () => {
    handleQuery(defaultPagination);
  };

  /** 表格分页变化 */
  const onChange = (newPagination: PaginationConfig) => {
    handleQuery(newPagination);
  };

  const tableProps = {
    dataSource,
    pagination,
    onChange,
  };

  return {
    tableProps,
    onSearch,
  };
}

export default useTable;
