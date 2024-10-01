import React, { useCallback } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import styled from 'styled-components';

const { TextArea } = Input;
const { Title } = Typography;

// Estilização personalizada usando styled-components
const StyledFormContainer = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const StyledTitle = styled(Title)`
  && {
    margin-bottom: 24px;
    text-align: center;

    @media (max-width: 576px) {
      font-size: 1.5em;
    }
  }
`;

const StyledTextArea = styled(TextArea)`
  resize: none;

  @media (max-width: 576px) {
    font-size: 1em;
  }
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

interface CommentFormProps {
  onAdd: (values: any) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = useCallback((values: any) => {
    onAdd(values);
    message.success('Comentário adicionado com sucesso!');
    form.resetFields();
  }, [onAdd, form]);

  return (
    <StyledFormContainer>
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        hideRequiredMark
      >
        <StyledTitle level={4}>Adicionar Comentário</StyledTitle>

        <Form.Item
          name="content"
          rules={[{ required: true, message: 'Por favor, insira um comentário.' }]}
        >
          <StyledTextArea rows={4} placeholder="Escreva seu comentário..." />
        </Form.Item>

        <SubmitButtonContainer>
          <Button type="primary" htmlType="submit" block style={{ maxWidth: '200px' }}>
            Adicionar Comentário
          </Button>
        </SubmitButtonContainer>
      </Form>
    </StyledFormContainer>
  );
};

export default CommentForm;
