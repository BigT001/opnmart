'use client';

import { Loader } from 'lucide-react';
import ImageUpload from './ImageUpload';
import CategorySelection from './CategorySelection';
import BasicInfo from './BasicInfo';
import PricingStock from './PricingStock';
import Specifications from './Specifications';

interface ProductImage {
  file: File;
  preview: string;
  id: string;
}

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    brand: string;
    price: string;
    oldPrice: string;
    stock: string;
    badge: string;
    condition: string;
    specifications: Record<string, any>;
  };
  productImages: ProductImage[];
  errors: Record<string, string>;
  isLoading: boolean;
  categories: Record<string, string[]>;
  subcategoryMap: Record<string, string>;
  currentSpecs: any[];
  dragActive: boolean;
  onFormSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onImageInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onSpecChange: (specName: string, value: any) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubcategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  getBrandsBySubcategory: () => string[];
}

export default function ProductForm({
  formData,
  productImages,
  errors,
  isLoading,
  categories,
  subcategoryMap,
  currentSpecs,
  dragActive,
  onFormSubmit,
  onInputChange,
  onDrag,
  onDrop,
  onImageInput,
  onRemoveImage,
  onSpecChange,
  onCategoryChange,
  onSubcategoryChange,
  getBrandsBySubcategory,
}: ProductFormProps) {
  return (
    <form onSubmit={onFormSubmit} className="space-y-8">
      {/* Error Alert */}
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-700 dark:text-red-400 font-medium">{errors.submit}</p>
        </div>
      )}

      {/* Image Upload */}
      <ImageUpload
        dragActive={dragActive}
        onDrag={onDrag}
        onDrop={onDrop}
        onImageInput={onImageInput}
        images={productImages}
        onRemoveImage={onRemoveImage}
        error={errors.images}
        isLoading={isLoading}
      />

      {/* Category & Subcategory */}
      <CategorySelection
        category={formData.category}
        subcategory={formData.subcategory}
        onCategoryChange={onCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
        categories={categories}
        subcategoryMap={subcategoryMap}
        errors={errors}
      />

      {/* Basic Information */}
      <BasicInfo
        name={formData.name}
        description={formData.description}
        brand={formData.brand}
        condition={formData.condition}
        category={formData.category}
        onInputChange={onInputChange}
        getBrandsBySubcategory={getBrandsBySubcategory}
        errors={errors}
      />

      {/* Pricing & Stock */}
      <PricingStock
        price={formData.price}
        oldPrice={formData.oldPrice}
        stock={formData.stock}
        badge={formData.badge}
        onInputChange={onInputChange}
        errors={errors}
      />

      {/* Specifications */}
      <Specifications
        specifications={formData.specifications}
        currentSpecs={currentSpecs}
        onSpecChange={onSpecChange}
        errors={errors}
      />

      {/* Submit Button */}
      <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            '✨ Create Product'
          )}
        </button>
      </div>
    </form>
  );
}
