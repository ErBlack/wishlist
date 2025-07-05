import https from 'https';
import yaml from 'yaml';
import fs from 'fs';
import { promisify } from 'util';
import { extname } from 'path';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const FILE = 'src/_data/wishlist.yml';
const OUTPUT_DIR = 'src/img';

async function task() {
    const listContent = await readFile(FILE, 'UTF-8');

    const { items, ...rest } = yaml.parse(listContent);

    const newItems = await Promise.all(
        items.map(async ({ src, name, ...rest }) => {
            if (src.indexOf('http') === 0) {
                const ext = extname(new URL(src).pathname) || '.jpg';
                const filename = name.toLowerCase().replace(/ /gi, '-').replace(/:/gi, '');
                const destPath = `${OUTPUT_DIR}/${filename}${ext}`;

                const result = await new Promise(function (resolve, reject) {
                    const file = fs.createWriteStream(destPath);
                    const request = https.get(src, response => {
                        response.pipe(file);
                        response.on('end', () => resolve(true));
                    });
                });

                if (result) {
                    src = destPath;
                }
            }

            return {
                ...rest,
                name,
                src,
            };
        })
    );

    await writeFile(
        FILE,
        yaml.stringify({
            ...rest,
            items: newItems,
        })
    );
}

task();
