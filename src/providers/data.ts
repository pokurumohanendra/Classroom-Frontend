import { Subject } from '@/types';
import { subjects } from '@/mock/subjects';
import {
  BaseRecord,
  CrudFilter,
  CrudSort,
  DataProvider,
  GetListParams,
  GetListResponse,
} from '@refinedev/core';

function applyFilters(data: Subject[], filters: CrudFilter[] = []): Subject[] {
  return filters.reduce((result, filter) => {
    if (!('field' in filter) || filter.value === undefined || filter.value === null || filter.value === '') {
      return result;
    }

    const { field, operator, value } = filter;
    const filterValue = String(value).toLowerCase();

    return result.filter((item) => {
      const itemValue = String((item as Record<string, unknown>)[field] ?? '').toLowerCase();

      switch (operator) {
        case 'eq':
          return itemValue === filterValue;
        case 'contains':
          return itemValue.includes(filterValue);
        default:
          return true;
      }
    });
  }, data);
}

function applySorting(data: Subject[], sorters: CrudSort[] = []): Subject[] {
  if (!sorters.length) {
    return data;
  }

  const [{ field, order }] = sorters;

  return [...data].sort((a, b) => {
    const aValue = String((a as Record<string, unknown>)[field] ?? '');
    const bValue = String((b as Record<string, unknown>)[field] ?? '');
    const comparison = aValue.localeCompare(bValue);
    return order === 'asc' ? comparison : -comparison;
  });
}

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    filters,
    sorters,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') {
      return { data: [] as TData[], total: 0 };
    }

    const result = applySorting(applyFilters(subjects, filters), sorters);

    return {
      data: result as unknown as TData[],
      total: result.length,
    };
  },
  getOne: async () => {
    throw new Error('Method not implemented.');
  },
  create: async () => {
    throw new Error('Method not implemented.');
  },
  update: async () => {
    throw new Error('Method not implemented.');
  },
  deleteOne: async () => {
    throw new Error('Method not implemented.');
  },
  getMany: async () => {
    throw new Error('Method not implemented.');
  },
  getApiUrl: () => {
    throw new Error('Method not implemented.');
  },
  custom: async () => {
    throw new Error('Method not implemented.');
  },
};
