// app/dashboard/profile/page.tsx
'use client';
import { Form, Input, Button, message } from 'antd';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState({ name: '', email: '' }); // Estado inicial para o usuário

  // Função para carregar os dados do usuário
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Agora usando a rota correta para buscar os dados do perfil do usuário autenticado
      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); // Atualiza o estado com os dados do usuário
        form.setFieldsValue(data.user); // Preenche o formulário com os dados do usuário
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Erro ao carregar dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(); // Carrega os dados do usuário ao carregar a página
  }, []);

  // Função para atualizar os dados do perfil do usuário
  const handleUpdateProfile = async (values: { name: string; email: string; password?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Pega o token JWT do localStorage
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); // Atualiza o estado local com os novos dados
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Erro ao atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Perfil do Usuário</h2>
      <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Por favor, insira seu nome.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: 'Por favor, insira seu e-mail.' },
            { type: 'email', message: 'Insira um e-mail válido.' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Nova Senha" name="password">
          <Input.Password placeholder="Deixe em branco para não alterar" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Atualizar Perfil
        </Button>
      </Form>
    </div>
  );
}
