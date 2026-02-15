# Happy Birthday Maya 🎂

A small birthday page built with **React**, **Vite**, **Mantine**, and **Tailwind CSS**.

## Run locally

From the **birthday** folder:

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

## Stack

- **React 18** + **Vite** – app and dev server
- **Mantine** – UI components (Modal, Button, Text, Box) and hooks (`useDisclosure`)
- **Tailwind CSS** – layout and utilities (with `preflight: false` so it doesn’t override Mantine)

You can use both Mantine and Tailwind in the same project: Mantine for components and theming, Tailwind for spacing, typography, and custom layout.
