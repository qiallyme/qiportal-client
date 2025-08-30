import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import pkg from 'fast-glob';
const { glob } = pkg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const KB_SOURCE_DIR = path.join(__dirname, '../kb-content');
const KB_BUILD_DIR = path.join(__dirname, '../public/kb');
const CLIENT_CONFIG_FILE = path.join(__dirname, '../kb-config.json');

// Ensure build directory exists
if (!fs.existsSync(KB_BUILD_DIR)) {
  fs.mkdirSync(KB_BUILD_DIR, { recursive: true });
}

// Load client configuration
function loadClientConfig() {
  if (!fs.existsSync(CLIENT_CONFIG_FILE)) {
    console.warn('No kb-config.json found, using default configuration');
    return {
      clients: {
        'zy': {
          name: 'Default Client',
          members: ['info@qially.me', 'client1@email.com'],
          public: false
        }
      }
    };
  }
  
  try {
    return JSON.parse(fs.readFileSync(CLIENT_CONFIG_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading client configuration:', error);
    return { clients: {} };
  }
}

// Process markdown files and extract metadata
function processMarkdownFile(filePath, clientSlug) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content: markdown } = matter(content);
  
  // Extract path relative to client directory
  const relativePath = path.relative(path.join(KB_SOURCE_DIR, clientSlug), filePath);
  const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
  
  return {
    path: slug,
    title: frontmatter.title || path.basename(filePath, '.md'),
    tags: frontmatter.tags || [],
    description: frontmatter.description || '',
    date: frontmatter.date || new Date().toISOString(),
    content: markdown,
    clientSlug
  };
}

// Generate client-specific knowledge base
function generateClientKB(clientSlug, clientConfig) {
  const clientDir = path.join(KB_SOURCE_DIR, clientSlug);
  
  if (!fs.existsSync(clientDir)) {
    console.warn(`Client directory not found: ${clientDir}`);
    return [];
  }
  
  // Find all markdown files
  const markdownFiles = glob.sync('**/*.md', {
    cwd: clientDir,
    absolute: true
  });
  
  const documents = markdownFiles.map(file => processMarkdownFile(file, clientSlug));
  
  // Create client build directory
  const clientBuildDir = path.join(KB_BUILD_DIR, clientSlug);
  if (!fs.existsSync(clientBuildDir)) {
    fs.mkdirSync(clientBuildDir, { recursive: true });
  }
  
  // Generate static files for each document
  documents.forEach(doc => {
    const docDir = path.dirname(path.join(clientBuildDir, doc.path));
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }
    
    // Create HTML file
    const htmlContent = generateHTML(doc);
    const htmlPath = path.join(clientBuildDir, doc.path + '.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    // Create JSON metadata file
    const jsonPath = path.join(clientBuildDir, doc.path + '.json');
    fs.writeFileSync(jsonPath, JSON.stringify(doc, null, 2));
  });
  
  // Generate index file for client
  const indexContent = generateClientIndex(documents, clientSlug, clientConfig);
  const indexPath = path.join(clientBuildDir, 'index.html');
  fs.writeFileSync(indexPath, indexContent);
  
  // Generate search index
  const searchIndex = generateSearchIndex(documents);
  const searchIndexPath = path.join(clientBuildDir, 'search-index.json');
  fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2));
  
  return documents;
}

// Generate HTML for a document
function generateHTML(doc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title} - Knowledge Base</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/marked/marked.min.js"></script>
    <script src="https://unpkg.com/dompurify@3.0.5/dist/purify.min.js"></script>
    <style>
        .prose { max-width: none; }
        .prose h1 { font-size: 2.25rem; margin-top: 0; }
        .prose h2 { font-size: 1.875rem; }
        .prose h3 { font-size: 1.5rem; }
        .prose code { background-color: rgba(255,255,255,0.1); padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
        .prose pre { background-color: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        .prose pre code { background-color: transparent; padding: 0; }
    </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <nav class="mb-8">
            <a href="index.html" class="text-blue-400 hover:text-blue-300">← Back to Index</a>
        </nav>
        
        <article class="prose prose-invert prose-lg">
            <h1>${doc.title}</h1>
            <div class="flex gap-2 mb-6">
                ${doc.tags.map(tag => `<span class="bg-blue-600 px-2 py-1 rounded text-sm">#${tag}</span>`).join('')}
            </div>
            <div id="content"></div>
        </article>
    </div>
    
    <script>
        const content = \`${doc.content.replace(/`/g, '\\`')}\`;
        const html = DOMPurify.sanitize(marked.parse(content));
        document.getElementById('content').innerHTML = html;
    </script>
</body>
</html>`;
}

