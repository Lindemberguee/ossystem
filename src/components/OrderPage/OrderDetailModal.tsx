// components/OrderDetailModal.tsx

import React from 'react';
import { Modal, Tabs, Tag, Button } from 'antd';
import { OrderService, Comment } from '@/types/types';
import CommentList from '../UserOrderPage/CommentList';
import CommentForm from '../UserOrderPage/CommentForm';

interface OrderDetailModalProps {
  visible: boolean;
  onClose: () => void;
  order: OrderService | null;
  comments: Comment[];
  commentsLoading: boolean;
  onAddComment: (values: any) => void;
  onDeleteComment: (id: string) => void;
  onEditComment: (comment: Comment) => void;
  statusColors: { [key: string]: string };
  priorityColors: { [key: string]: string };
  statusTranslation: { [key: string]: string };
  priorityTranslation: { [key: string]: string };
  recurrenceTranslation: { [key: string]: string };
  loggedUserId: string | null; // Adicione esta prop se necessário
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  onClose,
  order,
  comments,
  commentsLoading,
  onAddComment,
  onDeleteComment,
  onEditComment,
  statusColors,
  priorityColors,
  statusTranslation,
  priorityTranslation,
  recurrenceTranslation,
  loggedUserId,
}) => {
  return (
    <Modal
      title="Detalhes da Ordem de Serviço"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
      ]}
      width={800}
    >
      {order && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Detalhes" key="1">
            <p>
              <strong>Título:</strong> {order.title}
            </p>
            <p>
              <strong>Descrição:</strong> {order.description}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <Tag color={statusColors[order.status]}>
                {statusTranslation[order.status]}
              </Tag>
            </p>
            <p>
              <strong>Prioridade:</strong>{' '}
              <Tag color={priorityColors[order.priority]}>
                {priorityTranslation[order.priority]}
              </Tag>
            </p>
            <p>
              <strong>Data de Criação:</strong>{' '}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.isRecurring && (
              <p>
                <strong>Recorrência:</strong>{' '}
                {recurrenceTranslation[order.recurrencePattern] || 'N/A'}
              </p>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Comentários" key="2">
            <CommentList
              comments={comments}
              loading={commentsLoading}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
              loggedUserId={loggedUserId} // Passar o ID do usuário logado
            />
            <CommentForm onAdd={onAddComment} />
          </Tabs.TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default OrderDetailModal;
