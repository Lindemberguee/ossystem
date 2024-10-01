// app/dashboard/slas/page.tsx
'use client';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';

interface SLA {
  _id: string;
  name: string;
  priority: string;
  responseTime: number;
  resolutionTime: number;
}

export default function SLAsPage() {
  const [slas, setSlas] = useState<SLA[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingSLA, setEditingSLA] = useState<SLA | null>(null);

  // Função para carregar as SLAs
  const fetchSLAs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/slas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSlas(data.slas);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Erro ao carregar SLAs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSLAs();
  }, []);

  const openModal = (sla: SLA | null = null) => {
    setEditingSLA(sla);
    setIsModalOpen(true);
    form.setFieldsValue(sla || { name: '', priority: '', responseTime: '', resolutionTime: '' });
  };

  const handleSaveSLA = async (values: SLA) => {
    setLoading(true);
    try {
      const url = editingSLA ? `/api/slas/${editingSLA._id}` : '/api/slas';
      const method = editingSLA ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message || 'SLA salva com sucesso!');
        fetchSLAs();
        setIsModalOpen(false);
      } else {
        message.error(data.message || 'Erro ao salvar SLA.');
      }
    } catch (error) {
      message.error('Erro ao salvar SLA.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSLA = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/slas/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        message.success('SLA removida com sucesso!');
        fetchSLAs(); // Recarrega a lista de SLAs
      } else {
        message.error(data.message || 'Erro ao remover SLA.');
      }
    } catch (error) {
      message.error('Erro ao remover SLA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de SLAs</h2>
      <Button type="primary" onClick={() => openModal()} className="mb-4">
        Adicionar SLA
      </Button>
      <Table
        dataSource={slas}
        loading={loading}
        rowKey="_id"
        columns={[
          {
            title: 'Prioridade',
            dataIndex: 'priority',
          },
          {
            title: 'Tempo de Resposta (min)',
            dataIndex: 'responseTime',
          },
          {
            title: 'Tempo de Resolução (min)',
            dataIndex: 'resolutionTime',
          },
          {
            title: 'Ações',
            render: (text, record: SLA) => (
              <div className="space-x-2">
                <Button type="link" onClick={() => openModal(record)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Você tem certeza que deseja remover essa SLA?"
                  onConfirm={() => handleDeleteSLA(record._id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button type="link" danger>
                    Remover
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <Modal
        title={editingSLA ? 'Editar SLA' : 'Adicionar SLA'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveSLA}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira o nome da SLA.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Prioridade"
            name="priority"
            rules={[{ required: true, message: 'Por favor, selecione a prioridade da SLA.' }]}
          >
            <Select placeholder="Selecione a Prioridade">
              <Select.Option value="high">Alta</Select.Option>
              <Select.Option value="medium">Média</Select.Option>
              <Select.Option value="low">Baixa</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Tempo de Resposta (min)"
            name="responseTime"
            rules={[{ required: true, message: 'Por favor, insira o tempo de resposta.' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Tempo de Resolução (min)"
            name="resolutionTime"
            rules={[{ required: true, message: 'Por favor, insira o tempo de resolução.' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
