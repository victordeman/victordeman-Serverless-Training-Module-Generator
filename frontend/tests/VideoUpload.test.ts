import { render, fireEvent } from '@testing-library/svelte';
import VideoUpload from '../src/lib/components/VideoUpload.svelte';

test('displays progress bar on valid video drop', async () => {
  const { getByText, getByRole } = render(VideoUpload);
  const dropZone = getByText('Drop video here (MP4, AVI, etc.)');
  await fireEvent.drop(dropZone, {
    dataTransfer: { files: [new File([''], 'test.mp4', { type: 'video/mp4' })] }
  });
  expect(getByRole('progress')).toBeInTheDocument();
});
