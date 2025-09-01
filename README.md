This is a Next.js application for a blog platform featuring posts, comments, and search functionalities. It uses Supabase for the database and Clerk for authentication.

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- pnpm package manager

### Installation

1.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following environment variables. You can get these keys from your Supabase and Clerk dashboards.

    ```
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=

    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    # or
    npm install
    ```

### Running the Application

To run the application in development mode, use the following command:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses Jest for automated testing.

### Running Automated Tests

To run the entire test suite, execute the following command:

```bash
pnpm test
# or
npm test
```

### Testing Features Manually

1.  **Authentication**

    - Sign up for a new account or log in with an existing one using the Clerk interface.
    - Protected routes should only be accessible after logging in.

2.  **Posts**

    - Navigate to the homepage to view a list of all posts.
    - Click on a post to view its full content.
    - (If implemented) Try creating, updating, or deleting a post.

3.  **Comments**

    - On a post's page, view the comments section.
    - Add a new comment to the post.
    - (If implemented) Try replying to a comment or deleting one of your own.

4.  **Search**
    - Use the search bar to look for posts by title or content.
    - Verify that the search results are relevant to your query.
