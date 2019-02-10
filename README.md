- [Quick Start](#quick-start)
- [Conventions](#conventions)
  - [Blog Posts](#blog-posts)

## Quick start

1. **Clone blog**

   ```sh
   git clone git@github.com:tkjone/blog.git
   ```

1. **Install blog dependencies**

   ```sh
   npm install
   ```

   > run this command from the root of blog

1. **Start blog**

   ```sh
   npx gatsby develop
   ```

   > Using `npx` means you do not have to install gatsby globally

Your site is now running at `http://localhost:8000`!

> You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data.

## Conventions

### Blog Posts

- Date Formatting

  ```bash
  # bad
  February 09, 2018

  # bad
  2019, 09 February

  # good
  09 February 2019
  ```

  > All blog posts require frontmatter to have a date included with the proper formatting
