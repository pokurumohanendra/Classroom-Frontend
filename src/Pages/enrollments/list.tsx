import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { EditButton } from '@/components/refine-ui/buttons/edit';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { useTable } from '@refinedev/react-table';
import { useMemo } from 'react';
import { Enrollment } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const EnrollmentsList = () => {
  const enrollmentTable = useTable<Enrollment>({
    columns: useMemo<ColumnDef<Enrollment>[]>(() => [
      {
        id: 'studentId',
        accessorKey: 'studentId',
        size: 200,
        header: () => <p className='column-title'>Student</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: 'classId',
        accessorKey: 'classId',
        size: 120,
        header: () => <p className='column-title'>Class</p>,
      },
      {
        id: 'enrolledAt',
        accessorKey: 'enrolledAt',
        size: 200,
        header: () => <p className='column-title'>Enrolled At</p>,
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
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
      resource: 'enrollments',
      pagination: { pageSize: 10, mode: 'server' },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Enrollments</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools.</p>
      </div>
      <div className='actions-row'>
        <div />
        <CreateButton />
      </div>
      <DataTable table={enrollmentTable} />
    </ListView>
  );
};

export default EnrollmentsList;
