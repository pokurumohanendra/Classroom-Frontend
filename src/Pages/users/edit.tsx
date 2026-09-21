import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.nativeEnum(UserRole),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const UsersEdit = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    refineCoreProps: { resource: 'users' },
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    refineCore: { onFinish, formLoading },
    formState: { isSubmitting },
  } = form;

  const image = watch('image');
  const imageCldPubId = watch('imageCldPubId');

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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} value={field.value ?? ''} />
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
          <FormField
            control={control}
            name='emailVerified'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center gap-2'>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                </FormControl>
                <FormLabel className='mt-0!'>Email verified</FormLabel>
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
          <Button type='submit' disabled={isSubmitting || formLoading} className='w-fit'>
            Save
          </Button>
        </form>
      </Form>
    </EditView>
  );
};

export default UsersEdit;
