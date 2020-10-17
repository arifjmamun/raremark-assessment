import React from 'react';
import { DatePicker, Select, Button, Input, Form, Row } from 'antd';
import { format } from 'date-fns';
import moment from 'moment';
import { DateFormat } from '../constants/date-format';

interface Props {
  onSearch: (values: any) => void;
  queryParams?: any;
}

function SearchBar({ onSearch, queryParams }: Props) {
  const [form] = Form.useForm();

  try {
    if (queryParams && queryParams.fromDate && queryParams.toDate) {
      queryParams.checkInCheckOut = [moment(queryParams.fromDate), moment(queryParams.toDate)];
    }
  } catch (error) {
    console.log('Parsing error!');
  }

  const handleSearch = ({ query }: any) => {    
    if (query.checkInCheckOut) {
      const [from, to]: [moment.Moment, moment.Moment] = query.checkInCheckOut;
      const fromDate = format(from.toDate(), DateFormat.Date);
      const toDate = format(to.toDate(), DateFormat.Date);
      query = {
        ...query,
        fromDate,
        toDate
      };
    }
    delete query.checkInCheckOut;

    Object.keys(query).forEach((key) => {
      if (!query[key]) {
        delete query[key];
      }
    });
    
    onSearch(query);
  };

  return (
    <Row style={{ margin: '15px 0' }} align="middle" justify="center">
      <Form initialValues={{query: queryParams}} layout="inline" form={form} onFinish={handleSearch} size="large">
        <Form.Item name={['query', 'searchTerm']} style={{ width: '450px' }}>
          <Input placeholder="More places than you could ever go (but you can try!)" allowClear />
        </Form.Item>
        <Form.Item name={['query', 'checkInCheckOut']} rules={[{ type: 'array' }]}>
          <DatePicker.RangePicker allowClear />
        </Form.Item>
        <Form.Item name={['query', 'type']} style={{ width: '150px' }}>
          <Select placeholder="Property type" allowClear>
            <Select.Option value="Single room">Single room</Select.Option>
            <Select.Option value="Double room">Double room</Select.Option>
            <Select.Option value="Private room">Private room</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
}

export { SearchBar as default };
