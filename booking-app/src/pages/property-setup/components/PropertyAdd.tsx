import React, { useState } from 'react';
import { DatePicker, Select, Button, InputNumber, Input, Modal, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { City, countries } from '../data/countries';
import { SelectValue } from 'antd/lib/select';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmitted: () => void;
}

function PropertyAdd({ visible, onCancel, onSubmitted }: Props) {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<boolean | 'optional'>('optional');
  const [fileList, updateFileList] = useState<any[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const uploadProps = {
    fileList,
    beforeUpload: (file: any) => {
      const isValidFileType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
      if (!isValidFileType) {
        message.error(`${file.name} is not a image file`);
      }
      return isValidFileType;
    },
    onChange: (info: any) => {
      updateFileList(info.fileList.filter((file: any) => !!file.status));
    }
  };

  const onRequiredTypeChange = ({ requiredMark }: any) => {
    setRequiredMarkType(requiredMark);
  };

  const onChangeCountry = (value: SelectValue) => {
    const country = countries.find(country => country.label === value);
    setCities(() => country?.cities ?? []);
  };

  const handleAddProperty = (values: any) => {
    console.log(values);
  };

  return (
    <Modal title="Add Property" visible={visible} onCancel={onCancel} footer={null} maskClosable={false}>
      <Form
        size="large"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{ requiredMark }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={handleAddProperty}
      >
        <Form.Item label="Title" name={['property', 'title']} rules={[{ required: true }]}>
          <Input placeholder="Title" />
        </Form.Item>

        <Form.Item label="Price" name={['property', 'price']} rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber placeholder="Price per night" />
        </Form.Item>

        <Form.Item label="Images" name={['property', 'images']} rules={[{ required: true }]}>
          <Upload style={{ width: '100%' }} {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload images</Button>
          </Upload>
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

        <Button block type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
}

export { PropertyAdd as default };
