import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const subjectSchema = z.object({
  departmentId: z.number({ message: 'Department is required' }),
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(50),
  description: z.string().max(255).optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

const SubjectsEdit = () => {
  const form = useForm({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: { resource: 'subjects' },
  });

  const {
    handleSubmit,
    control,
    refineCore: { onFinish, formLoading, query },
    formState: { isSubmitting },
  } = form;

  const { options: departmentOptions } = useSelect({
    resource: 'departments',
    optionLabel: 'name',
    optionValue: 'id',
    defaultValue: query?.data?.data?.departmentId,
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
            name='departmentId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a department' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departmentOptions.map((option) => (
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
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ''} />
                </FormControl>
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

export default SubjectsEdit;
