declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXT_PUBLIC_STRAVA_CLIENT_ID: string;
      STRAVA_CLIENT_SECRET: string;
      JWT_SECRET: string;
      DATABASE_URL_UNPOOLED: string;
      NEON_PROJECT_ID: string;
      NEXT_PUBLIC_STACK_PROJECT_ID: string;
      NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: string;
      PGDATABASE: string;
      PGHOST: string;
      PGHOST_UNPOOLED: string;
      PGPASSWORD: string;
      PGUSER: string;
      POSTGRES_DATABASE: string;
      POSTGRES_HOST: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_PRISMA_URL: string;
      POSTGRES_URL: string;
      POSTGRES_URL_NON_POOLING: string;
      POSTGRES_URL_NO_SSL: string;
      POSTGRES_USER: string;
      STACK_SECRET_SERVER_KEY: string;
      NEXT_PUBLIC_STRAVA_REDIRECT_URI: string;
    }
  }
}
