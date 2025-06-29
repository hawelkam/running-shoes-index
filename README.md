# Stride Lab

A comprehensive directory of running shoes built with Next.js.

## About

Stride Lab is your complete directory of running shoes, featuring detailed specifications, reviews, and comparisons to help you find the perfect footwear for your running needs.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin Panel

The application includes an admin panel that's only accessible to users with admin role.

### Accessing the Admin Panel

1. First, sign in with Strava
2. Visit `/auth-demo` and use the "Promote to Admin (Testing)" button to upgrade your role
3. The admin panel link will then appear in your user dropdown menu
4. Navigate to `/admin` to access the admin panel

The admin panel includes three main sections:

- **Manage Users**: User management, roles, and permissions
- **Manage Shoes**: Shoe database and product information
- **Manage Reviews**: Review moderation and management

> **Note**: In production, admin role assignment should be done through a secure process, not self-promotion.
