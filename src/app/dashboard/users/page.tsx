'use client';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string; 
  department: {
    _id: string;
    name: string;
  } | null;
}

interface Department {
  _id: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/getUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    console.log('Resposta da API de Usuários:', data); // Verifique a estrutura aqui

    if (response.ok) {
      if (Array.isArray(data)) {
        // Caso o backend retorne diretamente o array de usuários
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        // Caso o backend retorne um objeto contendo o array de usuários
        setUsers(data.users);
      } else {
        message.error('Formato de resposta inesperado.');
      }
    } else {
      message.error(data.message);
    }
  } catch (error) {
    message.error('Erro ao carregar usuários.');
  } finally {
    setLoading(false);
  }
};


  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Departamentos carregados:', data); // Adicione este log para depuração
        setDepartments(data);
      }
    } catch (error) {
      message.error('Erro ao carregar departamentos.');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    form.setFieldsValue(user || { name: '', email: '', department: '', role: '' });
  };

  const handleSaveUser = async (values: User) => {
    setLoading(true);
    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users/register';
      const method = editingUser ? 'PUT' : 'POST';
  
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
        message.success(data.message || 'Usuário salvo com sucesso!');
        fetchUsers();
        setIsModalOpen(false);
      } else {
        message.error(data.message || 'Erro ao salvar usuário.');
      }
    } catch (error) {
      message.error('Erro ao salvar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Usuário removido com sucesso!');
        fetchUsers();
      } else {
        message.error(data.message || 'Erro ao remover usuário.');
      }
    } catch (error) {
      message.error('Erro ao remover usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
      <Button type="primary" onClick={() => openModal()} className="mb-4">
        Adicionar Usuário
      </Button>
      <Table
        dataSource={users}
        loading={loading}
        rowKey="_id"
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
          },
          {
            title: 'E-mail',
            dataIndex: 'email',
          },
          {
            title: 'Departamento',
            dataIndex: 'department',
            render: (department) => department?.name || 'Sem Departamento',
          },
          {
            title: 'Papel (Role)',
            dataIndex: 'role',
            render: (role) => role || 'Sem Role',
          },
          {
            title: 'Ações',
            render: (text, record: User) => (
              <div className="space-x-2">
                <Button type="link" onClick={() => openModal(record)}>
                  Editar
                </Button>
                <Popconfirm
                  title="Você tem certeza que deseja remover esse usuário?"
                  onConfirm={() => handleDeleteUser(record._id)}
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
        title={editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUser}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira o nome.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: 'Por favor, insira o e-mail.' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Departamento"
            name="department"
            rules={[{ required: true, message: 'Por favor, selecione o departamento.' }]}
          >
            <Select placeholder="Selecione o Departamento">
              {departments.map((dept) => (
                <Select.Option key={dept._id} value={dept._id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Papel (Role)"
            name="role"
            rules={[{ required: true, message: 'Por favor, selecione o papel do usuário.' }]}
          >
            <Select placeholder="Selecione o Papel">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="technician">Technician</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Senha" name="password">
            <Input.Password placeholder="Deixe em branco para não alterar" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
