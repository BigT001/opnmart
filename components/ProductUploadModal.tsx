'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader, ChevronDown } from 'lucide-react';
import { getSpecificationsByCategory } from '@/config/productSpecifications';
import { BRANDS_BY_SUBCATEGORY } from '@/config/categories';

interface ProductUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
}

export default function ProductUploadModal({ isOpen, onClose, onSubmit }: ProductUploadProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'electronics',
    subcategory: '',
    brand: '',
    price: '',
    oldPrice: '',
    stock: '',
    image: null as File | null,
    imagePreview: '',
    badge: '',
    condition: 'Brand New',
    specifications: {} as Record<string, any>,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = {
    electronics: ['mobile_phones', 'laptops', 'cameras', 'tablets', 'headphones', 'speakers', 'power_banks', 'microphones', 'televisions', 'cctv', 'networking', 'smart_gadgets', 'office_electronics', 'power_energy'],
    appliances: ['refrigerators', 'ac', 'generators', 'washing_machines', 'cookers_ovens', 'cleaning_appliances', 'fans_cooling', 'inverter_solar', 'kitchen_appliances', 'home_appliances'],
    furniture: ['sofas', 'beds', 'tables', 'storage', 'lighting'],
    grocery: ['fresh_produce', 'dairy', 'beverages', 'snacks', 'spices'],
  };

  // Get brands specific to the selected subcategory
  const getBrandsBySubcategory = (): string[] => {
    if (!formData.subcategory) return [];
    
    // Map subcategory to the key used in BRANDS_BY_SUBCATEGORY
    const subcategoryKey = formData.subcategory as any;
    const brandData = (BRANDS_BY_SUBCATEGORY as any)[subcategoryKey];
    
    if (!brandData) return [];
    
    // If it's an object (like smartphones/feature_phones), flatten it to an array
    let brands: string[] = [];
    if (typeof brandData === 'object' && !Array.isArray(brandData)) {
      brands = Object.values(brandData).flat() as string[];
    } else if (Array.isArray(brandData)) {
      brands = brandData;
    }
    
    // Deduplicate brands using Set to avoid React key warnings
    return Array.from(new Set(brands));
  };

  const subcategoryMap: Record<string, string> = {
    mobile_phones: 'Mobile Phones',
    laptops: 'Laptops',
    cameras: 'Cameras',
    tablets: 'Tablets',
    headphones: 'Headphones',
    speakers: 'Speakers',
    power_banks: 'Power Banks',
    microphones: 'Microphones',
    televisions: 'Televisions (TVs)',
    cctv: 'CCTV & Security',
    networking: 'Networking Devices',
    refrigerators: 'Refrigerators',
    generators: 'Generators',
    sofas: 'Sofas & Chairs',
    beds: 'Beds & Mattresses',
    tables: 'Tables & Desks',
    storage: 'Storage & Shelves',
    lighting: 'Lighting',
    fresh_produce: 'Fresh Produce',
    dairy: 'Dairy & Eggs',
    beverages: 'Beverages',
    snacks: 'Snacks & Treats',
    spices: 'Spices & Seasonings',
  };

  const currentSpecs = getSpecificationsByCategory(formData.category, formData.subcategory);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price))) newErrors.price = 'Price must be a number';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (isNaN(Number(formData.stock))) newErrors.stock = 'Stock must be a number';
    if (!formData.image) newErrors.image = 'Product image is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';

    // Validate required specifications
    currentSpecs.forEach(spec => {
      if (spec.required && !formData.specifications[spec.name]) {
        newErrors[`spec_${spec.name}`] = `${spec.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSpecificationChange = (specName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specName]: value,
      },
    }));
    if (errors[`spec_${specName}`]) {
      setErrors(prev => ({ ...prev, [`spec_${specName}`]: '' }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as keyof typeof categories;
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: '',
      specifications: {}, // Clear specs when category changes
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    setFormData(prev => ({
      ...prev,
      subcategory,
      specifications: {}, // Clear specs when subcategory changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('oldPrice', formData.oldPrice || '');
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('badge', formData.badge || '');
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));
      formDataToSend.append('vendorId', 'vendor-1'); // TODO: Get from auth context
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Upload to API
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Failed to parse error response:', e);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        const errorMessage = (errorData?.details || errorData?.error || 'Failed to upload product') as string;
        console.error('API Error Response:', { status: response.status, data: errorData });
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Call onSubmit with the response data
      onSubmit({
        id: Date.now(),
        name: data.product.name,
        description: formData.description,
        category: data.product.category,
        subcategory: data.product.subcategory,
        brand: data.product.brand,
        price: data.product.price,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        image: data.product.image,
        badge: data.product.badge || 'New',
        condition: data.product.condition,
        stock: data.product.stock,
        specifications: data.product.specifications,
        rating: 5,
        reviews: 0,
        sold: 0,
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'electronics',
        subcategory: '',
        brand: '',
        price: '',
        oldPrice: '',
        stock: '',
        image: null,
        imagePreview: '',
        badge: '',
        condition: 'Brand New',
        specifications: {},
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to upload product',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Submission Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Samsung Galaxy A13"
              className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product features, specifications, and benefits..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
              >
                <option value="electronics">Electronics</option>
                <option value="appliances">Appliances</option>
                <option value="furniture">Furniture</option>
                <option value="grocery">Grocery Store</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Subcategory *</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
                className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                  errors.subcategory ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              >
                <option value="">Select subcategory</option>
                {categories[formData.category as keyof typeof categories].map(sub => (
                  <option key={sub} value={sub}>
                    {subcategoryMap[sub] || sub}
                  </option>
                ))}
              </select>
              {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
            </div>
          </div>

          {/* Brand & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Brand *</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                  errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              >
                <option value="">Select brand</option>
                {getBrandsBySubcategory().map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Product Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          {/* Dynamic Specifications Section */}
          {currentSpecs.length > 0 && (
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
              <h3 className="text-lg font-bold mb-4 text-black dark:text-white flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSpecs.map(spec => (
                  <div key={spec.name}>
                    <label className="block text-sm font-semibold mb-2">
                      {spec.label}
                      {spec.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {spec.type === 'select' ? (
                      <select
                        value={formData.specifications[spec.name] || ''}
                        onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                          errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                        }`}
                      >
                        <option value="">{spec.placeholder || 'Select option'}</option>
                        {spec.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : spec.type === 'textarea' ? (
                      <textarea
                        value={formData.specifications[spec.name] || ''}
                        onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                        placeholder={spec.placeholder}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                          errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                        }`}
                      />
                    ) : spec.type === 'checkbox' ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.specifications[spec.name] || false}
                          onChange={(e) => handleSpecificationChange(spec.name, e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">{spec.label}</span>
                      </label>
                    ) : (
                      <input
                        type={spec.type}
                        value={formData.specifications[spec.name] || ''}
                        onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                        placeholder={spec.placeholder}
                        min={spec.min}
                        max={spec.max}
                        step={spec.step || 1}
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                          errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                        }`}
                      />
                    )}

                    {spec.helpText && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{spec.helpText}</p>
                    )}
                    {errors[`spec_${spec.name}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`spec_${spec.name}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Selling Price (₦) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="95000"
                className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                  errors.price ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Original Price (₦)</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                placeholder="120000 (optional)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Stock & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="50"
                className={`w-full px-4 py-3 border rounded-lg dark:bg-zinc-800 dark:text-white transition ${
                  errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Badge (optional)</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
              >
                <option value="">No badge</option>
                <option value="Hot Deal">Hot Deal</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Premium">Premium</option>
                <option value="Value Deal">Value Deal</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Image *</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer">
              {formData.imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
