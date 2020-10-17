import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Row, Col, Avatar, Spin, Rate, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import SearchBar from '../../components/SearchBar';
import { PropertiesService } from '../../services/PropertiesService';
import { LandingPageItem } from './models/LandingPageItem';

const propertiesService = PropertiesService.getInstance();

function HomePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [mockData, setMockData] = useState<LandingPageItem[]>([]);
  const history = useHistory();

  const getMockData = () => {
    setLoading(() => true);
    propertiesService
      .getMockApiData()
      .then((response) => {
        setLoading(() => false);
        setMockData(() => response.data);
      })
      .catch(() => {
        setLoading(() => false);
        setMockData(() => []);
      });
  };

  useEffect(() => {
    getMockData();
  }, []);

  const handleSearch = (query: any) => {
    const searchParams = new URLSearchParams(query).toString();
    history.push(`/search?${searchParams}`)
  };

  return (
    <Row align="middle" justify="center">
      <Col span={24}>
        <SearchBar onSearch={handleSearch} />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} style={{ padding: '0 200px' }}>
          <Col span={24}>
            <Typography.Title style={{ fontSize: 25 }}>What are guests saying about homes</Typography.Title>
          </Col>
          {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />}
          {mockData.length &&
            mockData.map((item) => (
              <Col key={item.username} sm={{ span: 8 }} xs={{ span: 24 }}>
                <Card cover={<img alt={item.title} src={item.image} />}>
                  <div style={{ marginBottom: 10 }}>
                    <Rate value={item.rating} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <Typography.Text>{item.comments}</Typography.Text>
                  </div>
                  <Card.Meta avatar={<Avatar src={item.avatar} />} title={item.username} description={item.country} />
                </Card>
              </Col>
            ))}
        </Row>
      </Col>
    </Row>
  );
}

export { HomePage as default };
