import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Student } from '@/types';

const enrollmentSchema = z.object({
  classId: z.number({ message: 'Class is required' }),
  studentId: z.number({ message: 'Student is required' }),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

const EnrollmentsEdit = () => {
  const form = useForm({
    resolver: zodResolver(enrollmentSchema),
    refineCoreProps: { resource: 'enrollments' },
  });

  const {
    handleSubmit,
    control,
    refineCore: { onFinish, formLoading, query },
    formState: { isSubmitting },
  } = form;

  const record = query?.data?.data;

  const { options: classOptions } = useSelect({
    resource: 'classes',
    optionLabel: 'name',
    optionValue: 'id',
    defaultValue: record?.classId,
  });

  const { options: studentOptions } = useSelect<Student>({
    resource: 'students',
    optionLabel: (item) => item.user?.name ?? item.userId,
    optionValue: 'id',
    defaultValue: record?.studentId,
  });

  return (
    <EditView>
      <EditViewHeader />
      <Form {...form}>
        <form
          className='flex flex-col gap-4 max-w-lg'
          onSubmit={handleSubmit((values) => onFinish(values))}
        >
          <FormField
            control={control}
            name='classId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a class' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='studentId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a student' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {studentOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isSubmitting || formLoading} className='w-fit'>
            Save
          </Button>
        </form>
      </Form>
    </EditView>
  );
};

export default EnrollmentsEdit;
