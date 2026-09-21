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
import { User, UserRole } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: UserRole.ADMIN, label: 'Admin' },
  { value: UserRole.TEACHER, label: 'Teacher' },
  { value: UserRole.STUDENT, label: 'Student' },
];

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const searchFilters = searchQuery ? [{ field: 'search', operator: 'contains' as const, value: searchQuery }] : [];
  const roleFilters = selectedRole === 'all' ? [] : [{ field: 'role', operator: 'eq' as const, value: selectedRole }];

  const userTable = useTable<User>({
    columns: useMemo<ColumnDef<User>[]>(() => [
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'email',
        accessorKey: 'email',
        size: 250,
        header: () => <p className='column-title'>Email</p>,
      },
      {
        id: 'role',
        accessorKey: 'role',
        size: 120,
        header: () => <p className='column-title'>Role</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: 'emailVerified',
        accessorKey: 'emailVerified',
        size: 120,
        header: () => <p className='column-title'>Verified</p>,
        cell: ({ getValue }) => (
          <Badge variant={getValue<boolean>() ? 'default' : 'secondary'}>
            {getValue<boolean>() ? 'Verified' : 'Unverified'}
          </Badge>
        ),
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
      resource: 'users',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...searchFilters, ...roleFilters],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Users</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools.</p>
      </div>
      <div className='actions-row'>
        <div className='search-field'>
          <Search className='search-icon' />
          <Input
            type='text'
            placeholder='Search by name'
            className='pl-10 w-full'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex gap-2 w-full sm:w-auto'>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateButton />
        </div>
      </div>
      <DataTable table={userTable} />
    </ListView>
  );
};

export default UsersList;
