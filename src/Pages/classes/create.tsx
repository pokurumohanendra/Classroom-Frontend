import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from '@refinedev/react-hook-form';
import { useSelect } from '@refinedev/core';
import { CreateView, CreateViewHeader } from '@/components/refine-ui/views/create-view';
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
import { Label } from '@/components/ui/label';
import UploadWidget from '@/components/upload-widget';
import type { Teacher } from '@/types';

const classSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  inviteCode: z.string().min(1, 'Invite code is required').max(20),
  subjectId: z.number({ message: 'Subject is required' }),
  teacherId: z.number({ message: 'Teacher is required' }),
  description: z.string().max(255).optional(),
  capacity: z.coerce.number().min(1).default(50),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  bannerUrl: z.string().optional(),
  bannerCldPubId: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

const ClassesCreate = () => {
  const form = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      inviteCode: '',
      description: '',
      capacity: 50,
      status: 'active',
      bannerUrl: '',
      bannerCldPubId: '',
    },
    refineCoreProps: { resource: 'classes' },
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    refineCore: { onFinish },
    formState: { isSubmitting },
  } = form;

  const bannerUrl = watch('bannerUrl');
  const bannerCldPubId = watch('bannerCldPubId');

  const { options: subjectOptions } = useSelect({
    resource: 'subjects',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const { options: teacherOptions } = useSelect<Teacher>({
    resource: 'teachers',
    optionLabel: (item) => item.user?.name ?? item.userId,
    optionValue: 'id',
  });

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
            name='inviteCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='subjectId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a subject' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjectOptions.map((option) => (
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
            name='teacherId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a teacher' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teacherOptions.map((option) => (
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
            name='capacity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-col gap-2'>
            <Label>Banner image</Label>
            <UploadWidget
              value={bannerUrl ? { url: bannerUrl, publicId: bannerCldPubId ?? '' } : null}
              onChange={(next) => {
                setValue('bannerUrl', next?.url ?? '');
                setValue('bannerCldPubId', next?.publicId ?? '');
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

export default ClassesCreate;
