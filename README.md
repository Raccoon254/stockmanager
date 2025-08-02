# InvenTree

A web-based application for managing inventory, sales, and stock adjustments for multiple shops.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun
- A PostgreSQL database

### Installing

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Raccoon254/stockmanager.git
    cd stockmanager
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up environment variables:**

    Copy the `.env.example` file to a new file named `.env` and update the values with your actual database credentials and other settings.

    ```bash
    cp .env.example .env
    ```

4.  **Run database migrations:**

    This will create the necessary tables in your database based on the Prisma schema.

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**

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

## Features

-   **Multi-shop support:** Manage inventory and sales for multiple shops from a single interface.
-   **User authentication:** Secure user authentication with NextAuth.js.
-   **Inventory management:** Add, edit, and delete items from your inventory.
-   **Sales tracking:** Record sales and view sales history.
-   **Stock adjustments:** Make adjustments to stock levels for various reasons.
-   **Dashboard:** Get an overview of your sales and inventory.
-   **Reports:** Generate reports on sales and inventory.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file. It includes the following models:

-   `User`: Stores user information.
-   `Shop`: Stores shop information.
-   `Account`: Stores user account information for NextAuth.js.
-   `Session`: Stores user session information for NextAuth.js.
-   `VerificationToken`: Stores verification tokens for NextAuth.js.
-   `Item`: Stores inventory item information.
-   `Sale`: Stores sales information.
-   `SaleItem`: Stores information about items in a sale.
-   `StockAdjustment`: Stores information about stock adjustments.

## Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
--   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the code.
-   `npm run prisma:migrate`: Runs database migrations.
-   `npm run prisma:generate`: Generates the Prisma client.
-   `npm run prisma:studio`: Opens the Prisma Studio.
-   `npm run prisma:reset`: Resets the database.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.