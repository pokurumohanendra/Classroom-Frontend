import { useState } from 'react';
import { useShow, useList, useCreate, useDelete, useUpdate } from '@refinedev/core';
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, RefreshCw, Trash, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { capacityStatusOf, type ClassWithRelations, type EnrollmentWithStudent, type Student } from '@/types';

// Full class tokens are spelled out per-key (not built via template
// interpolation) so Tailwind's static scanner can find and generate them.
const capacityColor = {
  available: '[&>div]:bg-emerald-500',
  nearFull: '[&>div]:bg-amber-500',
  full: '[&>div]:bg-destructive',
} as const;

const generateInviteCode = () => Math.random().toString(36).slice(2, 10).toUpperCase();

const ClassesShow = () => {
  const { query, result: classItem } = useShow<ClassWithRelations>();
  const isLoading = query.isLoading;
  const refetchClass = query.refetch;

  const [studentSearch, setStudentSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  const {
    query: enrollmentsQuery,
    result: enrollmentsResult,
  } = useList<EnrollmentWithStudent>({
    resource: 'enrollments',
    filters: classItem?.id ? [{ field: 'classId', operator: 'eq', value: classItem.id }] : [],
    pagination: { pageSize: 100 },
    queryOptions: { enabled: !!classItem?.id },
  });
  const enrollmentsLoading = enrollmentsQuery.isLoading;
  const refetchEnrollments = enrollmentsQuery.refetch;

  const { query: candidatesQuery, result: candidatesResult } = useList<Student>({
    resource: 'students',
    filters: classItem?.id
      ? [
          { field: 'excludeClassId', operator: 'eq', value: classItem.id },
          ...(studentSearch ? [{ field: 'search', operator: 'contains' as const, value: studentSearch }] : []),
        ]
      : [],
    queryOptions: { enabled: !!classItem?.id && pickerOpen },
  });
  const candidatesLoading = candidatesQuery.isLoading;

  const { mutate: createEnrollment, mutation: createMutation } = useCreate();
  const enrolling = createMutation.isPending;
  const { mutate: deleteEnrollment } = useDelete();
  const { mutate: updateClass, mutation: updateMutation } = useUpdate();
  const regenerating = updateMutation.isPending;

  if (isLoading || !classItem) {
    return (
      <ShowView>
        <ShowViewHeader />
        <p className='text-muted-foreground'>Loading...</p>
      </ShowView>
    );
  }

  const capacityStatus = capacityStatusOf(classItem.enrolledCount, classItem.capacity);
  const capacityPercent = classItem.capacity > 0 ? Math.min(100, (classItem.enrolledCount / classItem.capacity) * 100) : 0;
  const atCapacity = classItem.enrolledCount >= classItem.capacity;

  const refetchAll = () => {
    refetchClass();
    refetchEnrollments();
  };

  const handleEnroll = (studentId: number) => {
    createEnrollment(
      { resource: 'enrollments', values: { classId: classItem.id, studentId } },
      {
        onSuccess: () => {
          toast.success('Student enrolled');
          setPickerOpen(false);
          setStudentSearch('');
          refetchAll();
        },
      }
    );
  };

  const handleUnenroll = (enrollmentId: number) => {
    deleteEnrollment(
      { resource: 'enrollments', id: enrollmentId },
      { onSuccess: () => { toast.success('Student unenrolled'); refetchAll(); } }
    );
  };

  const handleRegenerateCode = () => {
    updateClass(
      { resource: 'classes', id: classItem.id, values: { ...classItem, inviteCode: generateInviteCode() } },
      { onSuccess: () => { toast.success('Invite code regenerated'); refetchClass(); } }
    );
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(classItem.inviteCode);
    toast.success('Invite code copied');
  };

  return (
    <ShowView>
      <ShowViewHeader />

      <div className='flex flex-wrap items-center gap-2'>
        <h2 className='text-lg font-semibold'>{classItem.name}</h2>
        <Badge variant={classItem.status === 'active' ? 'default' : classItem.status === 'archived' ? 'destructive' : 'secondary'}>
          {classItem.status}
        </Badge>
        {classItem.subject && <Badge variant='outline'>{classItem.subject.name}</Badge>}
      </div>
      {classItem.description && <p className='text-muted-foreground'>{classItem.description}</p>}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>Invite Code</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center gap-2'>
            <Badge variant='secondary' className='text-base font-mono'>{classItem.inviteCode}</Badge>
            <Button size='icon' variant='ghost' onClick={copyInviteCode}>
              <Copy className='h-4 w-4' />
            </Button>
            <Button size='icon' variant='ghost' disabled={regenerating} onClick={handleRegenerateCode}>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>Capacity</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>{classItem.enrolledCount} / {classItem.capacity} enrolled</span>
              <Badge variant={capacityStatus === 'available' ? 'default' : capacityStatus === 'nearFull' ? 'secondary' : 'destructive'}>
                {capacityStatus === 'available' ? 'Available' : capacityStatus === 'nearFull' ? 'Nearly Full' : 'Full'}
              </Badge>
            </div>
            <Progress value={capacityPercent} className={capacityColor[capacityStatus]} />
          </CardContent>
        </Card>
      </div>

      {classItem.teacher && (
        <p className='text-sm text-muted-foreground'>
          Taught by <span className='text-foreground'>{classItem.teacher.user?.name ?? classItem.teacher.userId}</span>
        </p>
      )}

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Enrolled Students</CardTitle>
          <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
            <DialogTrigger asChild>
              <Button size='sm' disabled={atCapacity}>
                <UserPlus className='h-4 w-4' /> Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll a student</DialogTitle>
              </DialogHeader>
              <Input
                placeholder='Search students by name'
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              <div className='flex max-h-72 flex-col gap-1 overflow-y-auto'>
                {candidatesLoading && <p className='text-muted-foreground text-sm'>Searching...</p>}
                {!candidatesLoading && !candidatesResult.data.length && (
                  <p className='text-muted-foreground text-sm'>No eligible students found.</p>
                )}
                {candidatesResult.data.map((student) => (
                  <button
                    key={student.id}
                    type='button'
                    disabled={enrolling}
                    onClick={() => handleEnroll(student.id)}
                    className='flex items-center justify-between rounded-md px-2 py-2 text-left hover:bg-accent disabled:opacity-50'
                  >
                    <span>{student.user?.name ?? student.userId}</span>
                    <span className='text-muted-foreground text-xs'>{student.user?.email}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className='flex flex-col gap-1'>
          {atCapacity && (
            <p className='mb-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'>
              This class is at full capacity. Unenroll a student or increase capacity before adding more.
            </p>
          )}
          {enrollmentsLoading && <p className='text-muted-foreground text-sm'>Loading...</p>}
          {!enrollmentsLoading && !enrollmentsResult.data.length && (
            <p className='text-muted-foreground text-sm'>No students enrolled yet.</p>
          )}
          {enrollmentsResult.data.map((enrollment) => (
            <div key={enrollment.id} className='flex items-center justify-between border-b py-2 last:border-b-0'>
              <div>
                <p>{enrollment.student?.user?.name ?? enrollment.studentId}</p>
                <p className='text-muted-foreground text-xs'>{enrollment.student?.user?.email}</p>
              </div>
              <Button size='icon' variant='ghost' onClick={() => handleUnenroll(enrollment.id)}>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
