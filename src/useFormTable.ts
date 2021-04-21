import { useState, useEffect, useCallback, useRef } from 'react';
import { Form, TableProps, TablePaginationConfig } from 'antd';

type GetTableData<Col> = (
  pagination?: TablePaginationConfig,
  formData?: Store,
) => Promise<{ dataSource?: Col[]; total?: number } | undefined>;

const defaultPagination: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: total => `共 ${total} 条记录`,
};

const useTableForm = <Col>(getTableData: GetTableData<Col>) => {
  const [formData, setFormData] = useState<Store>();
  const [pagination, setPagination] = useState<TablePaginationConfig>(defaultPagination);
  const [total, setTotal] = useState<number | undefined>(0);
  const [dataSource, setDataSource] = useState<Col[]>();

  const [form] = Form.useForm();

  const getTableDataRef = useRef(getTableData);

  const onFinish = async () => {
    const result = await form.validateFields();
    setFormData(result);
    setPagination(defaultPagination);
  };

  const onChange: TableProps<Col>['onChange'] = _pagination => {
    setPagination(_pagination);
  };

  const search = useCallback(async () => {
    const result = await getTableDataRef.current(pagination, formData);

    if (result) {
      setDataSource(result.dataSource);
      setTotal(result.total);
    }
  }, [formData, pagination]);

  useEffect(() => {
    search();
  }, [search]);

  return {
    formProps: {
      form,
      onFinish,
    },
    tableProps: {
      dataSource,
      pagination: {
        ...pagination,
        total,
      },
      onChange,
    },
    formData,
    search,
  };
};

export default useTableForm;
