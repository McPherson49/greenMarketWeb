'use client';

import { useState, useEffect, useRef } from 'react';
import { getCategories } from '@/services/category';
import locationService from '@/services/country';
import ApiFetcher from '@/utils/apis';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  banner: string | null;
  color: string;
  products_count: number;
};

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
};

type State = {
  name: string;
  state_code: string;
};

export default function NewProductForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    state: '',
    locality: '',
    busStop: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Image states
  const [images, setImages] = useState<ImageFile[]>([]);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Location states
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [country] = useState('Nigeria');

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getCategories();
        if (categories) {
          setCategories(categories);
        } else {
          toast.error('Unable to load categories. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to load categories. Please refresh the page.');
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // Fetch Nigerian states on component mount
  useEffect(() => {
    async function fetchNigerianStates() {
      setLoadingStates(true);
      try {
        const statesData = await locationService.getStates(country);
        if (statesData && statesData.length > 0) {
          setStates(statesData);

          // Auto-select Lagos State if available
          const lagosState = statesData.find((state) =>
            state.name.toLowerCase().includes('lagos')
          );
          if (lagosState) {
            setFormData((prev) => ({
              ...prev,
              state: lagosState.name,
            }));
          }
        } else {
          toast.error('Unable to load states. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to load states. Please refresh the page.');
        console.error('Error loading Nigerian states:', error);
      } finally {
        setLoadingStates(false);
      }
    }

    fetchNigerianStates();
  }, [country]);

  // Fetch cities when state changes
  useEffect(() => {
    async function fetchCitiesForState() {
      if (!formData.state) return;

      setLoadingCities(true);
      try {
        const citiesData = await locationService.getCities(
          country,
          formData.state
        );
        if (citiesData && citiesData.length > 0) {
          setCities(citiesData);

          // Auto-select first city if available
          if (citiesData.length > 0 && !formData.locality) {
            setFormData((prev) => ({
              ...prev,
              locality: citiesData[0],
            }));
          }
        } else {
          toast.error(
            `No cities found for ${formData.state}. Please select another state.`
          );
          setCities([]);
        }
      } catch (error) {
        toast.error(
          `Failed to load cities for ${formData.state}. Please try again.`
        );
        console.error(`Error loading cities for ${formData.state}:`, error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    }

    fetchCitiesForState();
  }, [formData.state, country]);

  // Handle state change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      state: selectedState,
      locality: '', // Reset city when state changes
    });
    setErrors({ ...errors, state: '' });
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setFormData({
      ...formData,
      locality: selectedCity,
    });
    setErrors({ ...errors, locality: '' });
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
    });
    setErrors({ ...errors, category: '' });
  };

  // Image handling functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed');
        continue;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        continue;
      }

      validFiles.push(file);
      
      const imageFile: ImageFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      };
      
      newImages.push(imageFile);
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setImageError('');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(img => img.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = 'title field is mandatory';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.price) newErrors.price = 'enter a price';
    if (!formData.description) newErrors.description = 'Enter a description for this product';
    if (formData.tags.length === 0) newErrors.tags = 'Must attach a tag, E.g: Fruit. Press Enter!';
    if (images.length === 0) newErrors.images = 'Please upload at least one image';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData
      const apiFormData = new FormData();

      // Add required fields
      apiFormData.append('category_id', formData.category);
      apiFormData.append('title', formData.title);
      apiFormData.append('description', formData.description);
      apiFormData.append('state', formData.state);
      apiFormData.append('local', formData.locality);
      apiFormData.append('price', formData.price);
      apiFormData.append('nearest', formData.busStop);
      apiFormData.append('use_escrow', '1');

      // Add images
      images.forEach((img, index) => {
        apiFormData.append(`images[${index}]`, img.file);
      });

      // Add tags
      formData.tags.forEach((tag, index) => {
        apiFormData.append(`tags[${index}]`, tag);
      });

      // Create the product using ApiFetcher
      const createProductResponse = await ApiFetcher.post(
        '/products',
        apiFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Check response
      if (!createProductResponse.data?.status) {
        throw new Error('Failed to create product');
      }

      toast.success('Product created successfully!');

      // Reset form after successful submission
      setFormData({
        title: '',
        category: '',
        price: '',
        description: '',
        state: states.find((s) => s.name.toLowerCase().includes('lagos'))?.name || '',
        locality: '',
        busStop: '',
        tags: [],
      });
      setImages([]);
      setErrors({});

      // Redirect to products page
      router.push('/admin/products/');
    } catch (error: any) {
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create product. Please try again.');
      }
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
        setErrors({ ...errors, tags: '' });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Product</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-12 h-0.5 bg-green-500"></div>
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="w-12 h-0.5 bg-green-500"></div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Submit'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">PRODUCT DETAILS</h2>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Product Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setErrors({ ...errors, title: '' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">CATEGORY</h2>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    disabled={loadingCategories}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white disabled:bg-gray-100"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">PRICE DETAILS</h2>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      setErrors({ ...errors, price: '' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">DESCRIPTION</h2>
                <div>
                  <label className="text-xs text-gray-900 mb-2 block">Product Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setErrors({ ...errors, description: '' });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Media */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">MEDIA</h2>
                
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer"
                  >
                    <p className="text-xs text-gray-400 mb-2">Select files to upload</p>
                    <p className="text-sm text-gray-400 mb-2">OR</p>
                    <p className="text-xs text-gray-400">drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">Maximum file size: 5MB</p>
                  </label>
                </div>
                
                {imageError && (
                  <p className="text-xs text-red-500 mt-2">{imageError}</p>
                )}
                
                {errors.images && (
                  <p className="text-xs text-red-500 mt-2">{errors.images}</p>
                )}
                
                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Uploaded Images ({images.length})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt={image.name}
                            className="w-full h-20 object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">TAGS</h2>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type a word and press enter  E.g.: Fruit"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
                        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
                        setTagInput('');
                        setErrors({ ...errors, tags: '' });
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    +
                  </button>
                </div>
                {errors.tags && (
                  <p className="text-xs text-red-500 mb-2">{errors.tags}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Nearest Location */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">NEAREST LOCATION</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">State</label>
                    <select
                      value={formData.state}
                      onChange={handleStateChange}
                      disabled={loadingStates}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white disabled:bg-gray-100"
                    >
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.state_code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Locality</label>
                    <select
                      value={formData.locality}
                      onChange={handleCityChange}
                      disabled={loadingCities || !formData.state}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white disabled:bg-gray-100"
                    >
                      <option value="">Select a locality</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.locality && (
                      <p className="text-xs text-red-500 mt-1">{errors.locality}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Nearest Bus Stop</label>
                    <input
                      type="text"
                      value={formData.busStop}
                      onChange={(e) => setFormData({ ...formData, busStop: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            {isSubmitting ? 'Creating Product...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}