// hooks/useComments.ts
import { useState } from 'react';
import { message } from 'antd';
import type { Comment } from '@/types/types';

export const useComments = (getToken: () => string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

  const fetchComments = async (osId: string) => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/os/${osId}/comments`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
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

  const addComment = async (osId: string, values: any) => {
    try {
      const response = await fetch(`/api/os/${osId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Comentário adicionado com sucesso!');
        fetchComments(osId);
      } else {
        message.error(data.message || 'Erro ao adicionar comentário.');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  };

  const editComment = async (commentId: string, values: any) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Comentário editado com sucesso!');
        // Recarregar os comentários após a edição
      } else {
        message.error(data.message || 'Erro ao editar comentário.');
      }
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    }
  };

  const deleteComment = async (commentId: string, osId: string) => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success('Comentário excluído com sucesso!');
        fetchComments(osId);
      } else {
        message.error(data.message || 'Erro ao excluir comentário.');
      }
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      message.error('Erro ao conectar ao servidor.');
    } finally {
      setCommentsLoading(false);
    }
  };

  return {
    comments,
    commentsLoading,
    fetchComments,
    addComment,
    editComment,
    deleteComment,
  };
};
