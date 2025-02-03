import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
        if (data?.size?.length > 0) setSelectedSize(data.size[0]);
        if (data?.color?.length > 0) setSelectedColor(data.color[0]);

        // Check if product is in wishlist
        if (user) {
          const { data: wishlistData, error: wishlistError } = await supabase
            .from('wishlists')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', id)
            .single();

          if (!wishlistError) {
            setIsInWishlist(!!wishlistData);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize || !selectedColor) {
      toast.error('Please select both size and color');
      return;
    }

    addToCart(product, selectedSize, selectedColor);
    toast.success('Added to cart!');
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to manage wishlist');
      navigate('/signin');
      return;
    }

    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);

        if (error) throw error;
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, product_id: id });

        if (error) throw error;
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg"
          />
          <button
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ${
              isInWishlist ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-6">${product.price}</p>
          
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-2">Size</h2>
            <div className="grid grid-cols-4 gap-2">
              {product.size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-sm font-medium rounded-md ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-2">Color</h2>
            <div className="grid grid-cols-4 gap-2">
              {product.color.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`py-2 text-sm font-medium rounded-md ${
                    selectedColor === color
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}