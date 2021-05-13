import { useState } from 'react';

const usePagination = (defaultPaginationConfig?: Table.DefaultPagination) => {
  const mergedPaginationConfig: Table.DefaultPagination = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: total => `共 ${total} 条记录`,
    ...defaultPaginationConfig,
  };

  const defaultPagination: Table.Pagination = {
    total: 0,
    current: mergedPaginationConfig.defaultCurrent || 1,
    pageSize: mergedPaginationConfig.defaultPageSize || 10,
  };

  const [pagination, setPagination] = useState<Table.Pagination>(defaultPagination);

  const reset = () => {
    setPagination(defaultPagination);
  };

  return {
    pagination: {
      ...mergedPaginationConfig,
      ...pagination,
    },
    defaultPagination,
    setPagination,
    reset,
  };
};

export default usePagination;
