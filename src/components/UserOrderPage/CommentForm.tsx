import React from 'react';
import { Form, Input, Button, Upload, Row, Col, Typography, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { TextArea } = Input;
const { Title } = Typography;

// Contêiner estilizado para o formulário
const StyledFormContainer = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;

// Título estilizado
const StyledTitle = styled(Title)`
  && {
    margin-bottom: 24px;
    text-align: center;
    
    @media (max-width: 576px) {
      font-size: 1.5em;
    }
  }
`;

// Campo de texto estilizado
const StyledTextArea = styled(TextArea)`
  resize: none;
  
  @media (max-width: 576px) {
    font-size: 1em;
  }
`;

// Componente de upload estilizado
const StyledUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
  }
  
  @media (max-width: 576px) {
    .ant-upload-list-picture-card-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
`;

// Contêiner para o botão de submissão
const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: 576px) {
    justify-content: center;
  }
`;

interface CommentFormProps {
  onAdd: (values: FormData) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onAdd }) => {
  const [form] = Form.useForm();

  // Função chamada ao submeter o formulário
  const handleFinish = (values: any) => {
    const formData = new FormData();
    formData.append('content', values.content);

    // Adiciona os arquivos anexados ao FormData
    if (values.attachments) {
      values.attachments.forEach((file: any) => {
        formData.append('files', file.originFileObj);
      });
    }

    // Chama a função onAdd com os dados do formulário
    onAdd(formData);
    message.success('Comentário adicionado com sucesso!');
    form.resetFields();
  };

  // Normaliza os valores do campo de upload
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <StyledFormContainer>
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        hideRequiredMark
      >
        {/* Título do formulário */}
        <StyledTitle level={4}>Adicionar Comentário</StyledTitle>
        
        {/* Campo de comentário */}
        <Form.Item
          name="content"
          rules={[
            { required: true, message: 'Por favor, insira um comentário.' },
          ]}
        >
          <StyledTextArea
            rows={4}
            placeholder="Escreva seu comentário..."
          />
        </Form.Item>
        
        {/* Campo de upload de arquivos */}
        <Form.Item
          name="attachments"
          label="Anexar Arquivos"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <StyledUpload
            listType="picture-card"
            beforeUpload={() => false}
            multiple
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </StyledUpload>
        </Form.Item>
        
        {/* Botão de submissão */}
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
