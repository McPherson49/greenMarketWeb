"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCategories } from "@/services/category";
import { getPlans } from "@/services/plan";
import locationService from "@/services/country";
import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Import the PaymentSuccessModal component
import { PaymentSuccessModal } from "./paymentModal";
import { X } from "lucide-react";

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

// Fixed Plan type to properly handle pricing
type Plan = {
  id: number;
  title: string;
  pricing: { [duration: string]: number } | [];
  is_recommended: number;
  created_at: string;
  updated_at: string;
};

// Helper type guard to check if pricing is an object (not array)
const isPricingObject = (
  pricing: Plan["pricing"]
): pricing is { [duration: string]: number } => {
  return !Array.isArray(pricing);
};

type State = {
  name: string;
  state_code: string;
};

type PaymentResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
  open: string;
  message: string;
};

type ProductResponse = {
  data: {
    id: number;
    category_id: string;
    title: string;
    description: string;
    state: string;
    local: string;
    price: string;
    tags: string[];
    nearest: string;
    use_escrow: string;
    images: string[];
    user_id: number;
    slug: string;
    updated_at: string;
    created_at: string;
    plan_id: number;
    views: number;
    user: {
      avatar: string;
      id: number;
      name: string;
      phone: string;
      email: string;
      banner: string | null;
    };
    subscription?: {
      id: number;
      product_id: number;
      title: string;
      span: string;
      amount: number;
      start: string;
      end: string;
      created_at: string;
      updated_at: string;
    };
  };
  message: string;
  status: boolean;
};

