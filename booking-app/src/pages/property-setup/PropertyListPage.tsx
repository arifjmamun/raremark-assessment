import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';

import { PropertiesService } from '../../services/PropertiesService';
import { Property } from './models/Property';
import { DateFormat } from '../../constants/date-format';
import CardHeader from './components/CardHeader';
import PropertyAdd from './components/PropertyAdd';

const columns: ColumnsType<Property> = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'From Date',
    dataIndex: 'fromDate',
    key: 'fromDate',
    render: (date: string) => format(new Date(date), DateFormat.Date)
  },
  {
    title: 'To Date',
    dataIndex: 'toDate',
    key: 'toDate',
    render: (date: string) => format(new Date(date), DateFormat.Date)
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button type="link" icon={<DeleteOutlined />} />
        <Button type="link" icon={<EditOutlined />} />
      </Space>
    )
  }
];

const propertiesService = PropertiesService.getInstance();

function PropertyListPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Property[]>([]);
  const [count, setCount] = useState<number>(0);
  const [visibleAddModal, setAddModalVisibility] = useState<boolean>(false);

  const getProperties = (pageSize = 20, page = 1) => {
    setLoading(() => true);
    propertiesService
      .getProperties(pageSize, page)
      .then((response) => {
        setLoading(() => false);
        setData(() => response.data.items);
        setCount(() => response.data.count);
      })
      .catch(() => {
        setLoading(() => false);
        setData(() => []);
      });
  };

  useEffect(() => {
    getProperties();
  }, []);

  const handleOnPageChange = ({ pageSize, current }: TablePaginationConfig) => {
    getProperties(pageSize, current);
  };

  const handleOnAddProperty = () => {
    setAddModalVisibility(() => true);
  };

  const handleOnAddedProperty = () => {
    setAddModalVisibility(() => false);
    getProperties();    
  };

  return (
    <Card title={<CardHeader onAdd={handleOnAddProperty} />} bordered={false} style={{ marginTop: 15 }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={'id'}
        loading={loading}
        pagination={{
          pageSize: 20,
          total: count
        }}
        onChange={handleOnPageChange}
      />
      <PropertyAdd
        visible={visibleAddModal}
        onCancel={() => setAddModalVisibility(() => false)}
        onSubmitted={handleOnAddedProperty}
      />
    </Card>
  );
}

export { PropertyListPage as default };
