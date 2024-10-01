import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { OrderService } from '@/types/types';

interface OrderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  initialValues?: OrderService | null;
}

const { Option } = Select;

const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        initialValues={initialValues || { status: 'open', priority: 'medium' }}
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: 'Por favor, insira um título.' }]}
        >
          <Input placeholder="Título da Ordem de Serviço" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: 'Por favor, insira uma descrição.' }]}
        >
          <Input.TextArea rows={4} placeholder="Descrição da Ordem de Serviço" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Por favor, selecione um status.' }]}
        >
          <Select>
            <Option value="open">Aberta</Option>
            <Option value="in_progress">Em Progresso</Option>
            <Option value="completed">Concluída</Option>
            <Option value="closed">Fechada</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="priority"
          label="Prioridade"
          rules={[{ required: true, message: 'Por favor, selecione uma prioridade.' }]}
        >
          <Select>
            <Option value="low">Baixa</Option>
            <Option value="medium">Média</Option>
            <Option value="high">Alta</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Atualizar' : 'Criar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModal;
