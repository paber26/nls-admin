const fs = require('fs');
const files = [
  'BankSoalEdit.vue',
  'BankSoalLihat.vue',
  'MonitoringTryout.vue',
  'MonitoringTryoutDetail.vue',
  'MonitoringTryoutHasil.vue',
  'Tryout.vue',
  'TryoutKelola.vue'
];

files.forEach(f => {
  let p = 'src/pages/' + f;
  let s = fs.readFileSync(p, 'utf8');

  if (s.includes('<template #header>')) return;

  let newHeader = '';

  if (f === 'BankSoalEdit.vue' || f === 'BankSoalLihat.vue') {
     let match = s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
     if (match) {
        let content = match[0];
        s = s.replace(content, '');
        newHeader = `<template #header>
      <div class="w-full flex justify-between items-center">
        <h1 class="text-lg font-semibold text-slate-800">${match[1]}</h1>
      </div>
    </template>`;
     }
  } else if (f === 'MonitoringTryoutHasil.vue') {
     let match = s.match(/<div class="flex flex-wrap items-center justify-between gap-3 mb-6">[\s\S]*?(?=^\s*<section)/m);
     if (match) {
        let content = match[0];
        s = s.replace(content, '');
        let inner = content.trim();
        inner = inner.replace(/class="([^"]*)"/, (m, c) => {
           let classes = c.split(' ').filter(x => x !== 'mb-6');
           if (!classes.includes('w-full')) classes.push('w-full');
           return `class="${classes.join(' ')}"`;
        });
        newHeader = `<template #header>\n      ${inner}\n    </template>`;
     }
  } else {
     let nextSection = '';
     if (f === 'MonitoringTryout.vue') nextSection = '<!-- Filter \\& Sorting -->';
     if (f === 'MonitoringTryoutDetail.vue') nextSection = '<!-- Toggle Section -->';
     if (f === 'Tryout.vue') nextSection = '<!-- Filter Mapel -->';
     if (f === 'TryoutKelola.vue') nextSection = '<!-- Soal dalam Tryout -->';

     if (nextSection) {
        let regex = new RegExp(`<!-- Header -->[\\s\\S]*?(?=^\\s*${nextSection})`, 'im');
        let match = s.match(regex);
        if (match) {
           let content = match[0];
           s = s.replace(content, '');
           let inner = content.replace(/<!-- Header -->/, '').trim();
           inner = inner.replace(/class="([^"]*)"/, (m, c) => {
              let classes = c.split(' ').filter(x => x !== 'mb-6');
              if (!classes.includes('w-full')) classes.push('w-full');
              return `class="${classes.join(' ')}"`;
           });
           newHeader = `<template #header>\n      ${inner}\n    </template>`;
        }
     }
  }

  if (newHeader) {
     s = s.replace(/<AppShell>/, `<AppShell>\n    ${newHeader}`);
     // clean up empty lines inside the div class="px-6 py-6"
     s = s.replace(/(<div class="px-6 py-6(?: space-y-6)?">)\s*\n\s*\n/g, '$1\n\n');
     fs.writeFileSync(p, s);
     console.log(`Fixed ${f}`);
  } else {
     console.log(`Failed to match for ${f}`);
  }
});
