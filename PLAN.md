# dundunpildun 🏆

Aplikasi web untuk *random draw* tim Piala Dunia 2026 — bagi 48 tim secara fair ke teman-temanmu. Hasil draw bisa di-share via link, tanpa perlu akun.

## Tech Stack

- **Next.js 15 (App Router)**
- **React (JavaScript)**
- **Tailwind CSS**
- **No backend** — semua state di-encode ke URL hash

## Pages

| Route | File | Deskripsi |
|---|---|---|
| `/` | `app/page.js` | "Buat Undian Baru" |
| `/setup` | `app/setup/page.js` | Tambah nama teman + pilih tim pool |
| `/draw` | `app/draw/page.js` | Roulette reveal + flag grid |
| `/results` | `app/results/page.js` | Ringkasan hasil, bisa di-share |

## Flow

1. **Admin** buka `/setup` → masukin nama teman → pilih tim (default: semua 48)
2. Klik "Mulai Undian" → masuk `/draw`
3. **Roulette 🎰**: flag berputar cepat, makin lambat, berhenti di satu tim
4. Tim yang terpilih langsung kegelap di grid bawah
5. Giliran teman selanjutnya otomatis
6. Ulang sampai semua 48 tim terdistribusi
7. **Results page**: masing-masing teman lihat tim jatahnya
8. **Share**: copy link yang udah contain hasil draw

## Draw Algorithm

Round-robin: misal 48 tim ÷ 4 teman = 12 each
- Round 1: A1, B1, C1, D1
- Round 2: A2, B2, C2, D2
- ... sampai habis

## Component Tree

```
App
├── HomePage
├── SetupPage
│   ├── FriendInput
│   └── TeamPoolSelector
├── DrawPage
│   ├── RouletteWheel
│   ├── FriendIndicator
│   ├── ProgressBar
│   └── TeamGrid (full flag grid)
└── ResultsPage
    ├── FriendResultCard (× N friends)
    └── ShareButton
```

## Data Shape

```js
{
  friends: ["Alice", "Bob"],
  edition: "wc2026",
  teams: ["argentina", "brazil", ...],  // 48 team slugs
  picks: [
    { friend: "Alice", team: "brazil", round: 1 },
    { friend: "Bob", team: "argentina", round: 1 },
    // ...
  ],
  completed: false
}
```

## Team Dataset

48 tim, 16 grup × 3 tim per grup. Masing-masing:
- `slug`: `"brazil"`
- `name`: `"Brazil"`
- `flag`: emoji `"🇧🇷"` atau flag CDN URL
- `group`: `"A"`–`"P"`
