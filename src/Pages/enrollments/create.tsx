import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
import { CreateView, CreateViewHeader } from '@/components/refine-ui/views/create-view';
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

const enrollmentSchema = z.object({
  classId: z.number({ message: 'Class is required' }),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

const EnrollmentsCreate = () => {
  const form = useForm({
    resolver: zodResolver(enrollmentSchema),
    refineCoreProps: { resource: 'enrollments' },
  });

  const {
    handleSubmit,
    control,
    refineCore: { onFinish },
    formState: { isSubmitting },
  } = form;

  const { options: classOptions } = useSelect({
    resource: 'classes',
    optionLabel: 'name',
    optionValue: 'id',
  });

  return (
    <CreateView>
      <CreateViewHeader />
      <p className='text-sm text-muted-foreground -mt-2'>
        Enrolls the currently signed-in account into the selected class (the API takes the
        student from your session, not a chosen user).
      </p>
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
          <Button type='submit' disabled={isSubmitting} className='w-fit'>
            Save
          </Button>
        </form>
      </Form>
    </CreateView>
  );
};

export default EnrollmentsCreate;
