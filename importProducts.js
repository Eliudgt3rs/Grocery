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
    { "id": "1", "name": "Fresh Apples", "description": "Crisp and juicy red apples.", "price": 2.50, "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop", "category": "Fruits", "stock": 100, "rating": 4.5, "reviews": 120, "aiHint": "fresh apples" },
    { "id": "2", "name": "Organic Bananas", "description": "A bunch of ripe organic bananas.", "price": 1.80, "image": "https://images.unsplash.com/photo-1571771894824-de696542458e?w=300&h=300&fit=crop", "category": "Fruits", "stock": 150, "rating": 4.8, "reviews": 250, "aiHint": "organic bananas" },
    { "id": "3", "name": "Carrots", "description": "Fresh, crunchy carrots.", "price": 1.20, "image": "https://images.unsplash.com/photo-1582515072040-3d5f997c3854?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 200, "rating": 4.6, "reviews": 90, "aiHint": "fresh carrots" },
    { "id": "4", "name": "Spinach", "description": "A bag of fresh spinach leaves.", "price": 2.00, "image": "https://images.unsplash.com/photo-1576045057995-568f588f2f8a?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 80, "rating": 4.7, "reviews": 75, "aiHint": "fresh spinach" },
    { "id": "5", "name": "Fresh Milk", "description": "1L of fresh pasteurized milk.", "price": 1.50, "image": "https://images.unsplash.com/photo-1620189507195-68309c04c4d5?w=300&h=300&fit=crop", "category": "Dairy", "stock": 120, "rating": 4.9, "reviews": 300, "aiHint": "milk carton" },
    { "id": "6", "name": "Cheddar Cheese", "description": "250g block of mature cheddar cheese.", "price": 4.50, "image": "https://images.unsplash.com/photo-1618164435735-413d7dec0d92?w=300&h=300&fit=crop", "category": "Dairy", "stock": 60, "rating": 4.8, "reviews": 150, "aiHint": "cheese block" },
    { "id": "7", "name": "Whole Wheat Bread", "description": "A loaf of freshly baked whole wheat bread.", "price": 3.00, "image": "https://images.unsplash.com/photo-1534620808146-d336b309539d?w=300&h=300&fit=crop", "category": "Bakery", "stock": 50, "rating": 4.7, "reviews": 180, "aiHint": "bread loaf" },
    { "id": "8", "name": "Croissants", "description": "Pack of 4 buttery croissants.", "price": 4.00, "image": "https://images.unsplash.com/photo-1568940121323-33b683b584a3?w=300&h=300&fit=crop", "category": "Bakery", "stock": 40, "rating": 4.9, "reviews": 210, "aiHint": "buttery croissants" },
    { "id": "9", "name": "Chicken Breast", "description": "500g of skinless chicken breast fillets.", "price": 7.50, "image": "https://images.unsplash.com/photo-1604503468818-a15993a404b9?w=300&h=300&fit=crop", "category": "Meat", "stock": 30, "rating": 4.8, "reviews": 110, "aiHint": "raw chicken" },
    { "id": "10", "name": "Ground Beef", "description": "500g of lean ground beef.", "price": 8.00, "image": "https://images.unsplash.com/photo-1620921027798-924373a80242?w=300&h=300&fit=crop", "category": "Meat", "stock": 25, "rating": 4.7, "reviews": 95, "aiHint": "ground beef" },
    { "id": "11", "name": "Avocado", "description": "Ripe and creamy Hass avocado.", "price": 1.75, "image": "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=300&h=300&fit=crop", "category": "Fruits", "stock": 90, "rating": 4.9, "reviews": 400, "aiHint": "ripe avocado" },
    { "id": "12", "name": "Tomatoes", "description": "A pound of fresh, vine-ripened tomatoes.", "price": 2.20, "image": "https://images.unsplash.com/photo-1582284540020-8acbe03fecf3?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 110, "rating": 4.6, "reviews": 130, "aiHint": "vine tomatoes" },
    { "id": "13", "name": "Broccoli", "description": "Fresh green broccoli crowns.", "price": 2.30, "image": "https://images.unsplash.com/photo-1628779234051-4d07a25357d2?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 100, "rating": 4.6, "reviews": 85, "aiHint": "fresh broccoli" },
    { "id": "14", "name": "Blueberries", "description": "A 150g pack of sweet blueberries.", "price": 3.20, "image": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&h=300&fit=crop", "category": "Fruits", "stock": 70, "rating": 4.8, "reviews": 190, "aiHint": "blueberries pack" },
    { "id": "15", "name": "Greek Yogurt", "description": "500g tub of plain Greek yogurt.", "price": 3.50, "image": "https://images.unsplash.com/photo-1562119460-729052b61642?w=300&h=300&fit=crop", "category": "Dairy", "stock": 60, "rating": 4.7, "reviews": 140, "aiHint": "greek yogurt" },
    { "id": "16", "name": "Brown Eggs", "description": "Tray of 12 farm-fresh brown eggs.", "price": 3.00, "image": "https://images.unsplash.com/photo-1598965674228-4f83b1a8a25c?w=300&h=300&fit=crop", "category": "Dairy", "stock": 100, "rating": 4.9, "reviews": 280, "aiHint": "tray of eggs" },
    { "id": "17", "name": "White Rice", "description": "2kg pack of long grain white rice.", "price": 4.20, "image": "https://images.unsplash.com/photo-1586201375765-c1248ef7d8ce?w=300&h=300&fit=crop", "category": "Pantry", "stock": 200, "rating": 4.6, "reviews": 160, "aiHint": "white rice grains" },
    { "id": "18", "name": "Peanut Butter", "description": "500g jar of creamy peanut butter.", "price": 3.80, "image": "https://images.unsplash.com/photo-1616032431114-131103c80918?w=300&h=300&fit=crop", "category": "Pantry", "stock": 90, "rating": 4.8, "reviews": 175, "aiHint": "jar of peanut butter" },
    { "id": "19", "name": "Orange Juice", "description": "1L bottle of 100% orange juice.", "price": 2.90, "image": "https://images.unsplash.com/photo-1613478223719-2ab802641a24?w=300&h=300&fit=crop", "category": "Beverages", "stock": 120, "rating": 4.7, "reviews": 150, "aiHint": "orange juice bottle" },
    { "id": "20", "name": "Beef Sausages", "description": "Pack of 6 beef sausages.", "price": 5.20, "image": "https://images.unsplash.com/photo-1591989330748-746f1424a61e?w=300&h=300&fit=crop", "category": "Meat", "stock": 50, "rating": 4.6, "reviews": 100, "aiHint": "beef sausage pack" },
    { "id": "21", "name": "Lettuce", "description": "Crisp iceberg lettuce head.", "price": 1.90, "image": "https://images.unsplash.com/photo-1556801712-84c73444439c?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 80, "rating": 4.5, "reviews": 70, "aiHint": "fresh lettuce" },
    { "id": "22", "name": "Green Grapes", "description": "500g pack of seedless green grapes.", "price": 3.70, "image": "https://images.unsplash.com/photo-1620912189836-167885b0d885?w=300&h=300&fit=crop", "category": "Fruits", "stock": 60, "rating": 4.8, "reviews": 165, "aiHint": "green grapes" },
    { "id": "23", "name": "Whole Chicken", "description": "1.5kg whole fresh chicken.", "price": 9.50, "image": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&h=300&fit=crop", "category": "Meat", "stock": 40, "rating": 4.7, "reviews": 110, "aiHint": "whole chicken" },
    { "id": "24", "name": "Butter", "description": "250g salted butter block.", "price": 2.60, "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop", "category": "Dairy", "stock": 70, "rating": 4.9, "reviews": 145, "aiHint": "salted butter" },
    { "id": "25", "name": "Strawberries", "description": "250g punnet of ripe strawberries.", "price": 3.90, "image": "https://images.unsplash.com/photo-1587393855524-087f83d95c9f?w=300&h=300&fit=crop", "category": "Fruits", "stock": 55, "rating": 4.9, "reviews": 230, "aiHint": "fresh strawberries" },
    { "id": "26", "name": "Cabbage", "description": "Large green cabbage head.", "price": 1.80, "image": "https://images.unsplash.com/photo-1563245465-d4b3b27690f3?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 85, "rating": 4.5, "reviews": 60, "aiHint": "green cabbage" },
    { "id": "27", "name": "Brown Bread", "description": "Sliced brown sandwich bread.", "price": 2.80, "image": "https://images.unsplash.com/photo-1598373153527-35c13778916e?w=300&h=300&fit=crop", "category": "Bakery", "stock": 65, "rating": 4.6, "reviews": 95, "aiHint": "brown sliced bread" },
    { "id": "28", "name": "Almond Milk", "description": "1L of unsweetened almond milk.", "price": 3.20, "image": "https://images.unsplash.com/photo-1626301439009-84b2a3739a8c?w=300&h=300&fit=crop", "category": "Dairy", "stock": 75, "rating": 4.7, "reviews": 125, "aiHint": "almond milk carton" },
    { "id": "29", "name": "Mangoes", "description": "2 large juicy mangoes.", "price": 2.60, "image": "https://images.unsplash.com/photo-1591078455333-fee3f4a363d3?w=300&h=300&fit=crop", "category": "Fruits", "stock": 95, "rating": 4.8, "reviews": 190, "aiHint": "fresh mangoes" },
    { "id": "30", "name": "Zucchini", "description": "Fresh green zucchini squash.", "price": 2.10, "image": "https://images.unsplash.com/photo-1509933560191-4a52093554e2?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 100, "rating": 4.6, "reviews": 80, "aiHint": "green zucchini" },
    { "id": "31", "name": "Apple Juice", "description": "1L bottle of 100% apple juice.", "price": 2.70, "image": "https://images.unsplash.com/photo-1533157941595-86a375e8e826?w=300&h=300&fit=crop", "category": "Beverages", "stock": 90, "rating": 4.6, "reviews": 120, "aiHint": "apple juice bottle" },
    { "id": "32", "name": "Tomato Sauce", "description": "500g bottle of classic tomato sauce.", "price": 1.90, "image": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=300&h=300&fit=crop", "category": "Pantry", "stock": 110, "rating": 4.5, "reviews": 140, "aiHint": "tomato sauce bottle" },
    { "id": "33", "name": "Breakfast Cereal", "description": "500g box of crunchy cereal.", "price": 4.00, "image": "https://images.unsplash.com/photo-1503431128871-373b3840f2f6?w=300&h=300&fit=crop", "category": "Pantry", "stock": 85, "rating": 4.6, "reviews": 160, "aiHint": "cereal box" },
    { "id": "34", "name": "Sweet Potatoes", "description": "1kg of fresh sweet potatoes.", "price": 3.30, "image": "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 90, "rating": 4.7, "reviews": 100, "aiHint": "sweet potatoes" },
    { "id": "35", "name": "Lemons", "description": "4 fresh yellow lemons.", "price": 1.50, "image": "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=300&fit=crop", "category": "Fruits", "stock": 75, "rating": 4.8, "reviews": 130, "aiHint": "yellow lemons" },
    { "id": "36", "name": "Pineapple", "description": "Whole ripe pineapple.", "price": 3.10, "image": "https://images.unsplash.com/photo-1587825140708-df87693b6846?w=300&h=300&fit=crop", "category": "Fruits", "stock": 60, "rating": 4.7, "reviews": 90, "aiHint": "pineapple fruit" },
    { "id": "37", "name": "Bottled Water", "description": "1.5L purified bottled water.", "price": 1.20, "image": "https://images.unsplash.com/photo-1556742510-c6a233355570?w=300&h=300&fit=crop", "category": "Beverages", "stock": 200, "rating": 4.9, "reviews": 300, "aiHint": "bottled water" },
    { "id": "38", "name": "Cashew Nuts", "description": "200g pack of roasted cashews.", "price": 5.00, "image": "https://images.unsplash.com/photo-1605302343290-62cb65b0b2e3?w=300&h=300&fit=crop", "category": "Snacks", "stock": 50, "rating": 4.9, "reviews": 140, "aiHint": "roasted cashew nuts" },
    { "id": "39", "name": "Onions", "description": "1kg of red onions.", "price": 2.00, "image": "https://images.unsplash.com/photo-1587049352851-d481b0139158?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 120, "rating": 4.5, "reviews": 110, "aiHint": "red onions" },
    { "id": "40", "name": "Green Tea", "description": "20 bags of herbal green tea.", "price": 3.00, "image": "https://images.unsplash.com/photo-1627435601361-ec25f2b7442a?w=300&h=300&fit=crop", "category": "Beverages", "stock": 70, "rating": 4.8, "reviews": 160, "aiHint": "green tea bags" },
    { "id": "41", "name": "Cucumber", "description": "Fresh long cucumbers.", "price": 1.60, "image": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop", "category": "Vegetables", "stock": 95, "rating": 4.6, "reviews": 75, "aiHint": "fresh cucumber" },
    { "id": "42", "name": "Bagels", "description": "Pack of 4 plain bagels.", "price": 3.50, "image": "https://images.unsplash.com/photo-1597858332322-817acb765b82?w=300&h=300&fit=crop", "category": "Bakery", "stock": 45, "rating": 4.7, "reviews": 90, "aiHint": "bagel bread" }
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
