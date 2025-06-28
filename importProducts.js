const admin = require('firebase-admin');
const serviceAccount = require('./nairobi-grocer-e7a84-firebase-adminsdk-fbsvc-0dd8ec4cec.json'); // <--- REPLACE WITH YOUR SERVICE ACCOUNT KEY PATH

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
   databaseURL: 'https://console.firebase.google.com/u/0/project/nairobi-grocer-e7a84/firestore/databases/-default-/data/~2Forders~2FkaHbFb5upzpuZAmowAgb' // <--- Optional: Uncomment and replace if needed for other services
});

const db = admin.firestore();

// Your product data (paste the JSON data I provided earlier here)
const products = [
    { "id": "1", "name": "Fresh Apples", "description": "Crisp and juicy red apples.", "price": 2.50, "image": "https://source.unsplash.com/300x300/?fresh,apples", "category": "Fruits", "stock": 100, "rating": 4.5, "reviews": 120, "aiHint": "fresh apples" },
    { "id": "2", "name": "Organic Bananas", "description": "A bunch of ripe organic bananas.", "price": 1.80, "image": "https://source.unsplash.com/300x300/?organic,bananas", "category": "Fruits", "stock": 150, "rating": 4.8, "reviews": 250, "aiHint": "organic bananas" },
    { "id": "3", "name": "Carrots", "description": "Fresh, crunchy carrots.", "price": 1.20, "image": "https://source.unsplash.com/300x300/?fresh,carrots", "category": "Vegetables", "stock": 200, "rating": 4.6, "reviews": 90, "aiHint": "fresh carrots" },
    { "id": "4", "name": "Spinach", "description": "A bag of fresh spinach leaves.", "price": 2.00, "image": "https://source.unsplash.com/300x300/?fresh,spinach", "category": "Vegetables", "stock": 80, "rating": 4.7, "reviews": 75, "aiHint": "fresh spinach" },
    { "id": "5", "name": "Fresh Milk", "description": "1L of fresh pasteurized milk.", "price": 1.50, "image": "https://source.unsplash.com/300x300/?milk,carton", "category": "Dairy", "stock": 120, "rating": 4.9, "reviews": 300, "aiHint": "milk carton" },
    { "id": "6", "name": "Cheddar Cheese", "description": "250g block of mature cheddar cheese.", "price": 4.50, "image": "https://source.unsplash.com/300x300/?cheese,block", "category": "Dairy", "stock": 60, "rating": 4.8, "reviews": 150, "aiHint": "cheese block" },
    { "id": "7", "name": "Whole Wheat Bread", "description": "A loaf of freshly baked whole wheat bread.", "price": 3.00, "image": "https://source.unsplash.com/300x300/?bread,loaf", "category": "Bakery", "stock": 50, "rating": 4.7, "reviews": 180, "aiHint": "bread loaf" },
    { "id": "8", "name": "Croissants", "description": "Pack of 4 buttery croissants.", "price": 4.00, "image": "https://source.unsplash.com/300x300/?buttery,croissants", "category": "Bakery", "stock": 40, "rating": 4.9, "reviews": 210, "aiHint": "buttery croissants" },
    { "id": "9", "name": "Chicken Breast", "description": "500g of skinless chicken breast fillets.", "price": 7.50, "image": "https://source.unsplash.com/300x300/?raw,chicken", "category": "Meat", "stock": 30, "rating": 4.8, "reviews": 110, "aiHint": "raw chicken" },
    { "id": "10", "name": "Ground Beef", "description": "500g of lean ground beef.", "price": 8.00, "image": "https://source.unsplash.com/300x300/?ground,beef", "category": "Meat", "stock": 25, "rating": 4.7, "reviews": 95, "aiHint": "ground beef" },
    { "id": "11", "name": "Avocado", "description": "Ripe and creamy Hass avocado.", "price": 1.75, "image": "https://source.unsplash.com/300x300/?ripe,avocado", "category": "Fruits", "stock": 90, "rating": 4.9, "reviews": 400, "aiHint": "ripe avocado" },
    { "id": "12", "name": "Tomatoes", "description": "A pound of fresh, vine-ripened tomatoes.", "price": 2.20, "image": "https://source.unsplash.com/300x300/?vine,tomatoes", "category": "Vegetables", "stock": 110, "rating": 4.6, "reviews": 130, "aiHint": "vine tomatoes" },
    { "id": "13", "name": "Broccoli", "description": "Fresh green broccoli crowns.", "price": 2.30, "image": "https://source.unsplash.com/300x300/?fresh,broccoli", "category": "Vegetables", "stock": 100, "rating": 4.6, "reviews": 85, "aiHint": "fresh broccoli" },
    { "id": "14", "name": "Blueberries", "description": "A 150g pack of sweet blueberries.", "price": 3.20, "image": "https://source.unsplash.com/300x300/?blueberries,pack", "category": "Fruits", "stock": 70, "rating": 4.8, "reviews": 190, "aiHint": "blueberries pack" },
    { "id": "15", "name": "Greek Yogurt", "description": "500g tub of plain Greek yogurt.", "price": 3.50, "image": "https://source.unsplash.com/300x300/?greek,yogurt", "category": "Dairy", "stock": 60, "rating": 4.7, "reviews": 140, "aiHint": "greek yogurt" },
    { "id": "16", "name": "Brown Eggs", "description": "Tray of 12 farm-fresh brown eggs.", "price": 3.00, "image": "https://source.unsplash.com/300x300/?tray,of,eggs", "category": "Dairy", "stock": 100, "rating": 4.9, "reviews": 280, "aiHint": "tray of eggs" },
    { "id": "17", "name": "White Rice", "description": "2kg pack of long grain white rice.", "price": 4.20, "image": "https://source.unsplash.com/300x300/?white,rice,grains", "category": "Pantry", "stock": 200, "rating": 4.6, "reviews": 160, "aiHint": "white rice grains" },
    { "id": "18", "name": "Peanut Butter", "description": "500g jar of creamy peanut butter.", "price": 3.80, "image": "https://source.unsplash.com/300x300/?jar,of,peanut,butter", "category": "Pantry", "stock": 90, "rating": 4.8, "reviews": 175, "aiHint": "jar of peanut butter" },
    { "id": "19", "name": "Orange Juice", "description": "1L bottle of 100% orange juice.", "price": 2.90, "image": "https://source.unsplash.com/300x300/?orange,juice,bottle", "category": "Beverages", "stock": 120, "rating": 4.7, "reviews": 150, "aiHint": "orange juice bottle" },
    { "id": "20", "name": "Beef Sausages", "description": "Pack of 6 beef sausages.", "price": 5.20, "image": "https://source.unsplash.com/300x300/?beef,sausage,pack", "category": "Meat", "stock": 50, "rating": 4.6, "reviews": 100, "aiHint": "beef sausage pack" },
    { "id": "21", "name": "Lettuce", "description": "Crisp iceberg lettuce head.", "price": 1.90, "image": "https://source.unsplash.com/300x300/?fresh,lettuce", "category": "Vegetables", "stock": 80, "rating": 4.5, "reviews": 70, "aiHint": "fresh lettuce" },
    { "id": "22", "name": "Green Grapes", "description": "500g pack of seedless green grapes.", "price": 3.70, "image": "https://source.unsplash.com/300x300/?green,grapes", "category": "Fruits", "stock": 60, "rating": 4.8, "reviews": 165, "aiHint": "green grapes" },
    { "id": "23", "name": "Whole Chicken", "description": "1.5kg whole fresh chicken.", "price": 9.50, "image": "https://source.unsplash.com/300x300/?whole,chicken", "category": "Meat", "stock": 40, "rating": 4.7, "reviews": 110, "aiHint": "whole chicken" },
    { "id": "24", "name": "Butter", "description": "250g salted butter block.", "price": 2.60, "image": "https://source.unsplash.com/300x300/?salted,butter", "category": "Dairy", "stock": 70, "rating": 4.9, "reviews": 145, "aiHint": "salted butter" },
    { "id": "25", "name": "Strawberries", "description": "250g punnet of ripe strawberries.", "price": 3.90, "image": "https://source.unsplash.com/300x300/?fresh,strawberries", "category": "Fruits", "stock": 55, "rating": 4.9, "reviews": 230, "aiHint": "fresh strawberries" },
    { "id": "26", "name": "Cabbage", "description": "Large green cabbage head.", "price": 1.80, "image": "https://source.unsplash.com/300x300/?green,cabbage", "category": "Vegetables", "stock": 85, "rating": 4.5, "reviews": 60, "aiHint": "green cabbage" },
    { "id": "27", "name": "Brown Bread", "description": "Sliced brown sandwich bread.", "price": 2.80, "image": "https://source.unsplash.com/300x300/?brown,sliced,bread", "category": "Bakery", "stock": 65, "rating": 4.6, "reviews": 95, "aiHint": "brown sliced bread" },
    { "id": "28", "name": "Almond Milk", "description": "1L of unsweetened almond milk.", "price": 3.20, "image": "https://source.unsplash.com/300x300/?almond,milk,carton", "category": "Dairy", "stock": 75, "rating": 4.7, "reviews": 125, "aiHint": "almond milk carton" },
    { "id": "29", "name": "Mangoes", "description": "2 large juicy mangoes.", "price": 2.60, "image": "https://source.unsplash.com/300x300/?fresh,mangoes", "category": "Fruits", "stock": 95, "rating": 4.8, "reviews": 190, "aiHint": "fresh mangoes" },
    { "id": "30", "name": "Zucchini", "description": "Fresh green zucchini squash.", "price": 2.10, "image": "https://source.unsplash.com/300x300/?green,zucchini", "category": "Vegetables", "stock": 100, "rating": 4.6, "reviews": 80, "aiHint": "green zucchini" },
    { "id": "31", "name": "Apple Juice", "description": "1L bottle of 100% apple juice.", "price": 2.70, "image": "https://source.unsplash.com/300x300/?apple,juice,bottle", "category": "Beverages", "stock": 90, "rating": 4.6, "reviews": 120, "aiHint": "apple juice bottle" },
    { "id": "32", "name": "Tomato Sauce", "description": "500g bottle of classic tomato sauce.", "price": 1.90, "image": "https://source.unsplash.com/300x300/?tomato,sauce,bottle", "category": "Pantry", "stock": 110, "rating": 4.5, "reviews": 140, "aiHint": "tomato sauce bottle" },
    { "id": "33", "name": "Breakfast Cereal", "description": "500g box of crunchy cereal.", "price": 4.00, "image": "https://source.unsplash.com/300x300/?cereal,box", "category": "Pantry", "stock": 85, "rating": 4.6, "reviews": 160, "aiHint": "cereal box" },
    { "id": "34", "name": "Sweet Potatoes", "description": "1kg of fresh sweet potatoes.", "price": 3.30, "image": "https://source.unsplash.com/300x300/?sweet,potatoes", "category": "Vegetables", "stock": 90, "rating": 4.7, "reviews": 100, "aiHint": "sweet potatoes" },
    { "id": "35", "name": "Lemons", "description": "4 fresh yellow lemons.", "price": 1.50, "image": "https://source.unsplash.com/300x300/?yellow,lemons", "category": "Fruits", "stock": 75, "rating": 4.8, "reviews": 130, "aiHint": "yellow lemons" },
    { "id": "36", "name": "Pineapple", "description": "Whole ripe pineapple.", "price": 3.10, "image": "https://source.unsplash.com/300x300/?pineapple,fruit", "category": "Fruits", "stock": 60, "rating": 4.7, "reviews": 90, "aiHint": "pineapple fruit" },
    { "id": "37", "name": "Bottled Water", "description": "1.5L purified bottled water.", "price": 1.20, "image": "https://source.unsplash.com/300x300/?bottled,water", "category": "Beverages", "stock": 200, "rating": 4.9, "reviews": 300, "aiHint": "bottled water" },
    { "id": "38", "name": "Cashew Nuts", "description": "200g pack of roasted cashews.", "price": 5.00, "image": "https://source.unsplash.com/300x300/?roasted,cashew,nuts", "category": "Snacks", "stock": 50, "rating": 4.9, "reviews": 140, "aiHint": "roasted cashew nuts" },
    { "id": "39", "name": "Onions", "description": "1kg of red onions.", "price": 2.00, "image": "https://source.unsplash.com/300x300/?red,onions", "category": "Vegetables", "stock": 120, "rating": 4.5, "reviews": 110, "aiHint": "red onions" },
    { "id": "40", "name": "Green Tea", "description": "20 bags of herbal green tea.", "price": 3.00, "image": "https://source.unsplash.com/300x300/?green,tea,bags", "category": "Beverages", "stock": 70, "rating": 4.8, "reviews": 160, "aiHint": "green tea bags" },
    { "id": "41", "name": "Cucumber", "description": "Fresh long cucumbers.", "price": 1.60, "image": "https://source.unsplash.com/300x300/?fresh,cucumber", "category": "Vegetables", "stock": 95, "rating": 4.6, "reviews": 75, "aiHint": "fresh cucumber" },
    { "id": "42", "name": "Bagels", "description": "Pack of 4 plain bagels.", "price": 3.50, "image": "https://source.unsplash.com/300x300/?bagel,bread", "category": "Bakery", "stock": 45, "rating": 4.7, "reviews": 90, "aiHint": "bagel bread" }
];

async function importProducts() {
  console.log('Starting product import...');
  for (const product of products) {
    try {
      // Add each product as a document to the "products" collection
      // Using product.id as the document ID
      await db.collection('products').doc(product.id).set(product);
      console.log(`Successfully imported product: ${product.name} with ID: ${product.id}`);
    } catch (error) {
      console.error(`Error importing product ${product.name}:`, error);
    }
  }
  console.log('Product import finished.');
}

importProducts();
