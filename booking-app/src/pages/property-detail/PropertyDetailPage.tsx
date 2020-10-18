import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Space, Row, Col, Typography, Image, Spin } from 'antd';
import { EnvironmentOutlined, LoadingOutlined, ArrowRightOutlined } from '@ant-design/icons';

import SearchBar from '../../components/SearchBar';
import { PropertiesService } from '../../services/PropertiesService';
import { Property } from '../property-setup/models/Property';
import { basePath } from '../../constants/base';
import { format } from 'date-fns';
import { DateFormat } from '../../constants/date-format';

const propertiesService = PropertiesService.getInstance();

function PropertyDetailPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [property, setProperty] = useState<Property>();

  const params: any = useParams();
  const location = useLocation();
  const queryParams: any = {};

  new URLSearchParams(location.search).forEach((value, key) => {
    queryParams[key] = value;
  });

  const getProperty = (id: number) => {
    setLoading(() => true);
    propertiesService
      .getProperty(id)
      .then((response) => {
        setLoading(() => false);
        setProperty(() => response.data);
      })
      .catch(() => {
        setLoading(() => false);
        setProperty(() => undefined);
      });
  };

  useEffect(() => {
    getProperty(parseInt(params.id));
  }, [params.id]);

  const handleSearch = (query: any) => {};

  return (
    <Row align="middle" justify="center">
      <Col span={24}>
        <SearchBar queryParams={queryParams} onSearch={handleSearch} />
      </Col>
      {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />}
      {property && (
        <Col style={{ marginBottom: 25, alignItems: 'center', padding: '0 200px' }} span={24}>
          <Col>
            <Typography.Paragraph style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 0 }}>
              {property?.type}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ fontSize: 14 }}>
              <EnvironmentOutlined /> {property?.city}, {property?.country}
            </Typography.Paragraph>
          </Col>
          <Row justify="start">
            {property?.images &&
              property.images.map((image, index) => (
                <Col key={index} xs={2} sm={4} md={6} lg={12} xl={12}>
                  <Image height={'100%'} src={`${basePath}${image}`} alt={property.title} />
                </Col>
              ))}
          </Row>
          <Row justify="space-between" align="middle">
            <Col>
              <Typography.Title style={{ fontSize: 25, margin: '5px 0' }}>{property?.title}</Typography.Title>
              <Typography.Paragraph style={{ fontSize: 12 }}>
                <EnvironmentOutlined /> {property?.city}{' '}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 16 }}>{property?.description} </Typography.Paragraph>
            </Col>
            <Col>
              <Typography.Paragraph style={{ fontSize: 16, margin: '5px 0', fontWeight: 'bold' }}>
                Availibity
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 16 }}>
                <Space>
                  {format(new Date(property.fromDate), DateFormat.Date)}
                  <ArrowRightOutlined />
                  {format(new Date(property.toDate), DateFormat.Date)}
                </Space>
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 16, margin: '5px 0', fontWeight: 'bold' }}>
                Price
              </Typography.Paragraph>
              <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>TK. {property.price}</Typography.Text> /
              night
            </Col>
          </Row>
        </Col>
      )}
    </Row>
  );
}

export { PropertyDetailPage as default };
