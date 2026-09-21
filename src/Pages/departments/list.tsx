import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { EditButton } from '@/components/refine-ui/buttons/edit';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Search, Trash } from 'lucide-react';
import { useTable } from '@refinedev/react-table';
import { useMemo, useState } from 'react';
import { DepartmentListItem } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchFilters = searchQuery ? [{ field: 'search', operator: 'contains' as const, value: searchQuery }] : [];

  const departmentTable = useTable<DepartmentListItem>({
    columns: useMemo<ColumnDef<DepartmentListItem>[]>(() => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 100,
        header: () => <p className='column-title'>Code</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
      },
      {
        id: 'totalSubjects',
        accessorKey: 'totalSubjects',
        size: 120,
        header: () => <p className='column-title'>Subjects</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<number>()}</Badge>,
      },
      {
        id: 'actions',
        size: 100,
        header: () => <p className='column-title'>Actions</p>,
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <EditButton size='icon' variant='ghost' recordItemId={row.original.id}>
              <Pencil className='h-4 w-4' />
            </EditButton>
            <DeleteButton size='icon' recordItemId={row.original.id}>
              <Trash className='h-4 w-4' />
            </DeleteButton>
          </div>
        ),
      },
    ], []),
    refineCoreProps: {
      resource: 'departments',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...searchFilters],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Departments</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools.</p>
      </div>
      <div className='actions-row'>
        <div className='search-field'>
          <Search className='search-icon' />
          <Input
            type='text'
            placeholder='Search by name or code'
            className='pl-10 w-full'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CreateButton />
      </div>
      <DataTable table={departmentTable} />
    </ListView>
  );
};

export default DepartmentsList;
