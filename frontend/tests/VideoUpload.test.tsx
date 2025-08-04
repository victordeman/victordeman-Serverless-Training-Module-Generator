import { render, fireEvent, waitFor } from '@testing-library/react';
import VideoUpload from '../src/components/VideoUpload';

test('displays progress bar on valid video drop', async () => {
  const onUpload = vi.fn();
  const { getByText, getByRole } = render(<VideoUpload onUpload={onUpload} />);
  const dropZone = getByText('Drop video here (MP4, AVI, etc.)');

  // Simulate the drop event
  await fireEvent.drop(dropZone, {
    dataTransfer: { files: [new File([''], 'test.mp4', { type: 'video/mp4' })] }
  });

  // Wait for the progress bar to appear
  await waitFor(() => {
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  }, { timeout: 1000 });
});
