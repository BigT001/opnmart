'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, Download, Filter } from 'lucide-react';
import { getSpecificationsByCategory } from '@/config/productSpecifications';
import { BRANDS_BY_SUBCATEGORY } from '@/config/categories';
import {
  ProductsTable,
  ImageUpload,
  ProductForm,
  TabNav,
} from './components';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'rejected';
  image?: string;
  images?: Array<{ url: string; publicId?: string }>;
  brand?: string;
  description?: string;
  condition?: string;
  createdAt: string;
}

interface ProductVariant {
  id: string;
  productName: string;
  type: 'color' | 'size' | 'style' | 'bundle';
  values: string[];
  sku: string;
}

interface ProductImage {
  file: File;
  preview: string;
  id: string;
}

export default function Products() {
  const params = useParams();
  const vendorId = params.vendorId as string;
  
  const [productTab, setProductTab] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load products from API when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await fetch(`http://localhost:3001/products?vendor=${vendorId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Products loaded:', data);
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (vendorId) {
      loadProducts();
    }
  }, [vendorId]);

  // Product form state
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    productName: '',
    type: 'color' as const,
    values: '',
    sku: '',
  });

  const categories = {
    electronics: ['mobile_phones', 'laptops', 'cameras', 'tablets', 'headphones', 'speakers', 'power_banks', 'microphones', 'televisions', 'cctv', 'networking', 'smart_gadgets', 'office_electronics', 'power_energy'],
    appliances: ['refrigerators', 'ac', 'generators', 'washing_machines', 'cookers_ovens', 'cleaning_appliances', 'fans_cooling', 'inverter_solar', 'kitchen_appliances', 'home_appliances'],
    furniture: ['sofas', 'beds', 'tables', 'storage', 'lighting'],
    grocery: ['fresh_produce', 'dairy', 'beverages', 'snacks', 'spices'],
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
    smart_gadgets: 'Smart Gadgets',
    office_electronics: 'Office Electronics',
    power_energy: 'Power & Energy',
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

  const currentSpecs = getSpecificationsByCategory(formData.category, formData.subcategory);

  // Handle adding new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    // Brand is optional for grocery category
    const categoriesWithoutBrand = ['grocery'];
    const requiresBrand = !categoriesWithoutBrand.includes(formData.category);
    if (requiresBrand && !formData.brand) newErrors.brand = 'Brand is required';
    else if (categoriesWithoutBrand.includes(formData.category) && !formData.brand) {
      // For grocery, set brand to "None" if not selected
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Validate we have at least one image
      if (productImages.length === 0) {
        setErrors({ images: 'At least 1 image is required' });
        setIsLoading(false);
        return;
      }

      // Create FormData to send images and product data
      const formDataToSend = new FormData();
      
      // Add primary product image (first image)
      formDataToSend.append('image', productImages[0].file);

      // Add additional product images (2nd to 5th)
      productImages.forEach((img, index) => {
        if (index > 0) {
          formDataToSend.append(`productImage_${index - 1}`, img.file);
        }
      });

      // Add product data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      // For grocery, use "None" if no brand selected; for others use the selected brand
      const brandValue = formData.category === 'grocery' 
        ? (formData.brand || 'None') 
        : formData.brand;
      formDataToSend.append('brand', brandValue);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('oldPrice', formData.oldPrice || '0');
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('badge', formData.badge || '');
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('vendorId', vendorId);
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));

      // Log what we're sending
      console.log('Sending product data:', {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: brandValue,
        price: formData.price,
        stock: formData.stock,
        vendorId: vendorId,
        imagesCount: productImages.length,
      });

      // Send to API
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Product created successfully:', result);

      const newProduct: Product = {
        id: result.product?.id || result.id || Date.now().toString(),
        name: formData.name,
        category: formData.subcategory,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setProducts([...products, newProduct]);
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
      alert('Product created successfully!');
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create product',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop for images
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      category: value,
      subcategory: '',
      specifications: {},
    }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      subcategory: value,
      specifications: {},
    }));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">📦 Products Management</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNav
        activeTab={productTab}
        onTabChange={setProductTab}
        productCount={products.length}
      />

      {/* All Products Tab */}
      {productTab === 'all' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              You have {products.length} product{products.length !== 1 ? 's' : ''} listed
            </p>
          </div>

          {isLoadingProducts ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-12 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No products found</p>
              <button
                onClick={() => setProductTab('new')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <ProductsTable
                products={products}
                filterStatus={filterStatus}
              />
            </>
          )}
        </div>
      )}

      {/* Add New Product Tab */}
      {productTab === 'new' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold mb-6">Add New Product</h3>
          <ProductForm
            formData={formData}
            productImages={productImages}
            errors={errors}
            isLoading={isLoading}
            categories={categories}
            subcategoryMap={subcategoryMap}
            currentSpecs={currentSpecs}
            dragActive={dragActive}
            onFormSubmit={handleAddProduct}
            onInputChange={handleInputChange}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onImageInput={handleImageInput}
            onRemoveImage={removeImage}
            onSpecChange={handleSpecificationChange}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            getBrandsBySubcategory={getBrandsBySubcategory}
          />
        </div>
      )}

      {/* Variants Tab */}
      {productTab === 'variants' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Variants management coming soon...</p>
        </div>
      )}

      {/* Settings Tab */}
      {productTab === 'settings' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold mb-6">Product Settings</h3>
          {/* Settings content would go here */}
        </div>
      )}
    </div>
  );
}
