# Static Knowledge Base System

This is a static knowledge base system built with Quartz-inspired architecture that provides secure, fast, and user-specific access to organizational knowledge bases.

## Features

- **Static Generation**: Pre-built HTML files for fast loading
- **Access Control**: Users can only see knowledge bases they are members of
- **Search Functionality**: Client-side search with Fuse.js
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Responsive Design**: Works on desktop and mobile devices
- **Multi-Client Support**: Separate knowledge bases for different organizations

## Architecture

### File Structure
```
kb-content/           # Source markdown files
├── zy/              # Client organization folder
│   ├── getting-started.md
│   └── process-optimization.md
├── client-a/        # Another client
│   └── ...
└── client-b/
    └── ...

public/kb/           # Generated static files
├── access-control.json
├── index.html       # Main portal
├── zy/             # Client-specific KB
│   ├── index.html
│   ├── search-index.json
│   ├── getting-started.html
│   ├── getting-started.json
│   └── ...
└── ...

kb-config.json       # Configuration file
scripts/build-kb.js  # Build script
```

### Access Control

The system uses a configuration-based access control system:

1. **Client Configuration**: Defined in `kb-config.json`
2. **User Membership**: Users are assigned to specific clients
3. **Admin Access**: Admins can access all knowledge bases
4. **Static Verification**: Access is checked at build time and runtime

## Setup

### 1. Install Dependencies

The build script uses these packages (already in package.json):
- `gray-matter`: Parse frontmatter
- `fast-glob`: File globbing
- `mime`: MIME type detection

### 2. Configure Clients

Edit `kb-config.json` to define your clients:

```json
{
  "clients": {
    "client-slug": {
      "name": "Client Name",
      "members": ["user@example.com", "admin@example.com"],
      "public": false,
      "description": "Client description"
    }
  },
  "global": {
    "admins": ["admin@qially.me"],
    "defaultClient": "zy"
  }
}
```

### 3. Add Content

Create markdown files in `kb-content/{client-slug}/` with frontmatter:

```markdown
---
title: Document Title
tags: [tag1, tag2]
description: Document description
date: 2024-01-15
---

# Content here
```

### 4. Build Knowledge Base

```bash
# Build only knowledge base
npm run build:kb

# Build knowledge base and main app
npm run build:all
```

## Usage

### For Users

1. **Access**: Navigate to `/kb` in the main application
2. **Select Organization**: Choose from available knowledge bases
3. **Browse**: Use the generated static site with search and navigation
4. **Search**: Use the search bar to find specific content

### For Administrators

1. **Add Content**: Place markdown files in appropriate client folders
2. **Update Configuration**: Modify `kb-config.json` for new clients/users
3. **Rebuild**: Run `npm run build:kb` to regenerate static files
4. **Deploy**: Upload the `public/kb/` folder to your web server

## Security

### Access Control Features

- **User Verification**: Checks user email against client membership
- **Admin Override**: Admins can access all knowledge bases
- **Static Generation**: No server-side processing required
- **Client Isolation**: Users can only see their assigned knowledge bases

### Security Best Practices

1. **Regular Updates**: Keep the access control configuration current
2. **User Management**: Remove access when users leave organizations
3. **Audit Logs**: Monitor access patterns (can be added to the system)
4. **HTTPS**: Always serve over HTTPS in production

## Customization

### Styling

The generated HTML uses Tailwind CSS. You can customize:

1. **Colors**: Modify the color classes in the build script
2. **Layout**: Adjust the HTML structure in `generateHTML()` and `generateClientIndex()`
3. **Typography**: Change prose classes and custom CSS

### Features

You can extend the system by:

1. **Adding Plugins**: Integrate with external services
2. **Custom Search**: Implement server-side search
3. **Analytics**: Add tracking and usage analytics
4. **Versioning**: Add document version control

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are installed
2. **Access Denied**: Verify user email is in client configuration
3. **Missing Content**: Ensure markdown files have proper frontmatter
4. **Search Not Working**: Check that search-index.json was generated

### Debug Mode

Enable debug logging in the build script:

```javascript
// Add to build-kb.js
const DEBUG = true;
if (DEBUG) console.log('Debug info:', data);
```

## Performance

### Optimization Features

- **Static Files**: No server-side rendering required
- **CDN Ready**: Can be served from any static file server
- **Minimal JavaScript**: Only search functionality requires JS
- **Caching**: Static files can be aggressively cached

### Performance Tips

1. **Image Optimization**: Compress images before adding to content
2. **Content Splitting**: Break large documents into smaller ones
3. **Lazy Loading**: Consider implementing for large knowledge bases
4. **CDN**: Use a CDN for global distribution

## Integration

### With Existing Systems

The knowledge base can integrate with:

1. **Authentication**: Uses existing Supabase auth
2. **User Management**: Leverages existing user profiles
3. **Navigation**: Integrates with main application navigation
4. **Styling**: Matches existing design system

### API Integration

The system provides these APIs:

- `getUserClients()`: Get user's accessible clients
- `checkClientAccess()`: Verify access to specific client
- `getClientKBIndex()`: Get client's document index
- `searchClientDocuments()`: Search within client's documents

## Deployment

### Production Deployment

1. **Build**: Run `npm run build:all`
2. **Upload**: Deploy `dist/` folder to your web server
3. **Configure**: Set up proper routing for `/kb/*` paths
4. **Test**: Verify access control works correctly

### CI/CD Integration

Add to your deployment pipeline:

```yaml
# Example GitHub Actions
- name: Build Knowledge Base
  run: npm run build:kb

- name: Build Application
  run: npm run build

- name: Deploy
  run: # your deployment commands
```

## Support

For issues and questions:

1. **Documentation**: Check this README and inline code comments
2. **Configuration**: Verify `kb-config.json` settings
3. **Build Logs**: Check console output during build process
4. **Access Control**: Verify user permissions and client assignments

---

*This knowledge base system is designed to be secure, fast, and user-friendly while maintaining the simplicity of static file generation.*
