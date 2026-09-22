import { useShow, useList } from '@refinedev/core';
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShowButton } from '@/components/refine-ui/buttons/show';
import type { Department, DepartmentTotals, Subject } from '@/types';

type DepartmentRecord = Department & { totals?: DepartmentTotals };

const DepartmentsShow = () => {
  const { query, result: department } = useShow<DepartmentRecord>();
  const isLoading = query.isLoading;

  const { result: subjectsResult } = useList<Subject>({
    resource: 'subjects',
    filters: department?.name ? [{ field: 'department', operator: 'eq', value: department.name }] : [],
    pagination: { pageSize: 100 },
    queryOptions: { enabled: !!department?.name },
  });

  if (isLoading || !department) {
    return (
      <ShowView>
        <ShowViewHeader />
        <p className='text-muted-foreground'>Loading...</p>
      </ShowView>
    );
  }

  const totals = department.totals ?? { subjects: 0, classes: 0, enrolledStudents: 0 };

  return (
    <ShowView>
      <ShowViewHeader />
      <div className='flex items-center gap-2'>
        <Badge variant='secondary'>{department.code}</Badge>
        <h2 className='text-lg font-semibold'>{department.name}</h2>
      </div>
      {department.description && <p className='text-muted-foreground'>{department.description}</p>}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>Subjects</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totals.subjects}</CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>Classes</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totals.classes}</CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{totals.enrolledStudents}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects in this department</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          {!subjectsResult.data.length && <p className='text-muted-foreground text-sm'>No subjects yet.</p>}
          {subjectsResult.data.map((subject) => (
            <div key={subject.id} className='flex items-center justify-between border-b py-2 last:border-b-0'>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>{subject.code}</Badge>
                <span>{subject.name}</span>
              </div>
              <ShowButton size='sm' variant='ghost' resource='subjects' recordItemId={subject.id} />
            </div>
          ))}
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default DepartmentsShow;
