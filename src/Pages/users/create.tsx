import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { CreateView, CreateViewHeader } from '@/components/refine-ui/views/create-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import UploadWidget from '@/components/upload-widget';

const userSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.nativeEnum(UserRole),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const UsersCreate = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      role: UserRole.STUDENT,
      image: '',
      imageCldPubId: '',
    },
    refineCoreProps: { resource: 'users' },
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    refineCore: { onFinish },
    formState: { isSubmitting },
  } = form;

  const image = watch('image');
  const imageCldPubId = watch('imageCldPubId');

  return (
    <CreateView>
      <CreateViewHeader />
      <Form {...form}>
        <form
          className='flex flex-col gap-4 max-w-lg'
          onSubmit={handleSubmit((values) => onFinish(values))}
        >
          <FormField
            control={control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                    <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col gap-2'>
            <Label>Profile image</Label>
            <UploadWidget
              value={image ? { url: image, publicId: imageCldPubId ?? '' } : null}
              onChange={(next) => {
                setValue('image', next?.url ?? '');
                setValue('imageCldPubId', next?.publicId ?? '');
              }}
            />
          </div>
          <Button type='submit' disabled={isSubmitting} className='w-fit'>
            Save
          </Button>
        </form>
      </Form>
    </CreateView>
  );
};

export default UsersCreate;
