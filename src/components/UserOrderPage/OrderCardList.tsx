// components/OrderCardList.tsx
import React from 'react';
import { Card, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { OrderService } from '@/types/types';

interface OrderCardListProps {
  orders: OrderService[];
  onEdit: (order: OrderService) => void;
  onDelete: (id: string) => void;
  statusColors: { [key: string]: string };
  priorityColors: { [key: string]: string };
  statusTranslation: { [key: string]: string };
  priorityTranslation: { [key: string]: string };
  openDetailModal: (order: OrderService) => void;
}

const OrderCardList: React.FC<OrderCardListProps> = ({
  orders,
  onEdit,
  onDelete,
  statusColors,
  priorityColors,
  statusTranslation,
  priorityTranslation,
  openDetailModal,
}) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card
          key={order._id}
          hoverable
          onClick={() => openDetailModal(order)}
          style={{
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          title={order.title}
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
          ]}
        >
          <p>
            <strong>Status:</strong>{' '}
            <Tag color={statusColors[order.status]}>
              {statusTranslation[order.status]}
            </Tag>
          </p>
          <p>
            <strong>Data de Criação:</strong>{' '}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default OrderCardList;
