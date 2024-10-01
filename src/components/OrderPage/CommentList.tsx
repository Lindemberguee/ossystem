import React from 'react';
import { List, Avatar, Tag, Popconfirm, Spin, Card, Space, Tooltip, Button } from 'antd';
import { Comment } from '@/types/types';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import 'react-photo-view/dist/react-photo-view.css';

// Contêiner estilizado para a lista de comentários
const StyledListContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding: 16px;

  @media (min-width: 768px) {
    max-height: 800px;
    padding: 24px;
  }

  background: #f9f9f9;
  border-radius: 8px;
`;

// Card estilizado para cada comentário
const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;

  .ant-card-body {
    padding: 16px;
  }

  @media (max-width: 576px) {
    .ant-card-body {
      padding: 12px;
    }
  }
`;

// Contêiner para as ações de edição e exclusão
const ActionsContainer = styled(Space)`
  margin-top: 8px;
`;

// Contêiner de imagem com tamanho fixo
const AttachmentImageContainer = styled.div`
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;

  @media (max-width: 576px) {
    width: 150px;
    height: 150px;
  }
`;

// Imagem de anexo estilizada
const AttachmentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Exibe a imagem por inteiro */
  background-color: #fff; /* Preenche espaços vazios */
`;

// Link de anexo estilizado
const AttachmentLink = styled.a`
  display: block;
  margin-top: 10px;
  color: #1890ff;

  &:hover {
    text-decoration: underline;
  }
`;

// Contêiner de carregamento estilizado
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (comment: Comment) => void;
  loggedUserId?: string | null;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  loading,
  onDelete,
  onEdit,
  loggedUserId,
}) => {

  // Função para renderizar anexos
  const renderAttachments = (attachments: string[]) => {
    return (
      <PhotoProvider>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          {attachments.map((url, index) => {
            const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
            if (isImage) {
              return (
                <PhotoView key={index} src={url}>
                  <AttachmentImageContainer>
                    <AttachmentImage src={url} alt={`attachment-${index}`} />
                  </AttachmentImageContainer>
                </PhotoView>
              );
            } else {
              return (
                <AttachmentLink key={index} href={url} target="_blank" rel="noopener noreferrer">
                  <DownloadOutlined /> Download Attachment {index + 1}
                </AttachmentLink>
              );
            }
          })}
        </Space>
      </PhotoProvider>
    );
  };

  return (
    <StyledListContainer>
      {loading ? (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      ) : (
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <StyledCard
              key={comment._id}
              bordered={false}
              hoverable
              actions={
                comment.author._id === loggedUserId
                  ? [
                      <Tooltip key="edit" title="Editar Comentário">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => onEdit(comment)}
                        />
                      </Tooltip>,
                      <Tooltip key="delete" title="Excluir Comentário">
                        <Popconfirm
                          title="Tem certeza de que deseja excluir este comentário?"
                          onConfirm={() => onDelete(comment._id)}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <Button type="text" icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                      </Tooltip>,
                    ]
                  : []
              }
            >
              {/* Metadados do comentário */}
              <List.Item.Meta
                avatar={<Avatar src={comment.author.avatarUrl} />}
                title={
                  <Space direction="horizontal" align="center">
                    <strong>{comment.author.name}</strong>
                    <Tag color="blue">Usuário</Tag>
                  </Space>
                }
                description={comment.content}
              />
              {/* Renderização dos anexos, se houver */}
              {comment.attachments && comment.attachments.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  {renderAttachments(comment.attachments)}
                </div>
              )}
            </StyledCard>
          )}
        />
      )}
    </StyledListContainer>
  );
};

export default CommentList;
