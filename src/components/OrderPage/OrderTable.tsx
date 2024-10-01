import React, { useMemo } from 'react';
import { Table, Button, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { OrderService } from '@/types/types';

interface OrderTableProps {
  orders: OrderService[];
  loading: boolean;
  onEdit: (order: OrderService) => void;
  onDelete: (id: string) => void;
  onViewDetails: (order: OrderService) => void;
  filters: {
    status?: string;
    priority?: string;
    search?: string;
  };
  statusTranslation: { [key: string]: string };
  priorityTranslation: { [key: string]: string };
  statusColors: { [key: string]: string };
  priorityColors: { [key: string]: string };
  departmentMap: { [key: string]: string };
}

// Hook para gerar colunas da tabela
const useTableColumns = (
  onEdit: (order: OrderService) => void,
  onDelete: (id: string) => void,
  onViewDetails: (order: OrderService) => void,
  statusTranslation: { [key: string]: string },
  priorityTranslation: { [key: string]: string },
  statusColors: { [key: string]: string },
  priorityColors: { [key: string]: string },
  departmentMap: { [key: string]: string }
): ColumnsType<OrderService> => {
  return useMemo(() => [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: OrderService) => (
        <a onClick={() => onViewDetails(record)}>{text}</a>
      ),
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: Object.keys(statusTranslation).map((key) => ({
        text: statusTranslation[key],
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
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
      onFilter: (value, record) => record.priority === value,
      render: (priority: string) => (
        <Tag color={priorityColors[priority]}>
          {priorityTranslation[priority]}
        </Tag>
      ),
    },
    {
      title: 'Usuário Designado',
      dataIndex: ['assignedUser', 'name'],
      key: 'assignedUser',
    },
    {
      title: 'Departamento',
      dataIndex: ['assignedUser', 'department'],
      key: 'department',
      render: (departmentId: string | undefined) => (
        <span>{departmentId ? (departmentMap[departmentId] || 'Sem Departamento') : 'Sem Departamento'}</span>
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
  ], [onEdit, onDelete, onViewDetails, statusTranslation, priorityTranslation, statusColors, priorityColors, departmentMap]);
};

// Hook para aplicar filtros nas ordens de serviço
const useFilteredOrders = (
  orders: OrderService[],
  filters: {
    status?: string;
    priority?: string;
    search?: string;
  }
) => {
  return useMemo(() => {
    const searchText = filters.search?.toLowerCase() || '';
    return orders.filter((order) => {
      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesPriority = !filters.priority || order.priority === filters.priority;
      const matchesSearch =
        !searchText ||
        order.title.toLowerCase().includes(searchText) ||
        order.description.toLowerCase().includes(searchText) ||
        order.assignedUser.name.toLowerCase().includes(searchText);
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [orders, filters]);
};

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
  filters,
  statusTranslation,
  priorityTranslation,
  statusColors,
  priorityColors,
  departmentMap,
}) => {
  const columns = useTableColumns(onEdit, onDelete, onViewDetails, statusTranslation, priorityTranslation, statusColors, priorityColors, departmentMap);
  const filteredOrders = useFilteredOrders(orders, filters);

  return (
    <Table<OrderService>
      dataSource={filteredOrders}
      loading={loading}
      rowKey="_id"
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrderTable;
