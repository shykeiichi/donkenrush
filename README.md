# Hur startar man projektet

*OBS: Jag rekommenderar pnpm som package manager men npm fungerar bra bara byt ut pnpm mot npm där det behövs*

Klona projektet
```bash
git clone https://github.com/shykeiichi/donkenrush
```

Byt mapp 
```bash
cd donkenrush
```

Installera dependencies
```bash
pnpm install
```

## Starta för att utveckla

```bash
pnpm run dev
```

## Starta för production

```bash
pnpm run build && pnpm run start
```