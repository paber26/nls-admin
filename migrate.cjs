const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

let count = 0;

files.forEach(file => {
  const p = path.join(dir, file);
  let s = fs.readFileSync(p, 'utf8');

  // Skip files that don't need migration
  if (!s.includes('<Sidebar') && !s.includes('Sidebar />')) return;

  // Insert import if needed
  if (!s.includes('AppShell.vue')) {
    s = s.replace(/<script setup>/, '<script setup>\nimport AppShell from "@/components/layout/AppShell.vue"');
  }

  // 1. Strip the outer legacy bg-bgsoft wrappers ONLY if they exist
  if (/<template>\s*<body[^>]*bg-bgsoft/i.test(s)) {
    s = s.replace(/<template>\s*<body[^>]*bg-bgsoft[^>]*>/i, '<template>\n');
    // Remove $ anchor so it works when there's a script block below
    s = s.replace(/<\/body>\s*<\/template>/i, '\n</template>');
  } else if (/<template>\s*<div[^>]*bg-bgsoft/i.test(s)) {
    s = s.replace(/<template>\s*<div[^>]*bg-bgsoft[^>]*>/i, '<template>\n');
    s = s.replace(/<\/div>\s*<\/template>/i, '\n</template>');
  }

  // 2. Main migration regex: replaces flex min-h-screen (if not already stripped), Sidebar, and main
  const regex = /(?:<div[^>]*class="[^"]*(?:flex[\s]+min-h-screen)[^"]*"[^>]*>\s*)?(?:<!--.*?-->\s*)?<Sidebar[^>]*?(?:\/>|><\/Sidebar>)\s*(?:<!--.*?-->\s*)?<main([^>]*)>([\s\S]*?)<\/main>\s*(<\/div>)?/i;
  
  let match = s.match(regex);
  if (match) {
    let mainAttrs = match[1] || '';
    let mainInner = match[2];
    
    // Extract main classes to preserve any padding/margin added directly to <main>
    let classMatch = mainAttrs.match(/class="([^"]*)"/);
    let extraClasses = '';
    if (classMatch) {
      let classes = classMatch[1].split(' ');
      classes = classes.filter(c => c !== 'flex-1'); // AppShell handles its own flex
      extraClasses = classes.join(' ').trim();
    }

    let headerMatch = mainInner.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    let newBlock = '';
    
    if (headerMatch) {
      let headerContent = headerMatch[1];
      mainInner = mainInner.replace(headerMatch[0], '');
      
      // If there were extra classes on <main>, we wrap the content below header
      if (extraClasses) {
        mainInner = `\n    <div class="${extraClasses}">\n${mainInner}\n    </div>`;
      }
      
      newBlock = `<AppShell>\n    <template #header>\n      <div>${headerContent}      </div>\n    </template>\n${mainInner}  </AppShell>`;
    } else {
      if (extraClasses) {
        mainInner = `\n    <div class="${extraClasses}">\n${mainInner}\n    </div>`;
      }
      newBlock = `<AppShell>\n${mainInner}  </AppShell>`;
    }
    
    s = s.replace(match[0], newBlock);
    
    fs.writeFileSync(p, s, 'utf8');
    console.log('Successfully fixed:', file);
    count++;
  }
});

console.log('Total fixed:', count);
