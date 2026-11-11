const query = `*[_type == "project"] | order(year desc, title asc, _id asc) {
  "id": _id,
  title,
  "type": projectType->title,
  year,
  client,
  description,
  credits,
  "images": images[]{alt, "url": asset->url}
}`;

function projectImage(image, {projectId, dataset}) {
  if (typeof image?.url !== 'string') return null;
  const prefix = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;
  if (!image.url.startsWith(prefix)) return null;
  const url = new URL(image.url);
  url.search = new URLSearchParams({auto: 'format', fit: 'max', w: '1400'});
  const full = url.href;
  url.searchParams.set('w', '240');
  return {url: full, preview: url.href, alt: image.alt?.trim() || ''};
}

export async function loadSanityProjects(config) {
  const {projectId, dataset} = config;
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) {
    throw new Error('Configuración inválida de Sanity.');
  }

  const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.search = new URLSearchParams({query, perspective: 'published'});
  const response = await fetch(url, {credentials: 'omit', signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error(`Sanity respondió con HTTP ${response.status}.`);

  const {result} = await response.json();
  if (!Array.isArray(result)) throw new Error('Sanity devolvió una respuesta inesperada.');
  return result.flatMap(project => {
    const title = project.title?.trim();
    const type = project.type?.trim();
    const images = (project.images ?? []).map(image => projectImage(image, config)).filter(Boolean);
    if (!title || !type || !Number.isInteger(project.year) || !images.length) return [];
    return [{
      ...project,
      title,
      type,
      images,
      client: project.client?.trim() || '',
      description: project.description?.trim() || '',
      credits: project.credits?.trim() || '',
    }];
  });
}
