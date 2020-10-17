import React from 'react';
import { DatePicker, Select, Button, Input, Form, Row } from 'antd';
import { format } from 'date-fns';
import { Moment } from 'moment';
import { DateFormat } from '../constants/date-format';

interface Props {
  onSearch: (values: any) => void;
}

function SearchBar({ onSearch }: Props) {
  const [form] = Form.useForm();

  const handleSearch = ({ query }: any) => {    
    if (query.checkInCheckOut) {
      const [from, to]: [Moment, Moment] = query.checkInCheckOut;
      const fromDate = format(from.toDate(), DateFormat.Date);
      const toDate = format(to.toDate(), DateFormat.Date);
      query = {
        ...query,
        fromDate,
        toDate
      };
    }
    delete query.checkInCheckOut;
    onSearch(query);
  };

  return (
    <Row style={{ margin: '15px 0' }} align="middle" justify="center">
      <Form layout="inline" form={form} onFinish={handleSearch} size="large">
        <Form.Item name={['query', 'searchTerm']} style={{ width: '450px' }}>
          <Input placeholder="More places than you could ever go (but you can try!)" />
        </Form.Item>
        <Form.Item name={['query', 'checkInCheckOut']} rules={[{ type: 'array' }]}>
          <DatePicker.RangePicker allowClear />
        </Form.Item>
        <Form.Item name={['query', 'type']} style={{ width: '150px' }}>
          <Select placeholder="Property type">
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="double">Double</Select.Option>
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
