import React from 'react';
import { Table, Button, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { OrderService, User } from '@/types/types'; // Certifique-se de que as interfaces estão definidas corretamente

interface OrderTableProps {
  orders: OrderService[];
  loading: boolean;
  onEdit: (order: OrderService) => void;
  onDelete: (id: string) => void;
  statusColors: { [key: string]: string };
  priorityColors: { [key: string]: string };
  statusTranslation: { [key: string]: string };
  priorityTranslation: { [key: string]: string };
  openDetailModal: (order: OrderService) => void;  // Nova prop para abrir o modal de detalhes
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading,
  onEdit,
  onDelete,
  statusColors,
  priorityColors,
  statusTranslation,
  priorityTranslation,
  openDetailModal,  // Recebe a função para abrir o modal de detalhes
}) => {
  // Adicionando log para verificar os dados recebidos
  console.log('Orders passed to table:', orders);

  const columns: ColumnsType<OrderService> = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: 'Usuário',
      dataIndex: 'assignedUser',
      key: 'assignedUser',
      render: (user: User, order: OrderService) => (
        <a onClick={() => openDetailModal(order)} style={{ cursor: 'pointer', color: '#1890ff' }}>
          {user.name}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: Object.keys(statusTranslation).map((key) => ({
        text: statusTranslation[key],
        value: key,
      })),
      onFilter: (value: React.Key | boolean, record: OrderService) =>
        record.status === value,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusTranslation[status]}</Tag>
      ),
    },
    {
      title: 'Prioridade',
      dataIndex: 'priority',
      key: 'priority',
      filters: Object.keys(priorityTranslation).map((key) => ({
        text: priorityTranslation[key],
        value: key,
      })),
      onFilter: (value: React.Key | boolean, record: OrderService) =>
        record.priority === value,
      render: (priority: string) => (
        <Tag color={priorityColors[priority]}>
          {priorityTranslation[priority]}
        </Tag>
      ),
    },
    {
      title: 'Data de Criação',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
      responsive: ['lg'],
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: OrderService) => (
        <div className="space-x-2">
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Você tem certeza que deseja remover essa Ordem de Serviço?"
              onConfirm={() => onDelete(record._id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table<OrderService>
      dataSource={orders}
      loading={loading}
      rowKey="_id"
      columns={columns}
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => {}, // Ação ao clicar na linha, se necessário
      })}
    />
  );
};

export default OrderTable;
