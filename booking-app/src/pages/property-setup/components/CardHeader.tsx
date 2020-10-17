import React, {  } from 'react';
import { Row, Col, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Props {
  onAdd: () => void;
}

function CardHeader({ onAdd }: Props) {
  return (
    <Row align="middle" justify="space-between">
    <Col>Properties</Col>
    <Col>
      <Tooltip placement="left" title="Add property">
        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={onAdd} />
      </Tooltip>
    </Col>
  </Row>
  );
}

export { CardHeader as default };