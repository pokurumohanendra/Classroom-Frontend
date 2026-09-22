import { useShow } from '@refinedev/core';
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShowButton } from '@/components/refine-ui/buttons/show';
import type { UserWithProfile } from '@/types';

const UsersShow = () => {
  const { query, result: user } = useShow<UserWithProfile>();
  const isLoading = query.isLoading;

  if (isLoading || !user) {
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
        <h2 className='text-lg font-semibold'>{user.name}</h2>
        <Badge variant='secondary'>{user.role}</Badge>
        <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
          {user.emailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      </div>
      <p className='text-muted-foreground'>{user.email}</p>

      {user.profile && 'classes' in user.profile && (
        <Card>
          <CardHeader>
            <CardTitle>Classes taught</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            {!user.profile.classes.length && <p className='text-muted-foreground text-sm'>No classes yet.</p>}
            {user.profile.classes.map((classItem) => (
              <div key={classItem.id} className='flex items-center justify-between border-b py-2 last:border-b-0'>
                <div className='flex items-center gap-2'>
                  <span>{classItem.name}</span>
                  <Badge variant='secondary'>{classItem.status}</Badge>
                </div>
                <ShowButton size='sm' variant='ghost' resource='classes' recordItemId={classItem.id} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {user.profile && 'enrollments' in user.profile && (
        <Card>
          <CardHeader>
            <CardTitle>Enrollments</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            {!user.profile.enrollments.length && <p className='text-muted-foreground text-sm'>Not enrolled in any classes yet.</p>}
            {user.profile.enrollments.map((enrollment) => (
              <div key={enrollment.id} className='flex items-center justify-between border-b py-2 last:border-b-0'>
                <span>{enrollment.className}</span>
                <ShowButton size='sm' variant='ghost' resource='classes' recordItemId={enrollment.classId} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </ShowView>
  );
};

export default UsersShow;
