import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const departmentSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(255).optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentsEdit = () => {
  const form = useForm({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: { resource: 'departments' },
  });

  const {
    handleSubmit,
    control,
    refineCore: { onFinish, formLoading },
    formState: { isSubmitting },
  } = form;

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

export default DepartmentsEdit;
