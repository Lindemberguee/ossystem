// app/dashboard/os/page.tsx

'use client';
import type { OrderFormValues } from '@/types/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  message,
} from 'antd';
import { useMediaQuery } from 'react-responsive';
import { PlusOutlined } from '@ant-design/icons';
import Notification from '../../../components/Notification';
import OrderTable from '@/components/OrderPage/OrderTable';
import OrderCard from '@/components/OrderPage/OrderCard';
import OrderModal from '@/components/OrderPage/OrderModal';
import OrderDetailModal from '@/components/UserOrderPage/OrderDetailModal';
import Filters from '@/components/OrderPage/Filters';
import type { OrderService, User, Department, Comment } from '@/types/types';
import theme from '@/app/styles/theme';
import { styled } from 'styled-components';
import { RcFile } from 'antd/es/upload';

const Container = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 8px;
    max-height: 300px;
  }
`;



export default function OSPage() {
  // Estados
  const [orders, setOrders] = useState<OrderService[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [savingOrder, setSavingOrder] = useState<boolean>(false);
  const [deletingOrder, setDeletingOrder] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<OrderService | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderService | null>(null);
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Estados relacionados a usuários e departamentos
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Estados relacionados a notificações
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Estados relacionados a filtros
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    search?: string;
  }>({});

  // Estados para comentários
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  // Hook para detectar se a tela é pequena (mobile)
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Função para obter o token
  const getToken = useCallback(() => localStorage.getItem('token'), []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userToken = getToken();
    console.log('Logged User ID:', userId);
    console.log('Token:', userToken);
    setLoggedUserId(userId);
    setToken(userToken);
  }, [getToken]);

  // Função para carregar as Ordens de Serviço
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/os', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.orders);
      } else {
        message.error(data.message || 'Erro ao carregar Ordens de Serviço.');
      }
    } catch (error) {
      message.error('Erro ao carregar Ordens de Serviço.');
    } finally {
      setLoadingOrders(false);
    }
  }, [getToken]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
        console.log('Usuários carregados:', data);
      } else {
        message.error('Erro ao carregar usuários.');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      message.error('Erro ao carregar usuários.');
    }
  }, [getToken]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch('/api/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDepartments(data);
        console.log('Departamentos carregados:', data);
      } else {
        message.error('Erro ao carregar departamentos.');
      }
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      message.error('Erro ao carregar departamentos.');
    }
  }, [getToken]);

  // Funções para comentários
  const fetchComments = useCallback(async (osId: string) => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/os/${osId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setComments(data.comments);
      } else {
        message.error(data.message || 'Erro ao carregar comentários.');
      }
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      message.error('Erro ao conectar ao servidor.');
    } finally {
      setCommentsLoading(false);
    }
  }, [token]);

  const handleAddComment = async (values: any) => {
    if (!selectedOrder) return;

    console.log('Comentário sendo enviado:', values);

    try {
      const response = await fetch(`/api/os/${selectedOrder._id}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: values, // Enviando FormData diretamente
      });

      const data = await response.json();
      console.log('Dados recebidos do backend:', data);

      if (response.ok && data.success) {
        message.success('Comentário adicionado com sucesso!');
        fetchComments(selectedOrder._id);
      } else {
        message.error(data.message || 'Erro ao adicionar comentário.');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  };

  const handleEditComment = useCallback(async (values: any) => {
    if (!editingComment) return;

    try {
      const response = await fetch(`/api/comments/${editingComment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Comentário editado com sucesso!');
        setEditingComment(null);
        fetchComments(selectedOrder!._id);
      } else {
        message.error(data.message || 'Erro ao editar comentário.');
      }
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  }, [editingComment, token, fetchComments, selectedOrder]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!selectedOrder) return;

    try {
      setCommentsLoading(true);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Comentário excluído com sucesso!');
        fetchComments(selectedOrder._id);
      } else {
        message.error(data.message || 'Erro ao excluir comentário.');
      }
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    } finally {
      setCommentsLoading(false);
    }
  }, [token, fetchComments, selectedOrder]);

  const openEditCommentModal = (comment: Comment) => {
    setEditingComment(comment);
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchDepartments();
  }, [fetchOrders, fetchUsers, fetchDepartments]);

  const openModal = (order: OrderService | null = null) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const openDetailModal = (order: OrderService) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    fetchComments(order._id);
  };

  const closeDetailModal = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };
  // @ts-ignore
  const handleSaveOrder = async (values: OrderFormValues) => {
    setSavingOrder(true);
    try {
      const now = new Date().toISOString();
  
      // Cria um objeto FormData para enviar os dados e os arquivos
      const formData = new FormData();
      formData.append('local', values.local);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('priority', values.priority);
      formData.append('status', values.status);
      formData.append('assignedUser', values.assignedUser);
      formData.append('isRecurring', String(values.isRecurring));
  
      // Se for recorrente, adiciona o padrão de recorrência
      if (values.isRecurring && values.recurrencePattern) {
        formData.append('recurrencePattern', values.recurrencePattern);
      }
  
      // Define startTime e endTime se estiver criando uma nova ordem
      if (!editingOrder) {
        formData.append('startTime', now);
        formData.append('endTime', now);
      }
  
      // Anexa os arquivos de imagem, se houver
      if (values.images && values.images.length > 0) {
        values.images.forEach((file: { originFileObj: RcFile; }) => {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj as RcFile);
          }
        });
      }
  
      // Define a URL e o método HTTP conforme a operação
      const url = editingOrder
        ? `https://backendsistema.azurewebsites.net/api/os/${editingOrder._id}` // Adicionada a barra antes do ID
        : 'https://backendsistema.azurewebsites.net/api/os';
      const method = editingOrder ? 'PUT' : 'POST';
  
      // Realiza a requisição para o backend
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // 'Content-Type' NÃO deve ser definido manualmente quando usando FormData
        },
        body: formData,
      });
  
      // Processa a resposta do backend
      const data = await response.json();
  
      if (response.ok) {
        setNotification({
          visible: true,
          message: editingOrder
            ? 'Ordem de Serviço atualizada com sucesso!'
            : 'Ordem de Serviço criada com sucesso!',
          type: 'success',
        });
        fetchOrders();
        setIsModalOpen(false);
      } else {
        setNotification({
          visible: true,
          message: data.message || 'Erro ao salvar Ordem de Serviço.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar Ordem de Serviço:', error);
      setNotification({
        visible: true,
        message: 'Erro ao salvar Ordem de Serviço.',
        type: 'error',
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDeleteOrder = async (_id: string) => {
    setDeletingOrder(true);
    try {
      const response = await fetch(`/api/os/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          visible: true,
          message: 'Ordem de Serviço removida com sucesso!',
          type: 'success',
        });
        fetchOrders();
      } else {
        setNotification({
          visible: true,
          message: 'Erro ao remover Ordem de Serviço.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Erro ao remover Ordem de Serviço:', error);
      setNotification({
        visible: true,
        message: 'Erro ao remover Ordem de Serviço.',
        type: 'error',
      });
    } finally {
      setDeletingOrder(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Traduções de status e prioridade
  const statusTranslation: { [key: string]: string } = {
    open: 'Aberta',
    in_progress: 'Em Progresso',
    completed: 'Concluída',
    closed: 'Fechada',
  };

  const priorityTranslation: { [key: string]: string } = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  const statusColors: { [key: string]: string } = {
    open: 'green',
    in_progress: 'blue',
    completed: 'cyan',
    closed: 'red',
  };

  const priorityColors: { [key: string]: string } = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  };

  // Criar um mapa de ID para Nome do Departamento
  const departmentMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    departments.forEach((dept) => {
      map[dept._id] = dept.name;
    });
    return map;
  }, [departments]);

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Gerenciamento de Ordens de Serviço</h2>
      <Filters
        onSearch={(value) => handleFilterChange('search', value)}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
        statusOptions={Object.keys(statusTranslation).map((key) => ({
          text: statusTranslation[key],
          value: key,
        }))}
        priorityOptions={Object.keys(priorityTranslation).map((key) => ({
          text: priorityTranslation[key],
          value: key,
        }))}
        filters={filters}
      />
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Nova Ordem de Serviço
        </Button>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onEdit={openModal}
              onDelete={handleDeleteOrder}
              onViewDetails={openDetailModal}
              statusTranslation={statusTranslation}
              priorityTranslation={priorityTranslation}
              statusColors={statusColors}
              priorityColors={priorityColors}
              departmentMap={departmentMap}
            />
          ))}
        </div>
      ) : (
        <OrderTable
          orders={orders}
          loading={loadingOrders}
          onEdit={openModal}
          onDelete={handleDeleteOrder}
          onViewDetails={openDetailModal}
          filters={filters}
          statusTranslation={statusTranslation}
          priorityTranslation={priorityTranslation}
          statusColors={statusColors}
          priorityColors={priorityColors}
          departmentMap={departmentMap}
        />
      )}

      <OrderDetailModal
        visible={isDetailModalOpen}
        onClose={closeDetailModal}
        order={selectedOrder}
        comments={comments}
        commentsLoading={commentsLoading}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onEditComment={openEditCommentModal}
        statusColors={statusColors}
        priorityColors={priorityColors}
        statusTranslation={statusTranslation}
        priorityTranslation={priorityTranslation}
        loggedUserId={loggedUserId} recurrenceTranslation={{}}      />

      <OrderModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        users={users}
        departments={departments}
        loading={savingOrder}
        editingOrder={editingOrder}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}
