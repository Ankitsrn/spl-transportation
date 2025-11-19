import fs from 'fs/promises';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data', 'routes.json');

async function readFileSafe() {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      await fs.writeFile(FILE_PATH, '[]', 'utf8');
      return [];
    }
    throw err;
  }
}

export async function getRoutes() {
  return (await readFileSafe()) as any[];
}

export async function saveRoutes(routes: any[]) {
  await fs.writeFile(FILE_PATH, JSON.stringify(routes, null, 2), 'utf8');
  return routes;
}

export async function addRoute(route: any) {
  const routes = await readFileSafe();
  const nextId = routes.length ? Math.max(...routes.map((r: any) => r.id)) + 1 : 1;
  const newRoute = { ...route, id: nextId };
  routes.push(newRoute);
  await saveRoutes(routes);
  return newRoute;
}

export async function updateRoute(id: number, patch: Partial<any>) {
  const routes = await readFileSafe();
  const idx = routes.findIndex((r: any) => r.id === id);
  if (idx === -1) return null;
  routes[idx] = { ...routes[idx], ...patch };
  await saveRoutes(routes);
  return routes[idx];
}

export async function deleteRoute(id: number) {
  const routes = await readFileSafe();
  const filtered = routes.filter((r: any) => r.id !== id);
  if (filtered.length === routes.length) return false;
  await saveRoutes(filtered);
  return true;
}