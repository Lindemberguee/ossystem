// app/dashboard/tickets/page.tsx
'use client';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import { useEffect, useState } from 'react';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string; // O status será tratado pelo backend e não no front-end ao criar o ticket
  priority: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Função para carregar os tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tickets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTickets(data.tickets.tickets);
      } else {
        message.error(data.message || 'Erro ao carregar tickets.');
      }
    } catch (error) {
      message.error('Erro ao carregar tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(); // Carrega os tickets ao montar a página
  }, []);

  const openModal = (ticket: Ticket | null = null) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
    form.setFieldsValue(ticket || { title: '', description: '', priority: '' });
  };

  const handleSaveTicket = async (values: Ticket) => {
    setLoading(true);
    try {
      const url = editingTicket ? `/api/tickets/${editingTicket._id}` : '/api/tickets';
      const method = editingTicket ? 'PUT' : 'POST';

      // Remove o campo status na criação do ticket
      const payload = editingTicket
        ? values
        : { title: values.title, description: values.description, priority: values.priority };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message || 'Ticket salvo com sucesso!');
        fetchTickets();
        setIsModalOpen(false);
      } else {
        message.error(data.message || 'Erro ao salvar ticket.');
      }
    } catch (error) {
      message.error('Erro ao salvar ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tickets/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Ticket removido com sucesso!');
        fetchTickets(); // Recarrega a lista de tickets
      } else {
        message.error(data.message || 'Erro ao remover ticket.');
      }
    } catch (error) {
      message.error('Erro ao remover ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Tickets</h2>
      <Button type="primary" onClick={() => openModal()} className="mb-4">
        Adicionar Ticket
      </Button>
      <Table
        dataSource={tickets}
        loading={loading}
        rowKey="_id"
        columns={[
          {
            title: 'Título',
            dataIndex: 'title',
          },
          {
            title: 'Descrição',
            dataIndex: 'description',
          },
          {
            title: 'Prioridade',
            dataIndex: 'priority',
            render: (priority) => priority || 'Sem Prioridade',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => status || 'Sem Status',
          },
          {
            title: 'Ações',
            render: (text, record: Ticket) => (
              <div className="space-x-2">
                <Button type="link" onClick={() => openModal(record)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Você tem certeza que deseja remover esse ticket?"
                  onConfirm={() => handleDeleteTicket(record._id)}
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
        title={editingTicket ? 'Editar Ticket' : 'Adicionar Ticket'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveTicket}>
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
            <Input.TextArea />
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
