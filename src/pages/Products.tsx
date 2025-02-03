import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase.from('products').select('*');
        
        if (category === 'new') {
          query = query.eq('new_arrival', true);
        } else if (category === 'sale') {
          query = query.eq('sale', true);
        } else if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Products'}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <Link to={`/product/${product.id}`}>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
            </Link>
            <button
              onClick={() => addToWishlist(product.id)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
            >
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <div className="mt-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}