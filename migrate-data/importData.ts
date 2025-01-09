  import axios from 'axios';
  import { client } from './sanityClient.js';

  async function uploadImageToSanity(imageUrl: string): Promise<string> {

    try {
      // Fetch the image from the URL and convert it to a buffer
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // Upload the image to Sanity
      const asset = await client.assets.upload('image', buffer, {
        filename: imageUrl.split('/').pop(), // Extract the filename from URL
      });

      // Debugging: Log the asset returned by Sanity
      console.log('Image uploaded successfully:', asset);

      return asset._id; // Return the uploaded image asset reference ID
    } catch (error) {
      console.error('❌ Failed to upload image:', imageUrl, error);
      throw error;
    }
  }

  async function importData() {
      try {
        // Fetch data from external API
        const response = await axios.get('https://fakestoreapi.com/products');
        const products = response.data;

        // Iterate over the products
        for (const product of products) {
          let imageRef = '';

          // Upload image and get asset reference if it exists
          if (product.image) {
            imageRef = await uploadImageToSanity(product.image);
          }

          const sanityProduct = {
            _id: `product-${product.id}`, // Prefix the ID to ensure validity
            _type: 'product',
            name: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage || 0,
            tags: product.category ? [product.category] : [],
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageRef, // Set the correct asset reference ID
              },
            },
            description: product.description,
            rating: product.rating?.rate || 0,
            ratingCount: product.rating?.count || 0,
          };

          // Log the product before attempting to upload it to Sanity
          console.log('Uploading product:', sanityProduct);

          // Import data into Sanity
          await client.createOrReplace(sanityProduct);
          console.log(`✅ Imported product: ${sanityProduct.name}`);
        }

        console.log('✅ Data import completed!');
      } catch (error) {
        console.error('❌ Error importing data:', error);
      }
  }

  importData();