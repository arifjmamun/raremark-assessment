import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Space, Modal, message, Image } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';

import { PropertiesService } from '../../services/PropertiesService';
import { Property } from './models/Property';
import { DateFormat } from '../../constants/date-format';
import CardHeader from './components/CardHeader';
import PropertyAdd from './components/PropertyAdd';
import PropertyEdit from './components/PropertyEdit';
import { basePath } from '../../constants/base';

const propertiesService = PropertiesService.getInstance();

function PropertyListPage() {
  const columns: ColumnsType<Property> = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'image',
      render: (images: string[]) => (
        <Image        
          width={100}
          src={images.length ? `${basePath}${images[0]}` : ''}
        />
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 350,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (text: any) => `TK. ${text}`
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country'
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city'
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
      render: (item: any) => (
        <Space size="middle">
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleOnDeleteProperty(item)} />
          <Button type="link" icon={<EditOutlined />} onClick={() => setPropertyToUpdate(item)} />
        </Space>
      )
    }
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Property[]>([]);
  const [count, setCount] = useState<number>(0);
  const [visibleAddModal, setAddModalVisibility] = useState<boolean>(false);
  const [selectedPropertyToUpdate, setPropertyToUpdate] = useState<Property>();

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

  const handleOnSubmittedProperty = () => {
    setAddModalVisibility(() => false);
    setPropertyToUpdate(() => undefined);
    getProperties();
  };

  const handleOnDeleteProperty = (property: Property) => {
    Modal.confirm({
      title: 'Do you Want to delete the property?',
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to undo this.",
      onOk() {
        propertiesService
          .deleteProperty(property.id)
          .then((respponse) => {
            if (respponse.status === 200) {
              getProperties();
            }
          })
          .catch((error) => message.error(error));
      },
      onCancel() {}
    });
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
        onSubmitted={handleOnSubmittedProperty}
      />
      {selectedPropertyToUpdate && (
        <PropertyEdit
          visible={!!selectedPropertyToUpdate}
          property={selectedPropertyToUpdate}
          onCancel={() => setPropertyToUpdate(() => undefined)}
          onSubmitted={handleOnSubmittedProperty}
        />
      )}
    </Card>
  );
}

export { PropertyListPage as default };
