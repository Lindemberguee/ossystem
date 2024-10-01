// src/components/OrderDetailModal.tsx

import React from 'react';
import { Modal, Tabs, Tag, Button, Image, Typography, Row, Col, Space, Divider, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { OrderService, Comment } from '@/types/types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// Estilização do Container Principal
const DetailsContainer = styled.div`
  padding: 16px;
`;

const SectionTitle = styled(Title)`
  &&& {
    margin-bottom: 8px;
    font-size: 16px;
    color: #1890ff;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 16px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
`;

const ActionButtons = styled(Space)`
  margin-top: 16px;
`;

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
  loggedUserId: string | null;
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
  if (!order) return null;

  return (
    <Modal
      title="Detalhes da Ordem de Serviço"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
      ]}
      width={900}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <Tabs defaultActiveKey="1">
        {/* Detalhes da Ordem de Serviço */}
        <TabPane tab="Detalhes" key="1">
          <DetailsContainer>
            {/* Cabeçalho com Título e Ações */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
              <Col className='flex '>
                <Title level={4}>Título da Ordém de Serviço: <span className='font-thin'>{order.title}</span></Title>
              </Col>
              <Col>
                <ActionButtons>
                  <Tooltip title="Editar Ordem">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        // Função para editar a ordem (implemente conforme sua lógica)
                        // Por exemplo, abrir o modal de edição com os detalhes da ordem
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Deletar Ordem">
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        // Função para deletar a ordem (implemente conforme sua lógica)
                      }}
                    />
                  </Tooltip>
                </ActionButtons>
              </Col>
            </Row>

            {/* Descrição */}
            <DetailItem className='h-32'>
              <SectionTitle level={5}>Descrição</SectionTitle>
              <Paragraph
                ellipsis={{
                  rows: 4,
                  expandable: true,
                  symbol: 'mais',
                }}
              >
                {order.description}
              </Paragraph>
            </DetailItem>

            {/* Informações Básicas */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <DetailItem>
                  <Text strong>Local:</Text>
                  <Paragraph>{order.local}</Paragraph>
                </DetailItem>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <DetailItem>
                  <Text strong>Status:</Text>
                  <Tag color={statusColors[order.status]}>
                    {statusTranslation[order.status]}
                  </Tag>
                </DetailItem>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <DetailItem>
                  <Text strong>Prioridade:</Text>
                  <Tag color={priorityColors[order.priority]}>
                    {priorityTranslation[order.priority]}
                  </Tag>
                </DetailItem>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <DetailItem>
                  <Text strong>Data de Criação:</Text>
                  <Paragraph>{new Date(order.createdAt).toLocaleString()}</Paragraph>
                </DetailItem>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <DetailItem>
                  <Text strong>Usuário Atribuído:</Text>
                  <Paragraph>{order.assignedUser.name}</Paragraph>
                </DetailItem>
              </Col>
              {order.isRecurring && (
                <Col xs={24} sm={12} md={8}>
                  <DetailItem>
                    <Text strong>Recorrência:</Text>
                    <Paragraph>
                      {recurrenceTranslation[order.recurrencePattern] || 'N/A'}
                    </Paragraph>
                  </DetailItem>
                </Col>
              )}
            </Row>

            {/* Seção de Imagens */}
            {order.images && order.images.length > 0 && (
              <>
                <Divider />
                <SectionTitle level={5}>Imagens</SectionTitle>
                <ImageGrid>
                  {order.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Image ${index + 1}`}
                      width="100%"
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                      preview={{ mask: <Button type="link">Ampliar</Button> }}
                    />
                  ))}
                </ImageGrid>
              </>
            )}
          </DetailsContainer>
        </TabPane>

        {/* Comentários */}
        <TabPane tab="Comentários" key="2">
          <DetailsContainer>
            <CommentList
              comments={comments}
              loading={commentsLoading}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
              loggedUserId={loggedUserId}
            />
            <Divider />
            <CommentForm onAdd={onAddComment} />
          </DetailsContainer>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default OrderDetailModal;
