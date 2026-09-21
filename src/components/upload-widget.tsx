import { useRef, useState } from 'react';
import { useNotification } from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2, X } from 'lucide-react';
import {
  ALLOWED_TYPES,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_FILE_SIZE,
} from '@/constants';
import { kyInstance } from '@/providers/data';
import type { UploadWidgetProps } from '@/types';

const ALLOWED_FORMATS = ALLOWED_TYPES.map((type) => type.split('/')[1]);

const UploadWidget = ({ value, onChange, disabled }: UploadWidgetProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const { open } = useNotification();

  const openWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary's upload widget script hasn't loaded yet.");
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          maxFiles: 1,
          cropping: true,
          clientAllowedFormats: ALLOWED_FORMATS,
          maxFileSize: MAX_FILE_SIZE,
          sources: [
            'local',
            'url',
            'camera',
            'google_drive',
            'dropbox',
            'shutterstock',
            'gettyimages',
            'istock',
            'unsplash',
          ],
        },
        (error, result) => {
          if (error) {
            setIsUploading(false);
            console.error(error);
            return;
          }

          if (result.event === 'upload-added') {
            setIsUploading(true);
          }

          if (result.event === 'success') {
            setIsUploading(false);
            onChange?.({
              url: result.info.secure_url,
              publicId: result.info.public_id,
              deleteToken: result.info.delete_token,
            });
          }

          if (result.event === 'close' || result.event === 'abort') {
            setIsUploading(false);
          }
        }
      );
    }

    widgetRef.current.open();
  };

  const handleRemove = async () => {
    if (!value) return;
    setIsRemoving(true);

    try {
      if (value.deleteToken) {
        // Fresh upload (still within Cloudinary's ~10 min delete_token
        // window) — delete straight from the browser, no backend needed.
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: value.deleteToken }),
          }
        );
        if (!response.ok) throw new Error('delete_by_token request failed');
      } else {
        // Already-saved image (e.g. editing an existing record) — the
        // delete_token has long expired, so ask the backend to remove it
        // via the Cloudinary Admin API instead.
        const response = await kyInstance.post('uploads/delete', {
          json: { publicId: value.publicId },
        });
        if (!response.ok) throw new Error('Server-side delete request failed');
      }

      onChange?.(null);
    } catch (error) {
      console.error(error);
      open?.({
        type: 'error',
        message: 'Failed to remove image',
        description: 'The image could not be deleted from Cloudinary. Please try again.',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className='flex items-center gap-4'>
      {value?.url && (
        <div className='relative'>
          <img
            src={value.url}
            alt='Uploaded'
            className='h-24 w-24 rounded-md border object-cover'
          />
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute -top-2 -right-2 h-6 w-6'
            onClick={handleRemove}
            disabled={disabled || isRemoving}
          >
            {isRemoving ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <X className='h-3 w-3' />
            )}
          </Button>
        </div>
      )}
      <Button
        type='button'
        variant='outline'
        onClick={openWidget}
        disabled={disabled || isUploading || isRemoving}
      >
        {isUploading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <ImagePlus className='h-4 w-4' />
        )}
        {value?.url ? 'Change image' : 'Upload image'}
      </Button>
    </div>
  );
};

export default UploadWidget;
