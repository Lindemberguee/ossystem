// app/dashboard/departments/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';

interface Department {
  _id: string;
  name: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]); // Estado dos departamentos
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado do modal de criação de departamento
  const [form] = Form.useForm();

  // Função para carregar os departamentos
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Autorização com JWT
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDepartments(data);
      } else {
        message.error(data.message || 'Erro ao carregar departamentos.');
      }
    } catch (error) {
      message.error('Erro ao carregar departamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(); // Carrega os departamentos ao montar o componente
  }, []);

  // Função para abrir o modal de criação de departamento
  const openModal = () => {
    setIsModalOpen(true);
    form.resetFields(); // Limpa o formulário
  };

  // Função para salvar um novo departamento
  const handleSaveDepartment = async (values: { name: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Departamento criado com sucesso!');
        setDepartments((prev) => [...prev, data]); // Adiciona o novo departamento à lista
        setIsModalOpen(false);
      } else {
        message.error(data.message || 'Erro ao criar departamento.');
      }
    } catch (error) {
      message.error('Erro ao criar departamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Departamentos</h2>
      <Button type="primary" onClick={openModal} className="mb-4">
        Adicionar Departamento
      </Button>

      <Table
        dataSource={departments}
        loading={loading}
        rowKey="_id"
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
          },
        ]}
      />

      {/* Modal para criação de departamentos */}
      <Modal
        title="Adicionar Departamento"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveDepartment}>
          <Form.Item
            label="Nome do Departamento"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira o nome do departamento.' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
