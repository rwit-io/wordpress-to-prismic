require("dotenv").config();
const prismic = require("@prismicio/client");
const axios = require("axios");
const { parse } = require("node-html-parser");
const { repositoryName } = require("./slicemachine.config.json");


const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  if (isNaN(date)) {
    throw new Error(`Invalid date format: ${inputDate}`);
  }
  return date.toISOString().split("T")[0];
};


const convertHtmlToRichText = (htmlString) => {
  const root = parse(htmlString);
  const children = root.childNodes.map((node) => {
    if (node.nodeType === 1) {
      return {
        type: "paragraph",
        text: node.textContent.trim(),
        spans: [],
      };
    } else if (node.nodeType === 3) {
      return {
        type: "paragraph",
        text: node.rawText.trim(),
        spans: [],
      };
    }
    return null;
  });
  return children.filter((child) => child !== null);
};

// Prismic Client Setup
const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN,
});

const readClient = prismic.createClient(repositoryName, {
  accessToken: process.env.PRISMIC_READ_TOKEN,
});

// Fetch posts from WordPress API
const fetchWordPressPosts = async () => {
  try {
    const response = await axios.get(process.env.WORDPRESS_REST_API);
    return response.data;
  } catch (error) {
    console.error("Error fetching WordPress posts:", error.message);
    throw error;
  }
};

// Upload image to Prismic
const uploadImageToPrismic = async (imageUrl, postId) => {
  try {
    const imageName = `${postId || "image"}_${imageUrl.split('/').pop()}`;

    const existingImage = await checkImageExists(imageUrl);

    if (existingImage) {
      console.log(`Image already exists in Prismic: ${imageUrl}`);
      return existingImage;
    }

    const newAsset = migration.createAsset(imageUrl, imageName, {
      notes: "Uploaded from WordPress migration",
      credits: "Source: WordPress",
      alt: "Featured image",
      tags: ["featured", "image"],
    });

    console.log(`Uploaded new image to Prismic: ${imageUrl}`);
    return newAsset;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }
};
const checkImageExists = async (imageUrl) => {
  try {
    const response = await readClient.getAllByType("media", {
      fetch: ["media.image"],
      pageSize: 100,
    });

    const existingImage = response.find((media) => media.data.image?.url === imageUrl);

    return existingImage ? existingImage.id : null; 
  } catch (error) {
    console.error("Error checking image existence:", error.message);
    return null;
  }
};

// Add post document to migration
const addPostToMigration = async (post) => {
  const richTextContent = convertHtmlToRichText(post.content);
  const formattedDate = formatDate(post.date);
  const featuredImageUrl = post.featured_image;

  let featuredImage = null;
  if (featuredImageUrl) {
    featuredImage = await uploadImageToPrismic(featuredImageUrl, post.id);
  }

  const slugLink = {
    link_type: "Web",
    url: post.slug,
  };

  migration.createDocument(
    {
      type: "posts",
      uid: post.id.toString(),
      lang: "en-us",
      tags: post.tags ? post.tags.map(tag => tag.name) : [],
      data: {
        title: post.title,
        content: richTextContent,
        excerpt: post.excerpt,
        author: post.author,
        categories: post.categories
        ? post.categories.map(category => ({ categoryname: category.name }))
        : [],
        categories: post.categories
        ? post.categories.map(category => ({
          categoryname: category.name,  
          categoryslug: category.slug,  
          }))
        : [],
        slug: slugLink,
        date: formattedDate,
        featured_image: featuredImage,
      },
    },
    post.title
  );
};


const runMigration = async () => {
  try {
    const posts = await fetchWordPressPosts();

    for (const post of posts) {
      await addPostToMigration(post);
    }

    await writeClient.migrate(migration, {
      reporter: (event) => console.log(event),
    });

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

// Start migration
const migration = prismic.createMigration();
runMigration();