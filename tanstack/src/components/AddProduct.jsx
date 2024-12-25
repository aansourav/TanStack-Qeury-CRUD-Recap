/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const AddProduct = ({ selectedProductId, onProductUpdate }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        rating: "",
        thumbnail: "",
    });

    const queryClient = useQueryClient();
    const isEditMode = Boolean(selectedProductId);

    // Fetch product data if in edit mode
    const { data: selectedProduct } = useQuery({
        queryKey: ["products", selectedProductId],
        queryFn: async () => {
            if (!selectedProductId) return null;
            const response = await axios.get(
                `http://localhost:4000/products/${selectedProductId}`
            );
            return response.data;
        },
        enabled: !!selectedProductId,
    });

    // Update form when selected product changes
    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                title: selectedProduct.title,
                description: selectedProduct.description,
                price: selectedProduct.price.toString(),
                rating: selectedProduct.rating.toString(),
                thumbnail: selectedProduct.thumbnail,
            });
        }
    }, [selectedProduct]);

    const { mutate: addProduct, isLoading: isAdding } = useMutation({
        mutationFn: (newProduct) =>
            axios.post("http://localhost:4000/products", newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            resetForm();
        },
    });

    const { mutate: updateProduct, isLoading: isUpdating } = useMutation({
        mutationFn: (updatedProduct) =>
            axios.put(
                `http://localhost:4000/products/${selectedProductId}`,
                updatedProduct
            ),
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            resetForm();
            if (onProductUpdate) onProductUpdate();
        },
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            price: "",
            rating: "",
            thumbnail: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            rating: Number(formData.rating),
        };

        if (isEditMode) {
            updateProduct(productData);
        } else {
            productData.id = crypto.randomUUID().toString();
            addProduct(productData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isLoading = isAdding || isUpdating;

    return (
        <div className="w-1/5 p-4">
            <h1 className="text-xl font-bold mb-4">
                {isEditMode ? "Update Product" : "Add Product"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        rows="3"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        min="0"
                        max="5"
                        step="0.1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Thumbnail URL
                    </label>
                    <input
                        type="url"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        required
                    />
                </div>
                {isEditMode && (
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            if (onProductUpdate) onProductUpdate();
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-2"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 mt-2"
                >
                    {isLoading
                        ? isEditMode
                            ? "Updating..."
                            : "Adding..."
                        : isEditMode
                        ? "Update Product"
                        : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
