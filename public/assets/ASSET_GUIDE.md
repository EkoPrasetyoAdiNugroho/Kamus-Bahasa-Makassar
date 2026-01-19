# Asset Generation & Usage Guide

## Folder Structure
We have created an `assets` directory for your project. The recommended structure is:

```
/website/Kamus Bhs daerah/
├── index.html
├── style.css
└── assets/
    ├── app_logo.png (or app_logo.svg)
    ├── search_icon.png (or search_icon.svg)
    ├── culture_illustration.png
    └── hero_background.png (or hero_background.svg)

> **Note:** SVG versions of the logo, search icon, and background have been generated for immediate use. You can generate the high-delity PNG versions later when the API capacity allows.

```

## Image Generation Prompts
Since the image generation service is currently at capacity, you can use these optimized prompts with any AI image generator (Midjourney, DALL-E, or retry Gemini later).

### 1. Application Logo
**Filename:** `assets/app_logo.png`
**Prompt:**
> Minimalist academic logo for a language dictionary application, incorporating a book or speech bubble symbol, clean lines, flat design, vector style, blue and white color scheme, suitable for a university project, white background.

### 2. Search Icon
**Filename:** `assets/search_icon.png`
**Prompt:**
> Simple magnifying glass icon, flat design, solid color, minimal, vector style, white background, suitable for UI button.

### 3. Cultural Illustration
**Filename:** `assets/culture_illustration.png`
**Prompt:**
> Flat illustration representing cultural heritage and language, featuring traditional Indonesian batik patterns or distinct cultural symbols, books, and conversation bubbles, soft colors, academic style, white background.

### 4. Background Banner
**Filename:** `assets/hero_background.png`
**Prompt:**
> Subtle geometric pattern background, academic theme, light blue and grey tones, clean, modern, suitable for web banner or header, minimal distraction.

---

## How to Reference in HTML/CSS

### 1. HTML Implementation

**Logo in Navbar:**
```html
<nav class="navbar">
    <div class="logo-container">
        <img src="assets/app_logo.png" alt="Kamus Bahasa Daerah Logo" class="app-logo">
        <span class="app-title">Kamus Bahasa Daerah</span>
    </div>
</nav>
```

**Search Bar with Icon:**
```html
<div class="search-container">
    <input type="text" placeholder="Cari kata...">
    <button type="submit" class="search-btn">
        <img src="assets/search_icon.png" alt="Search">
    </button>
</div>
```

**Hero Section with Illustration:**
```html
<header class="hero-section">
    <div class="hero-content">
        <h1>Selamat Datang di Kamus Bahasa Daerah</h1>
        <p>Lestarikan budaya melalui bahasa.</p>
    </div>
    <div class="hero-image">
        <img src="assets/culture_illustration.png" alt="Ilustrasi Budaya">
    </div>
</header>
```

### 2. CSS Implementation

**Background Image:**
```css
body {
    background-image: url('assets/hero_background.png');
    background-repeat: repeat; /* or no-repeat / cover depending on the image */
    background-size: cover;
    background-attachment: fixed;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-logo {
    height: 40px; /* Adjust based on navbar size */
    width: auto;
}

.search-btn img {
    width: 20px;
    height: 20px;
}
```
