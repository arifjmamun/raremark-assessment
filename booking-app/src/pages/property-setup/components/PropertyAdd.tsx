import React, { useState } from 'react';
import { DatePicker, Select, Button, InputNumber, Input, Modal, Form } from 'antd';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmitted: () => void;
}

function PropertyAdd({ visible, onCancel, onSubmitted }: Props) {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<boolean | 'optional'>('optional');

  const onRequiredTypeChange = ({ requiredMark }: any) => {
    setRequiredMarkType(requiredMark);
  };

  const handleAddProperty = (values: any) => {
    console.log(values);
  };

  return (
    <Modal title="Add Property" visible={visible} onCancel={onCancel} footer={null}>
      <Form
        layout="vertical"
        form={form}
        initialValues={{ requiredMark }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={handleAddProperty}
      >
        <Form.Item label="Title" name={['property', 'title']} rules={[{ required: true }]}>
          <Input placeholder="Title" />
        </Form.Item>

        <Form.Item
          label="Price"
          name={['property', 'price']}
          rules={[{ required: true, type: 'number', min: 0 }]}
        >
          <InputNumber placeholder="Price per night" />
        </Form.Item>

        <Form.Item
          label="Select property type"
          name={['property', 'type']}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="double">Double</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name={['property', 'description']}
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="Description" />
        </Form.Item>

        <Form.Item label="Select country" name={['property', 'country']} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="double">Double</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Select city" name={['property', 'city']} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="double">Double</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name={['property', 'availableDateRange']}
          label="Select date range"
          rules={[{ type: 'array', required: true }]}
        >
          <DatePicker.RangePicker />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export { PropertyAdd as default };