export default function NewProductForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    state: "",
    city: "",
    busStop: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [imageError, setImageError] = useState("");

  // New states for payment flow
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // State for location data
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [country] = useState("Nigeria"); // Static country

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getCategories();
        if (categories) {
          setCategories(categories);
        } else {
          toast.error("Unable to load categories. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to load categories. Please refresh the page.");
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
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
            state.name.toLowerCase().includes("lagos")
          );
          if (lagosState) {
            setFormData((prev) => ({
              ...prev,
              state: lagosState.name,
            }));
          }
        } else {
          toast.error("Unable to load states. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to load states. Please refresh the page.");
        console.error("Error loading Nigerian states:", error);
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
          if (citiesData.length > 0 && !formData.city) {
            setFormData((prev) => ({
              ...prev,
              city: citiesData[0],
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

  // Fetch plans when modal opens
  useEffect(() => {
    async function fetchPlans() {
      if (showPromoteModal && plans.length === 0) {
        setPlansLoading(true);
        try {
          const fetchedPlans = await getPlans();
          if (fetchedPlans && fetchedPlans.length > 0) {
            setPlans(fetchedPlans);

            // Auto-select freemium plan if exists
            const freemiumPlan = fetchedPlans.find(
              (plan) => plan.title.toLowerCase() === "freemium"
            );
            if (freemiumPlan) {
              setSelectedPlan(freemiumPlan.id);
              setSelectedDuration(null);
            }
          } else {
            toast.error("No plans available at the moment.");
          }
        } catch (error) {
          toast.error("Failed to load plans. Please try again.");
          console.error("Error loading plans:", error);
        } finally {
          setPlansLoading(false);
        }
      }
    }

    fetchPlans();
  }, [showPromoteModal, plans.length]);

  // Handle state change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      state: selectedState,
      city: "", // Reset city when state changes
    });
    setErrors({ ...errors, state: "" });
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setFormData({
      ...formData,
      city: selectedCity,
    });
    setErrors({ ...errors, city: "" });
  };

  // Handle plan selection
  const handlePlanSelect = (plan: Plan) => {
    const isFreemium = Array.isArray(plan.pricing);

    if (isFreemium) {
      // For freemium plans, just select the plan
      setSelectedPlan(plan.id);
      setSelectedDuration(null);
    } else {
      // For paid plans, select the plan and the first available duration
      const pricingKeys = Object.keys(plan.pricing);
      if (pricingKeys.length > 0) {
        setSelectedPlan(plan.id);
        setSelectedDuration(pricingKeys[0]); // Select first duration by default
      } else {
        toast.error("No pricing options available for this plan.");
      }
    }
  };

  // Handle duration selection
  const handleDurationSelect = (
    planId: number,
    duration: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedPlan(planId);
    setSelectedDuration(duration);
  };

  // Validate form and disable button
  const isFormValid = () => {
    const requiredFields = [
      "title",
      "category",
      "price",
      "description",
      "state",
      "city",
    ];
    return (
      requiredFields.every(
        (field) => formData[field as keyof typeof formData]
      ) &&
      formData.tags.length > 0 &&
      images.length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.title) newErrors.title = "Title field is mandatory";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.price) newErrors.price = "Enter a price";
    if (!formData.description)
      newErrors.description = "Enter a description for this product";
    if (!formData.state) newErrors.state = "Please select a state";
    if (!formData.city) newErrors.city = "Please select a city";
    if (formData.tags.length === 0)
      newErrors.tags = "Must attach at least one tag";
    if (images.length === 0) {
      newErrors.images = "Please upload at least one image";
    } else {
      // Check image sizes
      const oversizedImages = images.filter(
        (img) => img.size > 2 * 1024 * 1024
      );
      if (oversizedImages.length > 0) {
        newErrors.images = "Some images exceed 2MB limit";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show promote modal after validation passes
    setShowPromoteModal(true);
  };

  // Function to initialize payment - using ApiFetcher (Axios)
  const initializePayment = async (
    productId: string,
    amount: number,
    planTitle: string
  ) => {
    try {
      const response = await ApiFetcher.post(
        `/payment/paystack/initialize?type=boost&item_id=${productId}`
      );

      if (!response) {
        throw new Error("Failed to initialize payment");
      }

      // Axios response has data property directly
      const paymentData: PaymentResponse = response.data;

      // Redirect to Paystack payment page
      if (paymentData.authorization_url) {
        window.location.href = paymentData.authorization_url;
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (error: any) {
      // Handle Axios error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
      console.error("Error initializing payment:", error);
      setIsSubmitting(false);
    }
  };

  // Main function to handle ad posting
  const handlePostAd = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);
      const isFreemium =
        selectedPlanData && Array.isArray(selectedPlanData.pricing);

      // Prepare FormData
      const apiFormData = new FormData();

      // Add required fields
      apiFormData.append("category_id", formData.category);
      apiFormData.append("title", formData.title);
      apiFormData.append("description", formData.description);
      apiFormData.append("state", formData.state);
      apiFormData.append("local", formData.city);
      apiFormData.append("price", formData.price);
      apiFormData.append("nearest", formData.busStop);
      apiFormData.append("use_escrow", "1");

      // Add plan information
      if (selectedPlanData) {
        apiFormData.append("plan[title]", selectedPlanData.title);

        if (!isFreemium && selectedDuration) {
          // Use type guard to safely access pricing
          if (isPricingObject(selectedPlanData.pricing)) {
            const planPrice = selectedPlanData.pricing[selectedDuration];
            apiFormData.append("plan[price]", planPrice.toString());
            apiFormData.append("plan[span]", selectedDuration);
          } else {
            toast.error("Invalid pricing structure for this plan.");
            setIsSubmitting(false);
            return;
          }
        } else {
          apiFormData.append("plan[price]", "0");
          apiFormData.append("plan[span]", "free");
        }
      }

      // Add images
      images.forEach((img, index) => {
        apiFormData.append(`images[${index}]`, img.file);
      });

      // Add tags
      formData.tags.forEach((tag, index) => {
        apiFormData.append(`tags[${index}]`, tag);
      });

      // Step 1: Create the product using ApiFetcher (Axios)
      const createProductResponse = await ApiFetcher.post(
        "/products",
        apiFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Axios response has data property directly
      const productData: ProductResponse = createProductResponse.data;

      if (!productData.status || !productData.data) {
        throw new Error("Failed to create product");
      }

      const productId = productData.data.id.toString();

      if (!productId) {
        throw new Error("Product ID not received");
      }

      setCreatedProductId(productId);

      // Step 2: Handle based on plan type
      if (isFreemium) {
        // For freemium plan, show success modal directly
        setShowPromoteModal(false);
        setShowPaymentSuccessModal(true);
        toast.success("Ad posted successfully with freemium plan!");
      } else {
        // For paid plans, initialize payment
        if (
          selectedPlanData &&
          selectedDuration &&
          isPricingObject(selectedPlanData.pricing)
        ) {
          const planPrice = selectedPlanData.pricing[selectedDuration];

          // Close the promote modal
          setShowPromoteModal(false);

          // Initialize payment
          await initializePayment(productId, planPrice, selectedPlanData.title);
        } else {
          toast.error("Unable to process payment for this plan.");
        }
      }
    } catch (error: any) {
      // Handle Axios error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to post ad. Please try again.");
      }
      console.error("Error posting ad:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment success modal close
  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccessModal(false);

    // Reset form after successful submission
    setFormData({
      title: "",
      category: "",
      price: "",
      description: "",
      state:
        states.find((s) => s.name.toLowerCase().includes("lagos"))?.name || "",
      city: "",
      busStop: "",
      tags: [],
    });
    setImages([]);
    setSelectedPlan(null);
    setSelectedDuration(null);

    // Redirect to profile page
    router.push("/profile");
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setErrors({ ...errors, tags: "" });
      setTagInput("");
    } else if (formData.tags.includes(tagInput.trim())) {
      toast.warning("Tag already exists!");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    let hasError = false;

    // Check total images count
    if (images.length + files.length > 5) {
      setImageError("Cannot upload more than 5 images");
      toast.error("Maximum 5 images allowed");
      return;
    }

    Array.from(files).forEach((file, index) => {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        setImageError(`Image ${file.name} exceeds 2MB limit`);
        toast.error(`Image ${file.name} exceeds 2MB limit`);
        hasError = true;
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setImageError(`File ${file.name} is not an image`);
        toast.error(`File ${file.name} is not a valid image`);
        hasError = true;
        return;
      }

      const imageId = `image_${Date.now()}_${index}`;
      const previewUrl = URL.createObjectURL(file);

      newImages.push({
        id: imageId,
        file,
        preview: previewUrl,
        name: file.name,
        size: file.size,
      });
    });

    if (!hasError && newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages]);
      setImageError("");
      setErrors({ ...errors, images: "" });
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
    toast.info("Image removed");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Helper function to get price for a duration - FIXED
  const getPriceForDuration = (plan: Plan, duration: string): number => {
    if (Array.isArray(plan.pricing)) return 0;

    // Use type guard for safe access
    if (isPricingObject(plan.pricing)) {
      const price = plan.pricing[duration];
      return price || 0;
    }
    return 0;
  };

  // Format price with Naira symbol
  const formatPrice = (price: number) => {
    return `₦ ${price.toLocaleString("en-US")}.00`;
  };

  // Get selected plan data
  const selectedPlanData = selectedPlan
    ? plans.find((plan) => plan.id === selectedPlan)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Product</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-12 h-0.5 bg-[#39B54A]"></div>
              <svg
                className="w-5 h-5 text-[#39B54A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="w-12 h-0.5 bg-[#39B54A]"></div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isFormValid()
                ? "bg-[#39B54A] hover:bg-[#39B54A] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  PRODUCT DETAILS
                </h2>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setErrors({ ...errors, title: "" });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A]"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  CATEGORY
                </h2>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setErrors({ ...errors, category: "" });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A] appearance-none bg-white"
                  >
                    <option value="">Select a category</option>
                    {loading ? (
                      <option>Loading categories...</option>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option>No categories available</option>
                    )}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  PRICE DETAILS
                </h2>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow positive numbers or empty string
                      if (value === "" || parseFloat(value) >= 0) {
                        setFormData({ ...formData, price: value });
                        setErrors({ ...errors, price: "" });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  DESCRIPTION
                </h2>
                <div>
                  <label className="text-xs text-gray-900 mb-2 block">
                    Product Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setErrors({ ...errors, description: "" });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A] resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Media */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">MEDIA</h2>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((img, index) => (
                        <div key={img.id} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={img.preview}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              title="Remove image"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            Image {index + 1} - {(img.size / 1024).toFixed(2)}KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    images.length >= 5
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 hover:border-[#39B54A] bg-gray-50"
                  }`}
                  onClick={() => {
                    if (images.length < 5 && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={images.length >= 5}
                  />
                  <div className="space-y-2">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {images.length >= 5
                        ? "Maximum 5 images reached"
                        : "Select files to upload"}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">OR</p>
                    <p className="text-sm text-gray-600">
                      {images.length >= 5
                        ? "Cannot add more images"
                        : "drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                      {images.length}/5 images uploaded
                    </p>
                  </div>
                </div>

                {/* Image error and note */}
                <div className="mt-3 space-y-2">
                  {imageError && (
                    <p className="text-xs text-red-500">{imageError}</p>
                  )}
                  {errors.images && (
                    <p className="text-xs text-red-500">{errors.images}</p>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    NOTE: IMAGE SIZE SHOULD NOT BE MORE THAN 2MB
                  </p>
                </div>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A] text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-[#39B54A] hover:bg-[#39B54A] text-white px-4 py-2 rounded-md transition-colors"
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
                        className="text-[#39B54A] hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Nearest Location */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  NEAREST LOCATION
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">
                      Country
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                      {country}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={handleStateChange}
                      disabled={loadingStates || states.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A] appearance-none bg-white disabled:bg-gray-100"
                    >
                      <option value="">Select a state</option>
                      {loadingStates ? (
                        <option>Loading states...</option>
                      ) : states.length > 0 ? (
                        states.map((state) => (
                          <option key={state.state_code} value={state.name}>
                            {state.name}
                          </option>
                        ))
                      ) : (
                        <option>No states available</option>
                      )}
                    </select>
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">
                      City
                    </label>
                    <select
                      value={formData.city}
                      onChange={handleCityChange}
                      disabled={
                        !formData.state || loadingCities || cities.length === 0
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A] appearance-none bg-white disabled:bg-gray-100"
                    >
                      <option value="">Select a city</option>
                      {loadingCities ? (
                        <option>Loading cities...</option>
                      ) : formData.state && cities.length > 0 ? (
                        cities.map((city, index) => (
                          <option key={`${city}-${index}`} value={city}>
                            {city}
                          </option>
                        ))
                      ) : formData.state ? (
                        <option>No cities available for this state</option>
                      ) : (
                        <option>Select a state first</option>
                      )}
                    </select>
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">
                      Nearest Bus Stop
                    </label>
                    <input
                      type="text"
                      value={formData.busStop}
                      onChange={(e) =>
                        setFormData({ ...formData, busStop: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#39B54A]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`mt-6 px-8 py-3 rounded-md font-medium transition-colors ${
              isFormValid()
                ? "bg-[#39B54A] hover:bg-[#39B54A] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Promote Modal */}
      {showPromoteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center mt-0 justify-center px-4 z-9999 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-neutral-200"
          onClick={() => setShowPromoteModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col p-2 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Promote your ad
              </h2>

              <div className="flex items-center justify-between ">
                <p className="text-gray-600 text-sm mb-6">
                  Select your Ad plan from list below area.
                </p>

                <X
                  onClick={() => setShowPromoteModal(false)}
                  className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer  "
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {plansLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#39B54A]"></div>
                  <p className="text-gray-500 mt-2">Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No plans available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => {
                    const isFreemium = Array.isArray(plan.pricing);
                    const pricingKeys = isFreemium
                      ? []
                      : Object.keys(plan.pricing);

                    // Get first price for display
                    let displayPrice = 0;
                    if (!isFreemium && pricingKeys.length > 0) {
                      displayPrice = getPriceForDuration(plan, pricingKeys[0]);
                    }

                    return (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan)}
                        className={`relative rounded-xl p-4 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? isFreemium
                              ? "bg-green-100 border-2 border-[#39B54A]"
                              : "bg-white border-2 border-[#39B54A]"
                            : isFreemium
                            ? "bg-gray-50 border-2 border-transparent hover:border-gray-300"
                            : "bg-white border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between ${
                            isFreemium ? "" : "mb-4"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedPlan === plan.id
                                  ? "border-[#39B54A]"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedPlan === plan.id && (
                                <div className="w-3 h-3 rounded-full bg-[#39B54A]"></div>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {plan.title}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              isFreemium
                                ? "bg-[#39B54A] text-white"
                                : "text-[#39B54A]"
                            }`}
                          >
                            {isFreemium ? "Free" : formatPrice(displayPrice)}
                          </span>
                        </div>

                        {/* Duration buttons for non-freemium plans */}
                        {!isFreemium && pricingKeys.length > 0 && (
                          <div className="mt-4 flex gap-2 flex-wrap">
                            {pricingKeys.map((duration) => {
                              const price = getPriceForDuration(plan, duration);
                              const isSelected =
                                selectedPlan === plan.id &&
                                selectedDuration === duration;

                              return (
                                <button
                                  key={duration}
                                  type="button"
                                  onClick={(e) =>
                                    handleDurationSelect(plan.id, duration, e)
                                  }
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isSelected
                                      ? "bg-[#39B54A] text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {duration}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6">
              {/* Post AD Button */}
              <div className="flex justify-center">
                <button
                  onClick={handlePostAd}
                  disabled={!selectedPlan || isSubmitting}
                  className={`px-12 py-3 rounded-full font-semibold text-lg transition-colors shadow-md hover:shadow-lg ${
                    selectedPlan && !isSubmitting
                      ? "bg-[#39B54A] hover:bg-[#39B54A] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Post AD"
                  )}
                </button>
              </div>

              {/* Selected plan summary */}
              {selectedPlanData && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Selected:</span>{" "}
                    {selectedPlanData.title}
                    {selectedDuration && ` • ${selectedDuration}`}
                    {selectedDuration &&
                      !Array.isArray(selectedPlanData.pricing) &&
                      isPricingObject(selectedPlanData.pricing) &&
                      selectedPlanData.pricing[selectedDuration] !==
                        undefined && (
                        <span className="font-bold text-[#39B54A] ml-2">
                          {formatPrice(
                            selectedPlanData.pricing[selectedDuration]
                          )}
                        </span>
                      )}
                    {Array.isArray(selectedPlanData.pricing) && (
                      <span className="font-bold text-[#39B54A] ml-2">
                        Free
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccessModal && (
        <PaymentSuccessModal
          isOpen={showPaymentSuccessModal}
          onClose={handlePaymentSuccessClose}
        />
      )}
    </div>
  );
}
