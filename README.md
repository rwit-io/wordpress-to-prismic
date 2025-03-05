# WordPress to Prismic Migration

## Overview
This script automates the migration of posts from a WordPress site to Prismic CMS. It fetches data from the WordPress REST API, converts it into Prismic-compatible formats, and uploads posts along with their associated images to Prismic. The migration process ensures that posts retain their original content structure, including rich text formatting, categories, tags, authors, and featured images. Additionally, the script checks for existing media in Prismic to avoid duplicate uploads, optimizing storage and performance. By leveraging Prismic's API, this migration helps streamline content management, making it easier to maintain and update posts in a headless CMS environment.

## Prerequisites
Before running the script, ensure you have:
- Node.js installed
- A WordPress site with a REST API endpoint
- A Prismic repository
- API tokens for Prismic (Read and Write access)

## Installation & Setup

1. Clone this repository:
   ```sh
   git clone <repo-url>
   cd wordpress-to-prismic-migration
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file and add the following environment variables:
   ```sh
   PRISMIC_WRITE_TOKEN=your_prismic_write_token
   PRISMIC_READ_TOKEN=your_prismic_read_token
   WORDPRESS_REST_API=https://your-wordpress-site.com/wp-json/wp/v2/posts
   ```

## Script Breakdown

### 1. Load Dependencies & Configuration
- Loads environment variables using `dotenv`
- Initializes Prismic clients for reading and writing
- Fetches repository configuration from `slicemachine.config.json`

### 2. Helper Functions
- **`formatDate(inputDate)`**: Converts a date to `YYYY-MM-DD` format.
- **`convertHtmlToRichText(htmlString)`**: Converts HTML content from WordPress to Prismic Rich Text format.

### 3. Fetch WordPress Posts
- The `fetchWordPressPosts` function makes an API call to WordPress to retrieve posts.

### 4. Upload Images to Prismic
- **`uploadImageToPrismic(imageUrl, postId)`**
  - Checks if an image already exists in Prismic.
  - Uploads the image if it does not exist.
- **`checkImageExists(imageUrl)`**
  - Queries Prismic to check if the image is already uploaded.

### 5. Migrate WordPress Posts to Prismic
- **`addPostToMigration(post)`**
  - Converts WordPress post content to Prismic format.
  - Uploads featured images.
  - Creates a Prismic document for the post.

### 6. Execute the Migration
- **`runMigration()`**
  - Fetches WordPress posts.
  - Iterates over the posts and adds them to Prismic.
  - Commits the migration to Prismic.

## Running the Script
To start the migration, run:
```sh
node wordpress-to-prismic-migration.js
```

## Error Handling & Debugging
- The script logs errors encountered while fetching posts, uploading images, or creating documents.
- Ensure the Prismic API tokens are correct and have the necessary permissions.
- Verify that the WordPress API endpoint is accessible.

## Blog

You can also check our blog for a detailed step-by-step migration guide: [How to Migrate from WordPress to Sanity](https://www.rwit.io/blog/how-to-migrate-from-wordpress-to-sanity-a-step-by-step-guide)

## Acknowledgments

A [remote agency](https://www.rwit.io/) with a global reach specializing in developing custom software and headless applications

Made with ❤️ by [RWIT](https://www.rwit.io/)

## Contact Us

For any questions or support, feel free to reach out at [RWIT](https://www.rwit.io/contact?utm_source=www&utm_medium=contactbutton&utm_campaign=visit).

## Conclusion
This script simplifies migrating WordPress posts to Prismic, ensuring content is properly formatted and images are handled correctly. Modify as needed to fit your specific project requirements.

## License
This script is open-source and can be modified as needed for your migration requirements.

