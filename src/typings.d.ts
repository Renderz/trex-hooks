import { TablePaginationConfig } from 'antd';

declare global {
  type Store = Record<string, any>;

  declare namespace Table {
    type DefaultPagination = Omit<TablePaginationConfig, 'current' | 'pageSize' | 'total'>;

    type Pagination = Pick<TablePaginationConfig, 'current' | 'pageSize' | 'total'>;

    type GetTableData<Col> = (
      pagination: Pagination,
    ) => Promise<{ dataSource?: Col[]; total?: number } | false>;

    type UseTableProps<Col> = {
      getTableData: GetTableData<Col>;
      defaultPagination?: DefaultPagination;
    };
  }
}
