'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader, ChevronDown, Plus, Trash2, CheckCircle, Star } from 'lucide-react';
import { getSpecificationsByCategory } from '@/config/productSpecifications';
import { BRANDS_BY_SUBCATEGORY } from '@/config/categories';

interface ProductUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
}

interface ProductImage {
  file: File;
  preview: string;
  id: string;
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
    badge: '',
    condition: 'Brand New',
    specifications: {} as Record<string, any>,
  });

  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = {
    electronics: ['mobile_phones', 'laptops', 'cameras', 'tablets', 'headphones', 'speakers', 'power_banks', 'microphones', 'televisions', 'cctv', 'networking', 'smart_gadgets', 'office_electronics', 'power_energy'],
    appliances: ['refrigerators', 'ac', 'generators', 'washing_machines', 'cookers_ovens', 'cleaning_appliances', 'fans_cooling', 'inverter_solar', 'kitchen_appliances', 'home_appliances'],
    furniture: ['sofas', 'beds', 'tables', 'storage', 'lighting'],
    grocery: ['fresh_produce', 'dairy', 'beverages', 'snacks', 'spices'],
  };

  const getBrandsBySubcategory = (): string[] => {
    if (!formData.subcategory) return [];
    
    const subcategoryKey = formData.subcategory as any;
    const brandData = (BRANDS_BY_SUBCATEGORY as any)[subcategoryKey];
    
    if (!brandData) return [];
    
    let brands: string[] = [];
    if (typeof brandData === 'object' && !Array.isArray(brandData)) {
      brands = Object.values(brandData).flat() as string[];
    } else if (Array.isArray(brandData)) {
      brands = brandData;
    }
    
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
    ac: 'Air Conditioners',
    washing_machines: 'Washing Machines',
    cookers_ovens: 'Cookers & Ovens',
    cleaning_appliances: 'Cleaning Appliances',
    fans_cooling: 'Fans & Cooling',
    inverter_solar: 'Inverter & Solar',
    kitchen_appliances: 'Kitchen Appliances',
    home_appliances: 'Home Appliances',
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
    
    // Brand is optional for grocery category
    const categoriesWithoutBrand = ['grocery'];
    const requiresBrand = !categoriesWithoutBrand.includes(formData.category);
    
    if (requiresBrand && !formData.brand) {
      newErrors.brand = 'Brand is required';
    } else if (categoriesWithoutBrand.includes(formData.category) && !formData.brand) {
      // For grocery, if brand is empty, set it to "None"
      setFormData(prev => ({ ...prev, brand: 'None' }));
    }
    
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price))) newErrors.price = 'Price must be a number';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    if (isNaN(Number(formData.stock))) newErrors.stock = 'Stock must be a number';
    if (productImages.length === 0) newErrors.images = 'At least 1 image is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';

    currentSpecs.forEach(spec => {
      if (spec.required && !formData.specifications[spec.name]) {
        newErrors[`spec_${spec.name}`] = `${spec.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    processImages(files);
  };

  const processImages = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: 'Please upload image files only' }));
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: `File "${file.name}" exceeds 5MB limit` }));
        continue;
      }
      
      if (productImages.length >= 5) {
        setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
        break;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages(prev => [...prev, {
          file,
          preview: reader.result as string,
          id: Date.now() + Math.random().toString(),
        }]);
        setErrors(prev => ({ ...prev, images: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processImages(files);
    }
  };

  const removeImage = (id: string) => {
    setProductImages(prev => prev.filter(img => img.id !== id));
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
      specifications: {},
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    setFormData(prev => ({
      ...prev,
      subcategory,
      specifications: {},
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
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
      formDataToSend.append('vendorId', 'vendor-1');
      
      // Main image is required and sent as 'image' field
      if (productImages.length > 0) {
        formDataToSend.append('image', productImages[0].file);
      }

      // Additional images (up to 4 more)
      productImages.slice(1).forEach((img, index) => {
        formDataToSend.append(`productImage_${index}`, img.file);
      });

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

      // Refetch products to show the newly uploaded product
      try {
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Refreshed products after upload:', productsData);
        }
      } catch (error) {
        console.error('Failed to refresh products:', error);
      }

      onSubmit({
        id: Date.now(),
        name: data.product.name,
        description: formData.description,
        category: data.product.category,
        subcategory: data.product.subcategory,
        brand: data.product.brand,
        price: data.product.price,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        image: data.product.mainImage || data.product.image,
        productImages: data.product.productImages || [],
        badge: data.product.badge || 'New',
        condition: data.product.condition,
        stock: data.product.stock,
        specifications: data.product.specifications,
        rating: 5,
        reviews: 0,
        sold: 0,
      });
      
      setFormData({
        name: '',
        description: '',
        category: 'electronics',
        subcategory: '',
        brand: '',
        price: '',
        oldPrice: '',
        stock: '',
        badge: '',
        condition: 'Brand New',
        specifications: {},
      });
      setProductImages([]);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header with Gradient */}
        <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}/>
          </div>
          <div className="relative h-full flex items-center justify-between px-8">
            <div>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">Upload Product</h2>
              <p className="text-emerald-50 text-sm mt-1">Create your product listing with up to 5 images</p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-3 hover:bg-white/20 rounded-full transition disabled:opacity-50 text-white flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Error Alert */}
            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Image Upload - Full Width */}
            <div>
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-105' 
                    : 'border-gray-300 dark:border-zinc-700 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageInput}
                  className="hidden"
                  id="image-upload"
                  disabled={isLoading}
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full transition ${
                      dragActive 
                        ? 'bg-emerald-500' 
                        : 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                    }`}>
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {dragActive ? 'Drop images here' : 'Drag images or click to upload'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Up to 5 images • PNG, JPG, GIF • Max 5MB each
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-2 font-medium">{errors.images}</p>}
            </div>

            {/* Image Gallery */}
            {productImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-emerald-500" />
                    Your Images ({productImages.length}/5)
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                    First image = Main product image
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {productImages.map((img, index) => (
                    <div key={img.id} className="relative group">
                      <div className="relative overflow-hidden rounded-xl shadow-lg aspect-square">
                        <img
                          src={img.preview}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover transition group-hover:scale-110"
                        />
                        
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Star className="h-3 w-3 fill-white" />
                            Main
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition rounded-xl flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center font-medium">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Category & Subcategory Selection - Most Important */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Select Product Category & Type
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Main Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="electronics">🖥️ Electronics</option>
                    <option value="appliances">🔌 Appliances</option>
                    <option value="furniture">🪑 Furniture</option>
                    <option value="grocery">🛒 Grocery Store</option>
                  </select>
                </div>

                {/* Subcategory - PROMINENT */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleSubcategoryChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold ${
                      errors.subcategory ? 'border-red-500' : 'border-emerald-300 dark:border-emerald-700'
                    }`}
                  >
                    <option value="">🔍 Choose product type...</option>
                    {categories[formData.category as keyof typeof categories].map(sub => (
                      <option key={sub} value={sub}>
                        {subcategoryMap[sub] || sub}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && <p className="text-red-500 text-sm mt-2 font-semibold">{errors.subcategory}</p>}
                </div>
              </div>
            </div>

            {/* STEP 2: Product Basics */}
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Basic Information
              </h3>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Samsung Galaxy A14 5G"
                    className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write a compelling description of your product..."
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                </div>

                {/* Brand & Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Brand {formData.category === 'grocery' ? <span className="text-gray-500 font-normal">(Optional)</span> : <span className="text-red-500">*</span>}
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                      }`}
                    >
                      <option value="">Select brand{formData.category === 'grocery' ? ' (optional)' : ''}</option>
                      {formData.category === 'grocery' && (
                        <option value="None">None</option>
                      )}
                      {getBrandsBySubcategory().map(brand => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    {errors.brand && <p className="text-red-500 text-sm mt-2">{errors.brand}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Brand New">✨ Brand New</option>
                      <option value="Like New">⭐ Like New</option>
                      <option value="Refurbished">🔧 Refurbished</option>
                      <option value="Used">📦 Used</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Pricing & Stock */}
            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Pricing & Stock
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="95000"
                    className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-2">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Old Price (₦)
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    placeholder="120000"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="50"
                    className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-2">{errors.stock}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Badge
                </label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">None</option>
                  <option value="Hot Deal">🔥 Hot Deal</option>
                  <option value="Best Seller">⭐ Best Seller</option>
                  <option value="Premium">💎 Premium</option>
                  <option value="Value Deal">💰 Value Deal</option>
                  <option value="New">✨ New</option>
                </select>
              </div>
            </div>

            {/* Specifications */}
            {currentSpecs.length > 0 && (
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSpecs.map(spec => (
                    <div key={spec.name}>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        {spec.label}
                        {spec.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {spec.type === 'select' ? (
                        <select
                          value={formData.specifications[spec.name] || ''}
                          onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
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
                          className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                          }`}
                        />
                      ) : spec.type === 'checkbox' ? (
                        <label className="flex items-center gap-3 p-3 border-2 border-gray-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                          <input
                            type="checkbox"
                            checked={formData.specifications[spec.name] || false}
                            onChange={(e) => handleSpecificationChange(spec.name, e.target.checked)}
                            className="w-5 h-5 rounded cursor-pointer accent-emerald-500"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{spec.label}</span>
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
                          className={`w-full px-4 py-3 border-2 rounded-xl dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            errors[`spec_${spec.name}`] ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'
                          }`}
                        />
                      )}

                      {spec.helpText && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{spec.helpText}</p>
                      )}
                      {errors[`spec_${spec.name}`] && (
                        <p className="text-red-500 text-sm mt-2">{errors[`spec_${spec.name}`]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-4 border-2 border-gray-300 dark:border-zinc-700 rounded-xl font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Publish Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
