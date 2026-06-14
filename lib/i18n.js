const id = {
  'home.subtitle': 'spirit menggembira piala dunia, menggelora kakinya ada dua, tangannya ada dua, sportifitasmu kau jaga brader',
  'home.cta': 'Buat Drawing Pildun 2026 🌍',

  'draw.title': 'Undian Piala Dunia 2026',
  'draw.selecting': 'Mengundi...',
  'draw.team_selected': 'Tim ke-{count} terpilih...',
  'draw.friend_got_teams': '{friend} mendapat {count} tim! 🎉',
  'draw.draw_complete': 'Undian selesai! 🎉',
  'draw.ready': 'Siap...',
  'draw.click_to_start': 'Klik Mulai untuk mengundi',
  'draw.start_button': 'Mulai Undian ⚽',
  'draw.turn': 'Giliran: {friend}',
  'draw.group': 'Grup {group}',

  'results.title': 'Hasil Undian!',
  'results.teams_count': '{count} tim',
  'results.participants_info': '{friends} peserta — {teams} tim',
  'results.copy_link': 'Salin Link Undian',
  'results.link_copied': '✓ Link Tersalin!',
  'results.create_new': 'Buat Undian Pildun 2026 🌍',
  'results.view_all': 'Lihat semua hasil',

  'setup.title': 'Buat Drawing Pildun 2026 🌍',
  'setup.description': 'Atur peserta dan tim yang akan diundi pun dirinya itu. Jumlah tim yang dipegang akan dibagi secara merata.',
  'setup.participants': 'Peserta ({count})',
  'setup.name_placeholder': 'Nama teman, pisah dengan koma (contoh: roy, joni, budi)',
  'setup.add_button': 'Tambah',
  'setup.each_gets': 'Setiap peserta dapat {count} tim',
  'setup.recycled_info': '({count} tim akan dipilih ulang)',
  'setup.teams': 'Tim ({selected}/{total})',
  'setup.select_all': 'Pilih Semua',
  'setup.deselect_all': 'Hapus Semua',
  'setup.min_participants': 'Tambah minimal 2 peserta',
  'setup.min_teams': 'Pilih minimal 2 tim',
  'setup.not_enough_teams': 'Jumlah tim ({selected}) harus ≥ jumlah peserta ({friends})',
  'setup.start_draw': 'Mulai Undian ⚽',

  'story.generating': 'Membuat...',
  'story.share': 'Bagikan',
  'story.support': 'mendukung sepenuh hati',
  'story.scan': 'Scan',
  'story.scan_subtitle': 'untuk bikin juga',
}

const en = {
  'home.subtitle': 'spirit of the world cup, his feet are two, his hands are two, keep your sportsmanship bro',
  'home.cta': 'Make World Cup 2026 Draw 🌍',

  'draw.title': 'World Cup 2026 Draw',
  'draw.selecting': 'Drawing...',
  'draw.team_selected': 'Team #{count} selected...',
  'draw.friend_got_teams': '{friend} got {count} teams! 🎉',
  'draw.draw_complete': 'Draw complete! 🎉',
  'draw.ready': 'Ready...',
  'draw.click_to_start': 'Click Start to draw',
  'draw.start_button': 'Start Draw ⚽',
  'draw.turn': 'Turn: {friend}',
  'draw.group': 'Group {group}',

  'results.title': 'Draw Results!',
  'results.teams_count': '{count} teams',
  'results.participants_info': '{friends} participants — {teams} teams',
  'results.copy_link': 'Copy Draw Link',
  'results.link_copied': '✓ Link Copied!',
  'results.create_new': 'Create World Cup 2026 Draw 🌍',
  'results.view_all': 'View all results',

  'setup.title': 'Create World Cup 2026 Draw 🌍',
  'setup.description': 'Set up participants and teams for the draw. Teams will be distributed evenly.',
  'setup.participants': 'Participants ({count})',
  'setup.name_placeholder': 'Friend names, separated by commas (e.g. roy, joni, budi)',
  'setup.add_button': 'Add',
  'setup.each_gets': 'Each participant gets {count} teams',
  'setup.recycled_info': '({count} teams will be re-picked)',
  'setup.teams': 'Teams ({selected}/{total})',
  'setup.select_all': 'Select All',
  'setup.deselect_all': 'Deselect All',
  'setup.min_participants': 'Add at least 2 participants',
  'setup.min_teams': 'Select at least 2 teams',
  'setup.not_enough_teams': 'Number of teams ({selected}) must be ≥ number of participants ({friends})',
  'setup.start_draw': 'Start Draw ⚽',

  'story.generating': 'Generating...',
  'story.share': 'Share',
  'story.support': 'fully supporting',
  'story.scan': 'Scan',
  'story.scan_subtitle': 'to create yours',
}

const locales = { id, en }

export function t(locale, key, params = {}) {
  const str = locales[locale]?.[key] || locales.id[key] || key
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
}

export const LANGS = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
]
