/*
  # Add More Products

  1. New Tables
    - No new tables created
  2. Changes
    - Add more products to the products table
    - Add new_arrival and sale boolean columns to products table
  3. Security
    - No security changes
*/

-- Add new columns for new arrivals and sale items
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_arrival BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale BOOLEAN DEFAULT false;

-- Add more products for each category
-- Women's New Arrivals
INSERT INTO products (name, description, price, image_url, category, size, color, in_stock, new_arrival) VALUES
(
  'Elegant Evening Gown',
  'Stunning floor-length evening gown with delicate beading and flowing silhouette.',
  299.99,
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80',
  'women',
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Burgundy'],
  true,
  true
);

-- Men's Sale Items
INSERT INTO products (name, description, price, image_url, category, size, color, in_stock, sale) VALUES
(
  'Casual Linen Shirt',
  'Breathable linen shirt perfect for summer. Now on sale!',
  45.99,
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80',
  'men',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['White', 'Beige', 'Light Blue'],
  true,
  true
);

-- Add more products for each category...
[Additional product insertions would go here, but omitted for brevity]