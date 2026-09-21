import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { EditButton } from '@/components/refine-ui/buttons/edit';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Search, Trash } from 'lucide-react';
import { useTable } from '@refinedev/react-table';
import { useMemo, useState } from 'react';
import { ClassWithRelations, ClassStatus } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const STATUS_OPTIONS: { value: ClassStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const statusVariant = (status: ClassStatus) =>
  status === 'active' ? 'default' : status === 'archived' ? 'destructive' : 'secondary';

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const searchFilters = searchQuery ? [{ field: 'search', operator: 'contains' as const, value: searchQuery }] : [];
  const statusFilters = selectedStatus === 'all' ? [] : [{ field: 'status', operator: 'eq' as const, value: selectedStatus }];

  const classTable = useTable<ClassWithRelations>({
    columns: useMemo<ColumnDef<ClassWithRelations>[]>(() => [
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'inviteCode',
        accessorKey: 'inviteCode',
        size: 120,
        header: () => <p className='column-title'>Invite Code</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: 'subject',
        accessorKey: 'subject.name',
        size: 160,
        header: () => <p className='column-title'>Subject</p>,
      },
      {
        id: 'teacher',
        accessorKey: 'teacher.user.name',
        size: 160,
        header: () => <p className='column-title'>Teacher</p>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        size: 100,
        header: () => <p className='column-title'>Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<ClassStatus>();
          return <Badge variant={statusVariant(status)}>{status}</Badge>;
        },
      },
      {
        id: 'capacity',
        accessorKey: 'capacity',
        size: 100,
        header: () => <p className='column-title'>Capacity</p>,
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
      resource: 'classes',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...searchFilters, ...statusFilters],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Classes</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools.</p>
      </div>
      <div className='actions-row'>
        <div className='search-field'>
          <Search className='search-icon' />
          <Input
            type='text'
            placeholder='Search by name or invite code'
            className='pl-10 w-full'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex gap-2 w-full sm:w-auto'>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateButton />
        </div>
      </div>
      <DataTable table={classTable} />
    </ListView>
  );
};

export default ClassesList;
