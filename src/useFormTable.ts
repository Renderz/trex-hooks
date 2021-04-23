import { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Form, TableProps, TablePaginationConfig } from 'antd';

type GetTableData<Col> = (
  pagination?: TablePaginationConfig,
  formData?: Store,
) => Promise<{ dataSource?: Col[]; total?: number } | undefined>;

type Options = {
  isManual?: boolean;
  shouldClean?: boolean;
};

const defaultPagination: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: total => `共 ${total} 条记录`,
};

const useTableForm = <Col>(getTableData: GetTableData<Col>, options?: Options) => {
  const [form] = Form.useForm();

  // formData supposes to be undefined when initialize and becomes to be Store after submit once.
  const [formData, setFormData] = useState<Store | undefined>(undefined);
  const [pagination, setPagination] = useState<TablePaginationConfig>(defaultPagination);
  const [total, setTotal] = useState<number | undefined>(0);
  const [dataSource, setDataSource] = useState<Col[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getTableDataRef = useRef(getTableData);
  const optionsRef = useRef(options);

  const onFinish = async () => {
    const result = await form.validateFields();

    ReactDOM.unstable_batchedUpdates(() => {
      setFormData(result);
      setPagination(defaultPagination);
    });
  };

  const onChange: TableProps<Col>['onChange'] = _pagination => {
    setPagination(_pagination);
  };

  const search = useCallback(async () => {
    const { isManual = false, shouldClean = false } = optionsRef.current || {};

    if ((isManual && formData !== undefined) || !isManual) {
      setLoading(true);
      if (shouldClean) {
        setDataSource([]);
      }

      const result = await getTableDataRef.current(
        pagination,
        formData || form.getFieldsValue(true),
      );

      if (result) {
        ReactDOM.unstable_batchedUpdates(() => {
          setDataSource(result.dataSource);
          setTotal(result.total);
        });
      }

      setLoading(false);
    }
  }, [form, formData, pagination]);

  useEffect(() => {
    search();
  }, [search]);

  const formProps = {
    form,
    onFinish,
  };

  const tableProps = {
    dataSource,
    pagination: {
      ...pagination,
      total,
    },
    loading,
    onChange,
  };

  return {
    formProps,
    tableProps,
    search,
  };
};

export default useTableForm;
