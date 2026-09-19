import { CreateButton } from '@/components/refine-ui/buttons/create';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEPARTMENT_OPTIONS } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useTable } from '@refinedev/react-table';
import { useMemo, useState } from 'react';
import { Subject } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const departmentFilters = selectedDepartment === 'all' ? [] : [{ field: 'department', operator: 'eq' as const   , value: selectedDepartment }];
  const searchFilters = searchQuery ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }] : [];
  const subjectTable = useTable<Subject>({
    columns:useMemo<ColumnDef<Subject>[]>(() => [
      {id:'code',
        accessorKey: 'code',
         size: 100,
          header: ()=> <p className='column-title '>Code</p>,
          cell: ({ getValue }) => <Badge variant="secondary"> {getValue<string>()}</Badge>
        },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: ()=> <p className='column-title '>Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString',
      },
      {
        id:'department',
        accessorKey: 'department',
        size: 150,
        header: ()=> <p className='column-title '>Department</p>,
        cell: ({ getValue }) => <Badge variant="secondary"> {getValue<string>()}</Badge>,
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: ()=> <p className='column-title '>Description</p>,
        cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
        filterFn: 'includesString',
      }
    ], []),
    refineCoreProps: {
      resource: 'subjects',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [
      
          ...departmentFilters,...searchFilters
        ],  
      },
      sorters: {
        initial:[
          {field:'name',order:'desc'}
        ]
      },
    },
  });
  return (
          <ListView>
      <Breadcrumb/>
        <h1 className='page-title'>Subjects</h1>
        <div className='intro-row'>
          <p>Quick access to essential metrics and management tools.</p>
        </div>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className='search-icon' />
            <Input
            type='text'
            placeholder='Search by Name'
            className='pl-10 w-full'
            value = {searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter by Department' />
              </SelectTrigger>

              <SelectContent >
                <SelectItem value='all'>
                  All Departments
                </SelectItem>
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
            <CreateButton/>
          </div>
        </div>
      <DataTable table ={subjectTable} />
      </ListView>

  );
}
export default SubjectsList;
