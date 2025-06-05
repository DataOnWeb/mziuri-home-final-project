import dotenv from 'dotenv';
const { MongoClient, ObjectId } = await import('mongodb');

dotenv.config();

const EXCHANGE_RATES = {
  usd: 1,
  gel: 2.65,
  eur: 0.92,
};

const runMigration = async () => {
  const uri = 'mongodb+srv://data:data123@cluster0.5zp7i.mongodb.net/ProniaApp?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('ProniaApp');
    const collection = db.collection('products');

    const products = await collection.find({}).toArray();
    console.log(`🔍 Found ${products.length} products`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      if (!product.hasOwnProperty('price')) {
        console.warn(`⚠️ Skipped product ${product._id}: No price field at all`);
        skippedCount++;
        continue;
      }

      const price = product.price;

      // Already migrated
      if (price && typeof price === 'object' && price.usd !== undefined) {
        skippedCount++;
        continue;
      }

      let basePrice;
      if (typeof price === 'string') {
        basePrice = parseFloat(price.trim());
      } else if (typeof price === 'number') {
        basePrice = price;
      } else {
        console.warn(`⚠️ Skipped product ${product._id}: Invalid price format`, price);
        skippedCount++;
        continue;
      }

      if (isNaN(basePrice)) {
        console.warn(`⚠️ Skipped product ${product._id}: Could not parse base price`, price);
        skippedCount++;
        continue;
      }

      const newPrice = {
        usd: basePrice,
        gel: Math.round(basePrice * EXCHANGE_RATES.gel * 100) / 100,
        eur: Math.round(basePrice * EXCHANGE_RATES.eur * 100) / 100,
      };

      await collection.updateOne(
        { _id: product._id },
        { $set: { price: newPrice } }
      );

      console.log(`✅ Updated product ${product._id}: $${basePrice} ->`, newPrice);
      updatedCount++;
    }

    console.log(`\n🎉 Migration complete! Updated: ${updatedCount}, Skipped: ${skippedCount}`);
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
};

runMigration();
