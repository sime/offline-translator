const GCS_BASE = 'https://storage.googleapis.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const gcsPath = url.pathname.replace(/^\/proxy\//, '');
  const gcsUrl = `${GCS_BASE}/${gcsPath}`;

  const response = await fetch(gcsUrl);

  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
