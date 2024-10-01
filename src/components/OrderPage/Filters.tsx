import React, { useMemo, useCallback } from 'react';
import { Input, Button, Select } from 'antd';

interface FiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (field: string, value: string) => void;
  onClear: () => void;
  statusOptions: { text: string; value: string }[];
  priorityOptions: { text: string; value: string }[];
  filters: {
    status?: string;
    priority?: string;
    search?: string;
  };
}

const Filters: React.FC<FiltersProps> = ({
  onSearch,
  onFilterChange,
  onClear,
  statusOptions,
  priorityOptions,
  filters,
}) => {
  // Memoizar as opções de status e prioridade
  const memoizedStatusOptions = useMemo(() => statusOptions, [statusOptions]);
  const memoizedPriorityOptions = useMemo(() => priorityOptions, [priorityOptions]);

  // Memoizar os handlers de filtro e busca
  const handleSearch = useCallback((value: string) => {
    onSearch(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    onFilterChange(field, value);
  }, [onFilterChange]);

  const handleClear = useCallback(() => {
    onClear();
  }, [onClear]);

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
      <Input.Search
        placeholder="Pesquisar por título, descrição ou usuário"
        onSearch={handleSearch}
        style={{ width: '100%', minWidth: 200, maxWidth: 300 }}
        allowClear
        aria-label="Campo de pesquisa"
      />
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2 space-y-2 sm:space-y-0">
        <Select
          placeholder="Filtrar por Status"
          allowClear
          onChange={(value) => handleFilterChange('status', value)}
          style={{ width: '100%', minWidth: 150 }}
          value={filters.status}
          aria-label="Filtrar por status"
        >
          {memoizedStatusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.text}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por Prioridade"
          allowClear
          onChange={(value) => handleFilterChange('priority', value)}
          style={{ width: '100%', minWidth: 150 }}
          value={filters.priority}
          aria-label="Filtrar por prioridade"
        >
          {memoizedPriorityOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.text}
            </Select.Option>
          ))}
        </Select>
        <Button onClick={handleClear} aria-label="Limpar filtros" className="w-full sm:w-auto">
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default Filters;
