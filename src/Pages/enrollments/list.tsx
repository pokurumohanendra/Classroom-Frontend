import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { EditButton } from '@/components/refine-ui/buttons/edit';
import { DeleteButton } from '@/components/refine-ui/buttons/delete';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Trash } from 'lucide-react';
import { useTable } from '@refinedev/react-table';
import { useSelect } from '@refinedev/core';
import { useMemo, useState } from 'react';
import { Enrollment, Student, ClassItem } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const EnrollmentsList = () => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');

  const { options: classOptions } = useSelect<ClassItem>({
    resource: 'classes',
    optionLabel: 'name',
    optionValue: 'id',
  });
  const { options: studentOptions } = useSelect<Student>({
    resource: 'students',
    optionLabel: (item) => item.user?.name ?? item.userId,
    optionValue: 'id',
  });

  const classFilters = selectedClass === 'all' ? [] : [{ field: 'classId', operator: 'eq' as const, value: selectedClass }];
  const studentFilters = selectedStudent === 'all' ? [] : [{ field: 'studentId', operator: 'eq' as const, value: selectedStudent }];

  const enrollmentTable = useTable<Enrollment>({
    columns: useMemo<ColumnDef<Enrollment>[]>(() => [
      {
        id: 'studentId',
        accessorKey: 'student.user.name',
        size: 200,
        header: () => <p className='column-title'>Student</p>,
        cell: ({ row, getValue }) => (
          <Badge variant="secondary">{getValue<string>() ?? row.original.studentId}</Badge>
        ),
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
      filters: {
        permanent: [...classFilters, ...studentFilters],
      },
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
        <div className='flex gap-2 w-full sm:w-auto'>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by class' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Classes</SelectItem>
              {classOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder='Filter by student' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Students</SelectItem>
              {studentOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CreateButton />
      </div>
      <DataTable table={enrollmentTable} />
    </ListView>
  );
};

export default EnrollmentsList;
