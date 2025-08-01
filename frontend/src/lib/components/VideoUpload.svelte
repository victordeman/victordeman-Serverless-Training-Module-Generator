<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let progress = 0;
  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('video/')) {
      dispatch('upload', { file });
      const interval = setInterval(() => {
        progress = Math.min(progress + 10, 100);
        if (progress === 100) clearInterval(interval);
      }, 500);
    }
  }
</script>

<div on:dragover|preventDefault on:drop={handleDrop} class="drop-zone">
  <p>Drop video here (MP4, AVI, etc.)</p>
  {#if progress > 0}
    <progress value={progress} max="100">{progress}%</progress>
  {/if}
</div>

<style>
  .drop-zone {
    border: 2px dashed #ccc;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
  }
</style>
