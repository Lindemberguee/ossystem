import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface EditCommentModalProps {
  visible: boolean;
  loading: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues: { content: string };
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  visible,
  loading,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Editar Comentário"
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onSubmit} initialValues={initialValues}>
        <Form.Item
          name="content"
          rules={[{ required: true, message: 'Por favor, insira o comentário.' }]}
        >
          <Input.TextArea rows={3} placeholder="Edite seu comentário..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Atualizar Comentário
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCommentModal;
