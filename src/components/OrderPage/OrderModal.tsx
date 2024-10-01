// src/components/OrderPage/OrderModal.tsx

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Modal, Form, Input, Button, Select, Upload, message } from 'antd';
import type { UploadFile, RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { InboxOutlined } from '@ant-design/icons';
import type { OrderService, User, Department, Location } from '@/types/types';
import { locations } from '@/data/locations'; // Importe a lista de locais

// Interface para os valores do formulário
export interface OrderFormValues {
  local: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  assignedUser: string;
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  images?: UploadFile[]; // Campo para armazenar os arquivos de imagem
}

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: OrderFormValues) => void;
  users: User[];
  departments: Department[];
  loading: boolean;
  editingOrder: OrderService | null;
}

const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  onClose,
  onSave,
  users,
  departments,
  loading,
  editingOrder,
}) => {
  const [form] = Form.useForm<OrderFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (editingOrder) {
      form.setFieldsValue({
        ...editingOrder,
        assignedUser: editingOrder.assignedUser._id,
        isRecurring: editingOrder.isRecurring,
        images: editingOrder.images?.map((img: string, index: number) => ({
          uid: `${index}`,
          name: `Image ${index + 1}`,
          status: 'done',
          url: img, // img é uma string de URL
        })),
      });
      setFileList(
        editingOrder.images?.map((img: string, index: number) => ({
          uid: `${index}`,
          name: `Image ${index + 1}`,
          status: 'done',
          url: img, // img é uma string de URL
        })) || []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [editingOrder, form]);

  const userOptions = useMemo(() => (
    users.map(user => (
      <Select.Option key={user._id} value={user._id}>
        {user.name} ({user.department.name})
      </Select.Option>
    ))
  ), [users]);

  const departmentOptions = useMemo(() => (
    departments.map(department => (
      <Select.Option key={department._id} value={department._id}>
        {department.name}
      </Select.Option>
    ))
  ), [departments]);

  const locationOptions = useMemo(() => (
    locations.map((location, index) => (
      <Select.Option key={index} value={`${location.name} - ${location.number}`}>
        {location.name} - {location.number}
      </Select.Option>
    ))
  ), []);

  const handleFinish = useCallback((values: OrderFormValues) => {
    // Adiciona as imagens ao objeto de valores antes de salvar
    onSave({ ...values, images: fileList });
  }, [onSave, fileList]);

  const handleUploadChange = useCallback((info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
  }, []);

  const beforeUpload = useCallback((file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(`${file.name} não é uma imagem válida.`);
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(`${file.name} é maior que 5MB.`);
    }
    return isImage && isLt5M ? true : Upload.LIST_IGNORE;
  }, []);

  return (
    <Modal
      title={editingOrder ? 'Editar Ordem de Serviço' : 'Adicionar Ordem de Serviço'}
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form<OrderFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          isRecurring: false,
        }}
      >
        <Form.Item
          label="Local"
          name="local"
          rules={[{ required: true, message: 'Por favor, selecione a localização.' }]}
        >
          <Select placeholder="Selecione o Local">
            {locationOptions}
          </Select>
        </Form.Item>
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: 'Por favor, insira o título.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: 'Por favor, insira a descrição.' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Prioridade"
          name="priority"
          rules={[{ required: true, message: 'Por favor, selecione a prioridade.' }]}
        >
          <Select placeholder="Selecione a Prioridade">
            <Select.Option value="high">Alta</Select.Option>
            <Select.Option value="medium">Média</Select.Option>
            <Select.Option value="low">Baixa</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Por favor, selecione o status.' }]}
        >
          <Select placeholder="Selecione o Status">
            <Select.Option value="open">Aberta</Select.Option>
            <Select.Option value="in_progress">Em Progresso</Select.Option>
            <Select.Option value="completed">Concluída</Select.Option>
            <Select.Option value="closed">Fechada</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Usuário Atribuído"
          name="assignedUser"
          rules={[{ required: true, message: 'Por favor, selecione o usuário atribuído.' }]}
        >
          <Select placeholder="Selecione o Usuário">
            {userOptions}
          </Select>
        </Form.Item>
        <Form.Item
          label="Recorrência"
          name="isRecurring"
          valuePropName="value"
        >
          <Select placeholder="Selecione a Recorrência">
            <Select.Option value={true}>Sim</Select.Option>
            <Select.Option value={false}>Não</Select.Option>
          </Select>
        </Form.Item>
        {form.getFieldValue('isRecurring') && (
          <Form.Item
            label="Padrão de Recorrência"
            name="recurrencePattern"
            rules={[{ required: true, message: 'Por favor, selecione o padrão de recorrência.' }]}
          >
            <Select placeholder="Selecione o Padrão">
              <Select.Option value="daily">Diário</Select.Option>
              <Select.Option value="weekly">Semanal</Select.Option>
              <Select.Option value="monthly">Mensal</Select.Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item
          label="Imagens"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload.Dragger
            multiple
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            fileList={fileList}
            accept="image/*"
            // Evitar upload automático
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Clique ou arraste arquivos para esta área para fazer upload</p>
            <p className="ant-upload-hint">Suporte para múltiplas imagens. Apenas arquivos de imagem menores que 5MB são permitidos.</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {editingOrder ? 'Atualizar' : 'Criar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModal;
