# 📖 Kamus Bahasa Makassar

A web-based **Makassar Language Dictionary** designed to help users translate between **Indonesian and Makassar language** using string-matching algorithms.

This project was developed to demonstrate and compare the performance of **Naive String Matching** and **Knuth-Morris-Pratt (KMP)** algorithms in a real-world dictionary search application.

## 🌐 Live Demo

👉 **https://kamus-bahasa-makassar.vercel.app/**

## ✨ Features

### 🔍 Two-Way Translation

Search and translate words in two directions:

* 🇮🇩 Indonesian → Makassar
* 🌴 Makassar → Indonesian

### ⚡ String Matching Algorithms

Users can choose between two search algorithms:

**Naive String Matching**

* Straightforward pattern matching approach
* Useful as a baseline for algorithm comparison

**Knuth-Morris-Pratt (KMP)**

* Efficient pattern matching algorithm
* Uses a prefix table to avoid unnecessary comparisons

### 📊 Search Performance Metrics

The application provides technical information about the search process, including:

* Number of comparisons
* Position/index where the word was found
* Search execution time
* Selected algorithm

This makes the application useful not only as a dictionary but also as a practical demonstration of **string matching algorithms**.

### 🎨 Clean Interface

* Simple and minimal user interface
* Focused on dictionary search functionality
* Responsive web layout
* Separate algorithm selection
* Easy-to-understand search results

---

## 🧠 Algorithms

### Naive String Matching

The Naive String Matching algorithm checks the pattern against the text one position at a time.

```text
Text    : BAHASAMAKASSAR
Pattern : MAKASSAR

BAHASAMAKASSAR
     ↑
  compare
```

It is simple to implement and useful for understanding the fundamentals of pattern matching.

### Knuth-Morris-Pratt (KMP)

KMP improves pattern searching by preprocessing the pattern and creating a **Longest Prefix Suffix (LPS)** table.

```text
Pattern
   ↓
LPS Table
   ↓
Efficient Search
```

Instead of restarting from the beginning after a mismatch, KMP uses previously matched information to continue searching more efficiently.

---

## 🛠️ Tech Stack

| Technology        | Purpose                                     |
| ----------------- | ------------------------------------------- |
| **HTML5**         | Web page structure                          |
| **CSS3**          | Interface styling                           |
| **JavaScript**    | Frontend logic and algorithm implementation |
| **Node.js**       | Backend runtime                             |
| **Express.js**    | Backend API                                 |
| **PostgreSQL**    | Dictionary database                         |
| **Neon Database** | Cloud PostgreSQL hosting                    |
| **xlsx**          | Excel data processing                       |
| **CORS**          | Cross-origin request handling               |
| **dotenv**        | Environment variable management             |
| **Vercel**        | Deployment                                  |

The repository uses Vanilla HTML/CSS/JavaScript on the frontend, Node.js/Express on the backend, and PostgreSQL via Neon Database.

---

## 🏗️ Application Architecture

```text
┌─────────────────────────────────────┐
│         Kamus Bahasa Makassar       │
└──────────────────┬──────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Web Frontend  │
          │ HTML/CSS/JS     │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Express.js API  │
          │    Node.js      │
          └────────┬────────┘
                   │
          ┌────────┴─────────┐
          │                  │
          ▼                  ▼
   Naive Matching          KMP
          │                  │
          └────────┬─────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   PostgreSQL    │
          │ Neon Database   │
          └─────────────────┘
```

---

## 📂 Project Structure

```text
Kamus-Bahasa-Makassar/
│
├── assets/
├── data/
├── public/
├── scripts/
├── src/
│
├── index.html
├── script.js
├── style.css
├── server.js
│
├── package.json
├── package-lock.json
├── vercel.json
├── .gitignore
│
├── README.md
└── UI_EXPLANATION.md
```

The repository contains dictionary data, frontend assets, scripts, source code, the backend server, and deployment configuration.

---

## ⚙️ Requirements

Before running the project locally, make sure you have:

* **Node.js**
* **npm**
* **PostgreSQL database**
* A modern web browser
* A Neon Database account if using the hosted PostgreSQL setup

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/EkoPrasetyoAdiNugroho/Kamus-Bahasa-Makassar.git
cd Kamus-Bahasa-Makassar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
```

Use the database configuration expected by your `server.js`.

> ⚠️ Never commit your `.env` file or database credentials to GitHub.

### 4. Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

The existing project documentation uses port `3000` by default, unless another port is configured.

---

## 🔎 How It Works

The search process can be summarized as:

```text
User enters a word
        │
        ▼
Select language direction
        │
        ▼
Select algorithm
        │
        ├───────────────┐
        ▼               ▼
      Naive            KMP
        │               │
        └───────┬───────┘
                ▼
        Search dictionary
                │
                ▼
        Display translation
                │
                ▼
     Show performance metrics
```

---

## 📊 Algorithm Comparison

| Feature           | Naive String Matching         | KMP                      |
| ----------------- | ----------------------------- | ------------------------ |
| Implementation    | Simple                        | More advanced            |
| Preprocessing     | None                          | Uses LPS table           |
| Pattern reuse     | No                            | Yes                      |
| Educational value | High                          | High                     |
| Search efficiency | Lower for repetitive patterns | Generally more efficient |

The application makes it possible to observe these differences directly through the reported comparison count and execution time.

---

## 🎯 Project Goals

This project was created as an academic web application to:

* Build a digital dictionary for the Makassar language
* Preserve and provide easier access to regional language vocabulary
* Implement string-matching algorithms in a practical application
* Compare Naive String Matching and KMP
* Measure search performance
* Apply algorithmic concepts to a real-world problem

---

## 📚 Documentation

Additional UI documentation is available in:

[`UI_EXPLANATION.md`](./UI_EXPLANATION.md)

---

## 👨‍💻 Developer

**Eko Prasetyo Adi Nugroho**

GitHub:
https://github.com/EkoPrasetyoAdiNugroho

Repository:
https://github.com/EkoPrasetyoAdiNugroho/Kamus-Bahasa-Makassar

---

## 📄 License

This project was created for **educational and academic purposes**.

---

## ⭐ Kamus Bahasa Makassar

> **Preserving local language through technology.** 🌴📖
