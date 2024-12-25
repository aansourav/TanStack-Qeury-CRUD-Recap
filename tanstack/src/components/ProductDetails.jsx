/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const retrieveProduct = async ({ queryKey }) => {
    const response = await axios.get(
        `http://localhost:4000/${queryKey[0]}/${queryKey[1]}`
    );
    return response.data;
};

const deleteProduct = async ({ queryKey }) => {
    const response = await axios.delete(
        `http://localhost:4000/${queryKey[0]}/${queryKey[1]}`
    );
    return response.data;
};

const ProductDetails = ({ id, onProductDelete, onEditClick }) => {
    const queryClient = useQueryClient();
    const { mutate: deleteProductMutation } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            // Invalidate both the products list and the single product query
            queryClient.invalidateQueries(["products"]);
            queryClient.removeQueries(["products", id]);
            onProductDelete();
        },
        onError: (error) => {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        },
    });
    const {
        data: product,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["products", id],
        queryFn: retrieveProduct,
    });
    console.log(isLoading, product);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="border border-gray-300 px-8 py-4 rounded-lg max-w-xs mx-auto mt-10">
            <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full rounded-lg"
            />
            <h2 className="my-4">{product.title}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="font-bold text-lg">${product.price}</p>
            <p className="text-gray-500">Rating: {product.rating}</p>
            <button
                onClick={() => onEditClick()}
                className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Product
            </button>
            <button
                onClick={() => {
                    if (
                        window.confirm(
                            "Are you sure you want to delete this product?"
                        )
                    ) {
                        deleteProductMutation({ queryKey: ["products", id] });
                    }
                }}
                className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                Delete Product
            </button>
        </div>
    );
};

export default ProductDetails;
