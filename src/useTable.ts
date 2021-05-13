import { useState } from 'react';
import { TableProps } from 'antd';
import useDataSource from './useDataSource';
import usePagination from './usePagination';

const useTable = <Col>(props: Table.UseTableProps<Col>) => {
  const dataSourceUtils = useDataSource<Col>();

  const paginationUtils = usePagination(props.defaultPagination);

  const [loading, setLoading] = useState<boolean>(false);

  const { getTableData } = props;

  const query = async (targetPagination: Table.Pagination) => {
    /**
     * 查询场景
     * 1. 重置分页后查询 使用defaultPagination查询 如点击查询按钮后
     * 2. 不重置分页后查询 使用当前pagination查询 如点击刷新按钮
     * 3. 更换分页查询 使用新的分页参数查询 如切换分页组件或手动切换分页
     */
    setLoading(true);

    const response = await getTableData(targetPagination);

    if (response) {
      paginationUtils.setPagination({
        current: targetPagination.current,
        pageSize: targetPagination.pageSize,
        total: response.total || 0,
      });

      dataSourceUtils.setDataSource(response.dataSource);
    }

    setLoading(false);
  };

  /** 场景1 */
  const handleSearch = () => {
    query(paginationUtils.defaultPagination);
  };

  /** 场景2 */
  const handleRefresh = () => {
    query(paginationUtils.pagination);
  };

  /** 场景3 */
  const handleChange = (pagination: Table.Pagination) => {
    query(pagination);
  };

  const onChange: TableProps<Col>['onChange'] = pagination => {
    handleChange(pagination);
  };

  return {
    search: handleSearch,
    refresh: handleRefresh,
    change: handleChange,
    tableProps: {
      dataSource: dataSourceUtils.dataSource,
      pagination: paginationUtils.pagination,
      onChange,
      loading,
    },
  };
};

export default useTable;
