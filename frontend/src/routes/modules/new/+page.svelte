<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { z } from 'zod';
  import VideoUpload from '/components/VideoUpload.svelte';
  import { uploadVideo } from '/api';

  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    language: z.enum(['en', 'es', 'fr'])
  });

  const { form, errors, enhance } = superForm({ schema });

  async function handleUpload(event: CustomEvent) {
    const { file } = event.detail;
    try {
      const moduleId = crypto.randomUUID();
      const response = await uploadVideo(file, moduleId);
      if (response.presignedUrl) {
        await fetch(response.presignedUrl, { method: 'PUT', body: file });
        alert('Video uploaded successfully!');
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  }
</script>

<form use:enhance method="POST">
  <VideoUpload on:upload={handleUpload} />
  <label>
    Title: <input type="text" bind:value={.title} />
    {#if .title}<span class="error">{.title}</span>{/if}
  </label>
  <label>
    Description: <textarea bind:value={.description}></textarea>
    {#if .description}<span class="error">{.description}</span>{/if}
  </label>
  <label>
    Language:
    <select bind:value={.language}>
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
    </select>
  </label>
  <button type="submit">Save</button>
</form>

<style>
  .error { color: red; }
</style>
