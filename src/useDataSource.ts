import { useState } from 'react';
import { TableProps } from 'antd';

const useDataSource = <Col>() => {
  const [dataSource, setDataSource] = useState<TableProps<Col>['dataSource']>();

  const reset = () => {
    setDataSource(undefined);
  };

  return {
    dataSource,
    setDataSource,
    reset,
  };
};

export default useDataSource;
