const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://ai_ecommerce_app:aiecommerce2026@cluster0.vlmt3eq.mongodb.net/ai-ecommerce-chatbot?appName=Cluster0";

async function test() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    console.log("Connected successfully!");

    await client.close();
  } catch (error) {
    console.error("Connection error:");
    console.error(error);
  }
}

test();