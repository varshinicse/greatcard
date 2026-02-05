
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public/templates');
const OUTPUT_FILE = path.resolve(PUBLIC_DIR, 'templates.json');

console.log(`Scanning templates in: ${PUBLIC_DIR}`);

// Schema: Record<category, TemplateItem[]>
const templateRegistry = {};

function scanTemplates() {
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error(`Directory not found: ${PUBLIC_DIR}`);
        return;
    }

    const categories = fs.readdirSync(PUBLIC_DIR).filter(item => {
        const fullPath = path.join(PUBLIC_DIR, item);
        return fs.statSync(fullPath).isDirectory();
    });

    categories.forEach(category => {
        console.log(`Processing category: ${category}`);
        templateRegistry[category] = [];
        const categoryPath = path.join(PUBLIC_DIR, category);
        const items = fs.readdirSync(categoryPath);

        items.forEach(item => {
            const itemPath = path.join(categoryPath, item);
            const stats = fs.statSync(itemPath);

            // Case 1: Structured Template (Folder)
            if (stats.isDirectory()) {
                const metaFile = path.join(itemPath, 'template.json');
                if (fs.existsSync(metaFile)) {
                    try {
                        const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
                        // Validate mandatory fields
                        if (meta.id && meta.name) {
                            // Ensure path is relative for frontend
                            // New Structure: path points to the FOLDER or the JSON?
                            // Frontend expects 'path' to effectively be the template root or preview?
                            // Let's set 'path' to the preview image as default, but add 'templatePath'

                            // Check for preview
                            const previewFile = ['preview.png', 'preview.jpg'].find(f => fs.existsSync(path.join(itemPath, f)));
                            const bgFile = ['background.png', 'background.jpg'].find(f => fs.existsSync(path.join(itemPath, f)));

                            const relativePath = `/templates/${category}/${item}`;

                            templateRegistry[category].push({
                                ...meta,
                                category: category, // Enforce folder category
                                path: previewFile ? `${relativePath}/${previewFile}` : '', // Legacy compat
                                previewImage: previewFile ? `${relativePath}/${previewFile}` : '',
                                backgroundImage: bgFile ? `${relativePath}/${bgFile}` : '',
                                templatePath: relativePath // Path to folder
                            });
                        }
                    } catch (e) {
                        console.warn(`Error parsing ${metaFile}:`, e);
                    }
                }
            }
            // Case 2: Legacy Template (Image File)
            // Only process if it's an image and NOT a preview/bg of a structured template (which shouldn't happen if they are files in root of category)
            else if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
                // exclude system files if any
                const name = path.parse(item).name;
                const relativePath = `/templates/${category}/${item}`;

                // Construct a partial object
                templateRegistry[category].push({
                    id: `${category}_${name}`,
                    name: name.replace(/[-_]/g, ' '),
                    category: category,
                    path: relativePath,
                    // Default values for legacy
                    orientation: 'Portrait',
                    type: 'legacy'
                });
            }
        });
    });

    // Write output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(templateRegistry, null, 2));
    console.log(`Wrote registry to ${OUTPUT_FILE}`);
}

scanTemplates();
