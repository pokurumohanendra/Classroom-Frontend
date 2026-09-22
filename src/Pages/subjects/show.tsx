import { useShow, useList } from '@refinedev/core';
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShowButton } from '@/components/refine-ui/buttons/show';
import type { SubjectWithDepartment, ClassWithRelations } from '@/types';

const SubjectsShow = () => {
  const { query, result: subject } = useShow<SubjectWithDepartment>();
  const isLoading = query.isLoading;

  const { result: classesResult } = useList<ClassWithRelations>({
    resource: 'classes',
    filters: subject?.id ? [{ field: 'subjectId', operator: 'eq', value: subject.id }] : [],
    pagination: { pageSize: 100 },
    queryOptions: { enabled: !!subject?.id },
  });

  if (isLoading || !subject) {
    return (
      <ShowView>
        <ShowViewHeader />
        <p className='text-muted-foreground'>Loading...</p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader />
      <div className='flex items-center gap-2'>
        <Badge variant='secondary'>{subject.code}</Badge>
        <h2 className='text-lg font-semibold'>{subject.name}</h2>
        {subject.department && <Badge variant='outline'>{subject.department.name}</Badge>}
      </div>
      {subject.description && <p className='text-muted-foreground'>{subject.description}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Classes under this subject ({subject.totalClasses ?? classesResult.total ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          {!classesResult.data.length && <p className='text-muted-foreground text-sm'>No classes yet.</p>}
          {classesResult.data.map((classItem) => (
            <div key={classItem.id} className='flex items-center justify-between border-b py-2 last:border-b-0'>
              <div className='flex items-center gap-2'>
                <span>{classItem.name}</span>
                <Badge variant='secondary'>{classItem.inviteCode}</Badge>
              </div>
              <ShowButton size='sm' variant='ghost' resource='classes' recordItemId={classItem.id} />
            </div>
          ))}
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default SubjectsShow;
