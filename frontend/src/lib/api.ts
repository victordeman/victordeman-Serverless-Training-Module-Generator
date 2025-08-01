export async function uploadVideo(file: File, moduleId: string) {
  const response = await fetch('https://<api-gateway-url>/modules/upload', {
    method: 'POST',
    body: JSON.stringify({ moduleId })
  });
  return response.json();
}

export async function saveMetadata(data: {
  moduleId: string;
  title: string;
  description: string;
  language: string;
}) {
  const response = await fetch('https://<api-gateway-url>/modules', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function getModules() {
  const response = await fetch('https://<api-gateway-url>/modules');
  return response.json();
}

export async function trackAnalytics(moduleId: string, action: 'view' | 'complete') {
  const response = await fetch(`https://<api-gateway-url>/modules/${moduleId}/analytics`, {
    method: 'POST',
    body: JSON.stringify({ action })
  });
  return response.json();
}
