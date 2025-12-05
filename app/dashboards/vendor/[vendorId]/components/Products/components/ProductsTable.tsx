'use client';

import { useState } from 'react';
import { Eye, Edit2, Trash2, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'rejected';
  image?: string;
  images?: Array<{ url: string; publicId?: string }>;
  createdAt: string;
}

const statusOptions = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'suspended', label: 'Suspended', color: 'red' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
];

interface ProductsTableProps {
  products: Product[];
  filterStatus: string;
}

interface ImageModalProps {
  isOpen: boolean;
  images: (string | { url: string })[];
  productName: string;
  onClose: () => void;
}

function ImageModal({ isOpen, images, productName, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const imageUrls = images.map(img => typeof img === 'string' ? img : img.url);
  const currentImage = imageUrls[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{productName} - Images</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <img 
            src={currentImage} 
            alt={`Product ${currentIndex + 1}`}
            className="w-full h-auto rounded-lg object-contain max-h-96"
          />
        </div>

        <div className="border-t border-gray-200 dark:border-zinc-700 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {imageUrls.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                  currentIndex === idx
                    ? 'border-blue-500'
                    : 'border-gray-200 dark:border-zinc-700'
                }`}
              >
                <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            Image {currentIndex + 1} of {imageUrls.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductsTable({ products, filterStatus }: ProductsTableProps) {
  const [selectedImageProduct, setSelectedImageProduct] = useState<{ id: string; name: string } | null>(null);
  
  const filteredProducts = filterStatus === 'all' 
    ? products 
    : products.filter(p => p.status === filterStatus);

  const getProductImages = (product: Product) => {
    const allImages: (string | { url: string })[] = [];
    if (product.image) allImages.push(product.image);
    if (product.images?.length) allImages.push(...product.images);
    return allImages;
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Product Name</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Images</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const statusOption = statusOptions.find(s => s.value === product.status);
                const productImages = getProductImages(product);
                return (
                  <tr key={product.id} className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        {productImages.length > 0 ? (
                          <>
                            <img 
                              src={typeof productImages[0] === 'string' ? productImages[0] : productImages[0].url}
                              alt="Product"
                              className="w-10 h-10 rounded object-cover"
                            />
                            <button
                              onClick={() => setSelectedImageProduct({ id: product.id, name: product.name })}
                              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                            >
                              {productImages.length} image{productImages.length !== 1 ? 's' : ''}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">No images</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">₦{product.price.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          product.stock === 0
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : product.stock < 10
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm capitalize bg-${statusOption?.color}-100 dark:bg-${statusOption?.color}-900/30 text-${statusOption?.color}-600 dark:text-${statusOption?.color}-400`}
                      >
                        {statusOption?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                        <Edit2 className="h-4 w-4 text-blue-500" />
                      </button>
                      <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImageProduct && (
        <ImageModal
          isOpen={true}
          images={getProductImages(
            filteredProducts.find(p => p.id === selectedImageProduct.id) || filteredProducts[0]
          )}
          productName={selectedImageProduct.name}
          onClose={() => setSelectedImageProduct(null)}
        />
      )}
    </>
  );
}
