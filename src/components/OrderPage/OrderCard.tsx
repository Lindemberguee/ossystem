import React, { useMemo } from 'react';
import { Card, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { OrderService } from '@/types/types';

interface OrderCardProps {
  order: OrderService;
  onEdit: (order: OrderService) => void;
  onDelete: (id: string) => void;
  onViewDetails: (order: OrderService) => void;
  statusTranslation: { [key: string]: string };
  priorityTranslation: { [key: string]: string };
  statusColors: { [key: string]: string };
  priorityColors: { [key: string]: string };
  departmentMap: { [key: string]: string };
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onEdit,
  onDelete,
  onViewDetails,
  statusTranslation,
  priorityTranslation,
  statusColors,
  priorityColors,
  departmentMap,
}) => {

  // Memoizar ações do cartão
  const actions = useMemo(() => [
    <Tooltip title="Editar" key="edit">
      <EditOutlined
        onClick={(e) => {
          e.stopPropagation();
          onEdit(order);
        }}
      />
    </Tooltip>,
    <Tooltip title="Excluir" key="delete">
      <DeleteOutlined
        onClick={(e) => {
          e.stopPropagation();
          onDelete(order._id);
        }}
      />
    </Tooltip>,
  ], [onEdit, onDelete, order]);

  // Memoizar estilos do cartão
  const cardStyle = useMemo(() => ({
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }), []);

  return (
    <Card
      key={order._id}
      hoverable
      onClick={() => onViewDetails(order)}
      style={cardStyle}
      title={order.title}
      extra={
        <Tag color={priorityColors[order.priority]}>
          {priorityTranslation[order.priority]}
        </Tag>
      }
      actions={actions}
    >
      <p>
        <strong>Status:</strong>{' '}
        <Tag color={statusColors[order.status]}>
          {statusTranslation[order.status]}
        </Tag>
      </p>
      <p>
        <strong>Usuário Designado:</strong> {order.assignedUser.name}
      </p>
      <p>
        <strong>Departamento:</strong> {departmentMap[order.assignedUser.department] || 'Sem Departamento'}
      </p>
      <p>
        <strong>Data de Criação:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>
    </Card>
  );
};

export default OrderCard;
