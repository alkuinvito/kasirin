<p align="center">
   <a href="https://kasirin.enigme.dev">
      <img src="https://assets.enigme.dev/Kasirin.svg" alt="Kasirin">
   </a>
</p>
<p align="center">
   <img src="https://vercelbadge.vercel.app/api/alkuinvito/kasirin" alt="vercel" />
   <a href="https://www.gnu.org/licenses/gpl-3.0">
      <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="license" />
   </a>
</p>

## 💬 Introduction
Kasirin is an content management system-based cashier application. This project is fully built using Typescript on Next JS for both frontend and backend, also utilizing Next Auth as main authenticator.

## 🚀 Quickstart
1. Prepare a S3-compatible bucket for image uploads (e.g. AWS S3, Cloudflare R2)
2. Generate Google OAuth 2.0 Client ID and Client Secret
3. (optional) Sign up for a Brevo account to send receipts
4. Create `.env` file in the root directory using `.env.example` as template, and fill out all config
5. Install dependencies and run dev mode using this command:
   ```bash
   npm i && npm run dev
   ```