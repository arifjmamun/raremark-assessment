import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Button, InputNumber, Input, Modal, Form, message } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { format } from 'date-fns';
import moment from 'moment';

import { City, countries } from '../data/countries';
import { DateFormat } from '../../../constants/date-format';
import { PropertiesService } from '../../../services/PropertiesService';
import { Property } from '../models/Property';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmitted: () => void;
  property: Property;
}

const propertyService = PropertiesService.getInstance();

function PropertyEdit({ visible, property: selectedProperty, onCancel, onSubmitted }: Props) {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<boolean | 'optional'>('optional');
  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);

  const initialValues = {
    property: {
      ...selectedProperty,
      availableDateRange: [moment(selectedProperty.fromDate), moment(selectedProperty.toDate)]
    }
  };

  const onRequiredTypeChange = ({ requiredMark }: any) => {
    setRequiredMarkType(requiredMark);
  };

  const onChangeCountry = (value: SelectValue) => {
    const country = countries.find((country) => country.label === value);
    setCities(() => country?.cities ?? []);
  };

  useEffect(() => {
    onChangeCountry(selectedProperty.country);
  }, []);

  const handleUpdateProperty = ({ property }: any) => {
    if (property.availableDateRange) {
      const [from, to]: [moment.Moment, moment.Moment] = property.availableDateRange;
      const fromDate = format(from.toDate(), DateFormat.Date);
      const toDate = format(to.toDate(), DateFormat.Date);
      property = {
        ...property,
        fromDate,
        toDate
      };
      delete property.availableDateRange;
    }

    property = {
      ...property,
      id: selectedProperty.id
    };

    setLoading(() => true);
    propertyService
      .updateProperty(property.id, property)
      .then((response) => {
        setLoading(() => false);
        if (response.status === 200) {
          onSubmitted();
        }
      })
      .catch((error) => {
        setLoading(() => false);
        message.error(error);
      });
  };

  return (
    <Modal title="Update Property" visible={visible} onCancel={onCancel} footer={null} maskClosable={false}>
      <Form
        size="large"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{ requiredMark, ...initialValues }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={handleUpdateProperty}
      >
        <Form.Item label="Title" name={['property', 'title']} rules={[{ required: true }]}>
          <Input placeholder="Title" />
        </Form.Item>

        <Form.Item label="Price" name={['property', 'price']} rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber placeholder="Price per night" />
        </Form.Item>

        <Form.Item label="Select property type" name={['property', 'type']} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Single room">Single room</Select.Option>
            <Select.Option value="Double room">Double room</Select.Option>
            <Select.Option value="Private room">Private room</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Description" name={['property', 'description']} rules={[{ required: true }]}>
          <Input.TextArea placeholder="Description" />
        </Form.Item>

        <Form.Item label="Select country" name={['property', 'country']} rules={[{ required: true }]}>
          <Select options={countries} onChange={onChangeCountry} />
        </Form.Item>

        <Form.Item label="Select city" name={['property', 'city']} rules={[{ required: true }]}>
          <Select options={cities} />
        </Form.Item>

        <Form.Item
          name={['property', 'availableDateRange']}
          label="Select date range"
          rules={[{ type: 'array', required: true }]}
        >
          <DatePicker.RangePicker />
        </Form.Item>

        <Button disabled={loading} loading={loading} block type="primary" htmlType="submit">
          Save changes
        </Button>
      </Form>
    </Modal>
  );
}

export { PropertyEdit as default };
