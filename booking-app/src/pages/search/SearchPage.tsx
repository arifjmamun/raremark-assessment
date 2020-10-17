import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { List, Row, Col, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import SearchBar from '../../components/SearchBar';
import { PropertiesService } from '../../services/PropertiesService';
import { Property } from '../property-setup/models/Property';

const propertiesService = PropertiesService.getInstance();
const basePath = `http://localhost:8888`;

function SearchPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Property[]>([]);
  const [count, setCount] = useState<number>(0);

  const location = useLocation();
  const queryParams: any = {};
  new URLSearchParams(location.search).forEach((value, key) => {
    queryParams[key] = value;
  });

  const getProperties = (pageSize = 4, page = 1, query?: any) => {
    setLoading(() => true);
    propertiesService
      .getProperties(pageSize, page, query || queryParams)
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

  const handleOnPageChange = (page: number, pageSize?: number) => {
    getProperties(pageSize, page);
  };

  const handleSearch = (query: any) => {
    getProperties(4, 1, query);
  };

  return (
    <Row align="middle" justify="center">
      <Col span={24}>
        <SearchBar queryParams={queryParams} onSearch={handleSearch} />
      </Col>
      <Col span={24}>
        <Row style={{ padding: '0 200px', marginBottom: 25 }}>
          <List
            loading={loading}
            itemLayout="vertical"
            size="large"
            pagination={{
              position: 'bottom',
              total: count,
              onChange: handleOnPageChange,
              pageSize: 4
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Row>
                  <Col>
                    <Carousel showThumbs={false} width={400}>
                      {item.images.map((image, index) => (
                        <div key={index}>
                          <img height={250} src={`${basePath}${image}`} style={{ objectFit: 'cover' }} alt={item.title} />
                        </div>
                      ))}
                    </Carousel>
                  </Col>
                  <Col style={{ marginLeft: 15, flex: 1 }}>
                    <Col
                      span={24}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%'
                      }}
                    >
                      <div>
                        <Typography.Title style={{ fontSize: 18 }}>{item.type}</Typography.Title>
                        <Typography.Paragraph style={{ fontSize: 20, fontWeight: 'bold' }}>
                          {item.title}
                        </Typography.Paragraph>
                        <Typography.Paragraph style={{ fontSize: 16 }}>{item.description}</Typography.Paragraph>
                        <Typography.Paragraph style={{ fontSize: 16 }}>
                        <EnvironmentOutlined /> {item.city}, {item.country}
                        </Typography.Paragraph>
                      </div>
                      <Row justify="end">
                        <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>TK.{item.price}</Typography.Text>
                        /night
                      </Row>
                    </Col>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Row>
      </Col>
    </Row>
  );
}

export { SearchPage as default };
