// app/login/page.tsx
'use client';
import { Button, Form, Input, Checkbox, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

// app/login/page.tsx
const onFinish = async (values: { email: string; password: string }) => {
  setLoading(true);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (res.ok) {
      // Armazena o token JWT e as informações do usuário no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id); // Armazena o ID do usuário
      localStorage.setItem('userName', data.user.name); // Armazena o nome do usuário
      localStorage.setItem('userRole', data.user.role); // Armazena a role do usuário

      // Armazena o token JWT nos cookies
      document.cookie = `token=${data.token}; path=/;`;

      // Mensagem de sucesso
      message.success(data.message);

      // Redireciona para o dashboard
      router.push('/dashboard');
    } else {
      // Mensagem de erro caso o login falhe
      message.error(data.message);
    }
  } catch (error) {
    message.error('Erro ao conectar-se ao servidor. Tente novamente mais tarde.');
  } finally {
    setLoading(false);
  }
};

  
  

  return (
    <div className="min-h-screen flex">
      <div className="hidden sm:flex w-1/2 bg-zinc-900 items-center justify-center p-10">
        <div className="text-center text-white space-y-4">
          <Image
            src="https://apisistema.blob.core.windows.net/apiservice/9391712.png"
            width={500}
            height={500}
            alt="Picture of the author"
          />
          <div>
            <p className="text-4xl font-semibold">Faça já seu login</p>
            <p className="text-lg opacity-80">
              Gerencie seus processos com eficiência e facilidade.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full sm:w-1/2 p-8 bg-white shadow-2xl relative">
        <button className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 focus:outline-none">
          ✕
        </button>
        <div className="w-full max-w-md">
          <Typography.Title level={2} className="text-center mb-4 text-gray-800">
            Bem-vindo de Volta
          </Typography.Title>
          <Form form={form} name="login" onFinish={onFinish} layout="vertical" className="space-y-4">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor, insira seu email!' },
                { type: 'email', message: 'Insira um e-mail válido!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Digite seu email"
                className="py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Por favor, insira sua senha!' },
                { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Digite sua senha"
                className="py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Senha"
              />
            </Form.Item>
            <Form.Item>
              <Checkbox className="text-gray-600">Lembrar e-mail e senha</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                loading={loading}
                aria-label="Entrar"
              >
                LOGIN
              </Button>
            </Form.Item>
            <div className="flex justify-between">
              <a href="#" className="text-blue-500 hover:text-blue-700">
                Efetuar cadastro
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-700">
                Esqueceu sua senha?
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
