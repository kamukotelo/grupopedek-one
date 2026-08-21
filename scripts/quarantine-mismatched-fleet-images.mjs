import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const quarantine = {
  'chery-tiggo-2': ['01-front.webp', '02-front.webp', '03-front.webp', '04-front.webp'],
  'hyundai-creta': ['01-front.webp', '02-front.webp'],
  'mercedes-brabus': ['01-front.webp', '02-front.webp', '03-rear.webp', '04-rear.webp'],
  'mercedes-cls63': ['01-front.webp'],
  'mercedes-g63': ['04-rear.webp'],
  'mercedes-g63-2023': ['03-front.webp', '04-exterior.webp'],
  'mercedes-sprinter-atual': ['03-front.webp', '04-front.webp'],
  'mitsubishi-canter': ['02-front.webp', '03-front.webp', '04-front.webp'],
  'mitsubishi-l200': ['01-front.webp', '02-rear.webp', '03-exterior.webp'],
  'range-rover': ['01-front.webp', '02-front.webp', '03-front.webp', '04-front.webp'],
  'suzuki-swift': ['01-front.webp', '02-front.webp', '03-rear.webp'],
  'toyota-fortuner-2023': ['01-front.webp', '02-front.webp', '03-front.webp'],
  'toyota-fortuner-atual': ['01-front.webp', '02-front.webp', '03-front.webp'],
  'toyota-hiace': ['01-front.webp', '02-front.webp', '03-front.webp', '04-front.webp'],
  'toyota-lc-hz': ['04-front.webp'],
  'toyota-lc-hz-18p': ['01-exterior.webp', '02-exterior.webp', '03-exterior.webp'],
  'toyota-starlet': ['01-front.webp', '02-exterior.webp', '03-exterior.webp', '04-exterior.webp']
};

let moved = 0;
for (const [vehicleId, files] of Object.entries(quarantine)) {
  const destination = path.join(root, 'work/fleet-carousel-quarantine', vehicleId);
  await fs.mkdir(destination, { recursive: true });
  for (const file of files) {
    const source = path.join(root, 'public/fleet-carousel', vehicleId, file);
    try {
      await fs.rename(source, path.join(destination, file));
      moved += 1;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

await fs.writeFile(
  path.join(root, 'work/fleet-carousel-quarantine/README.md'),
  '# Imagens em quarentena\n\nImagens removidas do catálogo público por modelo, geração, emblema ou utilização incorretos. A operação é reversível; os ficheiros não foram apagados.\n'
);
console.log(`${moved} imagens movidas para quarentena.`);
