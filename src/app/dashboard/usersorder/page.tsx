'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  message,
  Row,
  Col,
  Divider,
  Tag,
  Tooltip,
  Card,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import Notification from '../../../components/Notification';
import OrderTable from '@/components/UserOrderPage/OrderTable';
import OrderCardList from '@/components/UserOrderPage/OrderCardList';
import OrderModal from '@/components/UserOrderPage/OrderModal';
import OrderDetailModal from '@/components/UserOrderPage/OrderDetailModal';
import EditCommentModal from '@/components/UserOrderPage/EditCommentModal';
import { OrderService, Comment } from '@/types/types';

export default function UserOSPage() {
  // Estados para OS
  const [orders, setOrders] = useState<OrderService[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<OrderService | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderService | null>(null);
  
  // Estados para comentários
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState<boolean>(false);
  
  // Outros estados
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    search?: string;
  }>({});
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Hook para detectar se a tela é pequena (mobile)
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Traduções e cores
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

  const recurrenceTranslation: { [key: string]: string } = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
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

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('token');
    console.log('Logged User ID:', userId); // Verifique o ID do usuário logado
    setLoggedUserId(userId);
    setToken(userToken);
  }, []);
  
  useEffect(() => {
    if (loggedUserId) {
      fetchUserOrders();
    }
  }, [loggedUserId, filters]);
  
  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/os', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log('Orders received from backend:', data.orders); // Verifique as ordens recebidas
  
      if (response.ok && data.success) {
        const userSpecificOrders = data.orders.filter((order: OrderService) => {
          console.log('Assigned User ID:', order.assignedUser._id, 'Logged User ID:', loggedUserId);
          return order.assignedUser._id === loggedUserId;
        });
        console.log('Filtered Orders:', userSpecificOrders); // Verifique as ordens filtradas
  
        const filteredOrders = userSpecificOrders.filter((order: OrderService) => {
          const searchText = filters.search?.toLowerCase() || '';
          const matchesStatus = !filters.status || order.status === filters.status;
          const matchesPriority = !filters.priority || order.priority === filters.priority;
          const matchesSearch =
            !searchText ||
            order.title.toLowerCase().includes(searchText) ||
            order.description.toLowerCase().includes(searchText);
        
          console.log('Matches:', matchesStatus, matchesPriority, matchesSearch); // Verifique as correspondências
          return matchesStatus && matchesPriority && matchesSearch;
        });
  
        setOrders(filteredOrders);
      } else {
        message.error('Failed to load orders');
      }
    } catch (error) {
      message.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };
  
  const openModal = (order: OrderService | null = null) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingOrder(null);
    setIsModalOpen(false);
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

  const handleSaveOrder = async (values: any) => {
    setLoading(true);
    try {
      const url = editingOrder ? `/api/os/${editingOrder._id}` : '/api/os';
      const method = editingOrder ? 'PUT' : 'POST';
      const orderData = {
        ...values,
        assignedUser: loggedUserId, // Atribui a OS ao usuário logado
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotification({
          visible: true,
          message: editingOrder
            ? 'Ordem de serviço atualizada com sucesso!'
            : 'Ordem de serviço criada com sucesso!',
          type: 'success',
        });
        fetchUserOrders();
        closeModal();
      } else {
        setNotification({
          visible: true,
          message: data.message || 'Erro ao salvar a ordem de serviço.',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        visible: true,
        message: 'Erro ao conectar ao servidor.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/os/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotification({
          visible: true,
          message: 'Ordem de serviço excluída com sucesso!',
          type: 'success',
        });
        fetchUserOrders();
      } else {
        setNotification({
          visible: true,
          message: data.message || 'Erro ao excluir a ordem de serviço.',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({
        visible: true,
        message: 'Erro ao conectar ao servidor.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Funções para comentários
  const fetchComments = async (osId: string) => {
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
  };

  const handleAddComment = async (values: any) => {
    if (!selectedOrder) return;
  
    console.log('Comentário sendo enviado:', values);
  
    try {
      const response = await fetch(`/api/os/${selectedOrder._id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: values, // Enviando FormData diretamente
      });
  
      console.log('Resposta do backend:', response);
  
      const data = await response.json();
      console.log('Dados recebidos do backend:', data);
  
      if (response.ok && data.success) {
        message.success('Comentário adicionado com sucesso!');
        fetchComments(selectedOrder._id); // Atualizar a lista de comentários
      } else {
        message.error(data.message || 'Erro ao adicionar comentário.');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  };
  

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Comentário excluído com sucesso!');
        fetchComments(selectedOrder._id); // Atualizar a lista de comentários
      } else {
        message.error(data.message || 'Erro ao excluir comentário.');
      }
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  };

  const openEditCommentModal = (comment: Comment) => {
    setEditingComment(comment);
    setIsEditCommentModalOpen(true);
  };

  const handleEditComment = async (values: any) => {
    if (!editingComment || !selectedOrder) return;

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
        message.success('Comentário atualizado com sucesso!');
        setIsEditCommentModalOpen(false);
        fetchComments(selectedOrder._id);
      } else {
        message.error(data.message || 'Erro ao atualizar comentário.');
      }
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  };

  // Filtrar tarefas recorrentes
  const recurringOrders = orders.filter((order) => order.isRecurring);
  const nonRecurringOrders = orders.filter((order) => !order.isRecurring);

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Minhas Ordens de Serviço</h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <Input.Search
          placeholder="Pesquisar por título ou descrição"
          onSearch={(value) => handleFilterChange('search', value)}
          style={{ width: '100%', maxWidth: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Nova Ordem de Serviço
        </Button>
      </div>

      {/* Em dispositivos móveis, usar cartões em vez de tabela */}
      {isMobile ? (
        <OrderCardList
          orders={nonRecurringOrders}
          onEdit={openModal}
          onDelete={handleDeleteOrder}
          statusColors={statusColors}
          priorityColors={priorityColors}
          statusTranslation={statusTranslation}
          priorityTranslation={priorityTranslation}
          openDetailModal={openDetailModal}
        />
      ) : (
        <OrderTable
          orders={nonRecurringOrders}
          loading={loading}
          onEdit={openModal}
          onDelete={handleDeleteOrder}
          statusColors={statusColors}
          priorityColors={priorityColors}
          statusTranslation={statusTranslation}
          priorityTranslation={priorityTranslation}
          openDetailModal={openDetailModal}
        />
      )}

      {/* Seção de Tarefas Recorrentes */}
      {recurringOrders.length > 0 && (
        <>
          <Divider />
          <h3 className="text-xl font-semibold mb-4">Tarefas Recorrentes</h3>
          <Row gutter={[16, 16]}>
            {recurringOrders.map((order) => (
              <Col xs={24} sm={12} md={8} lg={6} key={order._id}>
                <Card
                  hoverable
                  onClick={() => openDetailModal(order)}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  title={
                    <div className="flex items-center">
                      <SyncOutlined style={{ marginRight: 8 }} />
                      {order.title}
                    </div>
                  }
                  extra={
                    <Tag color={priorityColors[order.priority]}>
                      {priorityTranslation[order.priority]}
                    </Tag>
                  }
                  actions={[
                    <Tooltip title="Editar" key="edit">
                      <EditOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(order);
                        }}
                      />
                    </Tooltip>,
                    <Tooltip title="Excluir" key="delete">
                      <DeleteOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order._id);
                        }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <p>
                    <strong>Status:</strong>{' '}
                    <Tag color={statusColors[order.status]}>
                      {statusTranslation[order.status]}
                    </Tag>
                  </p>
                  <p>
                    <strong>Recorrência:</strong>{' '}
                    {recurrenceTranslation[order.recurrencePattern] || 'N/A'}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Modal de Detalhes da OS */}
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

      {/* Modal para Criação/Edição de OS */}
      <OrderModal
        visible={isModalOpen}
        onCancel={closeModal}
        onSubmit={handleSaveOrder}
        loading={loading}
        initialValues={editingOrder}
      />

      {/* Modal para Edição de Comentário */}
      <EditCommentModal
        visible={isEditCommentModalOpen}
        onCancel={() => setIsEditCommentModalOpen(false)}
        onSubmit={handleEditComment}
        loading={loading}
        comment={editingComment}
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