// Generate client index page
function generateClientIndex(documents, clientSlug, clientConfig) {
  const client = clientConfig.clients[clientSlug];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knowledge Base - ${client?.name || clientSlug}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/fuse.js@7.1.0/dist/fuse.min.js"></script>
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-3xl font-bold mb-2">Knowledge Base</h1>
            <p class="text-gray-400">${client?.name || clientSlug}</p>
        </header>
        
        <div class="mb-6">
            <input 
                type="text" 
                id="search" 
                placeholder="Search documents..." 
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            >
        </div>
        
        <div id="documents" class="grid gap-4">
            ${documents.map(doc => `
                <div class="document-item bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    <a href="${doc.path}.html" class="block">
                        <h3 class="text-lg font-semibold mb-2">${doc.title}</h3>
                        <p class="text-gray-400 text-sm mb-2">${doc.description}</p>
                        <div class="flex gap-2">
                            ${doc.tags.map(tag => `<span class="bg-blue-600 px-2 py-1 rounded text-xs">#${tag}</span>`).join('')}
                        </div>
                    </a>
                </div>
            `).join('')}
        </div>
    </div>
    
    <script>
        const documents = ${JSON.stringify(documents)};
        const fuse = new Fuse(documents, {
            keys: ['title', 'description', 'tags'],
            threshold: 0.3
        });
        
        const searchInput = document.getElementById('search');
        const documentsContainer = document.getElementById('documents');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const results = query ? fuse.search(query).map(r => r.item) : documents;
            
            documentsContainer.innerHTML = results.map(doc => \`
                <div class="document-item bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    <a href="\${doc.path}.html" class="block">
                        <h3 class="text-lg font-semibold mb-2">\${doc.title}</h3>
                        <p class="text-gray-400 text-sm mb-2">\${doc.description}</p>
                        <div class="flex gap-2">
                            \${doc.tags.map(tag => \`<span class="bg-blue-600 px-2 py-1 rounded text-xs">#\${tag}</span>\`).join('')}
                        </div>
                    </a>
                </div>
            \`).join('');
        });
    </script>
</body>
</html>`;
}

// Generate search index
function generateSearchIndex(documents) {
  return documents.map(doc => ({
    path: doc.path,
    title: doc.title,
    description: doc.description,
    tags: doc.tags,
    content: doc.content.substring(0, 500) // First 500 chars for search
  }));
}

// Generate access control configuration
function generateAccessControl(clientConfig) {
  const accessControl = {};
  
  Object.entries(clientConfig.clients).forEach(([clientSlug, config]) => {
    accessControl[clientSlug] = {
      members: config.members || [],
      public: config.public || false,
      name: config.name || clientSlug
    };
  });
  
  const accessControlPath = path.join(KB_BUILD_DIR, 'access-control.json');
  fs.writeFileSync(accessControlPath, JSON.stringify(accessControl, null, 2));
  
  return accessControl;
}

// Main build function
function buildKnowledgeBase() {
  console.log('Building static knowledge base...');
  
  const clientConfig = loadClientConfig();
  const accessControl = generateAccessControl(clientConfig);
  
  // Build each client's knowledge base
  Object.keys(clientConfig.clients).forEach(clientSlug => {
    console.log(`Building KB for client: ${clientSlug}`);
    const documents = generateClientKB(clientSlug, clientConfig);
    console.log(`Generated ${documents.length} documents for ${clientSlug}`);
  });
  
  // Generate main index
  const mainIndex = generateMainIndex(clientConfig);
  const mainIndexPath = path.join(KB_BUILD_DIR, 'index.html');
  fs.writeFileSync(mainIndexPath, mainIndex);
  
  console.log('Knowledge base build complete!');
  console.log(`Output directory: ${KB_BUILD_DIR}`);
}

// Generate main index page
function generateMainIndex(clientConfig) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knowledge Base Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <header class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Knowledge Base Portal</h1>
            <p class="text-gray-400">Select your organization to access the knowledge base</p>
        </header>
        
        <div class="grid gap-6 max-w-2xl mx-auto">
            ${Object.entries(clientConfig.clients).map(([slug, config]) => `
                <div class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                    <a href="${slug}/index.html" class="block">
                        <h2 class="text-xl font-semibold mb-2">${config.name || slug}</h2>
                        <p class="text-gray-400">Access the knowledge base for ${config.name || slug}</p>
                    </a>
                </div>
            `).join('')}
        </div>
        
        <div class="text-center mt-12 text-gray-500">
            <p>Access is restricted to authorized members only.</p>
        </div>
    </div>
</body>
</html>`;
}

// Run the build
buildKnowledgeBase();
