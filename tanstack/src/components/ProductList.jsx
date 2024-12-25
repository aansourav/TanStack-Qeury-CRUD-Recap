/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const retrieveProducts = async ({ queryKey }) => {
    const response = await axios.get(
        `http://localhost:4000/${queryKey[0]}?_page=${queryKey[1]}&_per_page=9`
    );
    return response.data;
};

const ProductList = ({ onProductSelect }) => {
    const [page, setPage] = useState(1);
    const {
        data: products,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["products", page],
        queryFn: retrieveProducts,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchIntervalInBackground: true,
        retry: 3,
        retryDelay: 1000,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flex flex-col gap-2 p-2 w-3/5">
            <h1 className="text-xl font-bold">Product List</h1>
            <ul className="grid grid-cols-3 gap-2 w-full">
                {products?.data &&
                    products.data.map((product) => (
                        <li
                            key={product.id}
                            className="flex flex-col gap-1 items-center p-2 border border-gray-300 rounded-md hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onProductSelect(product.id)}
                        >
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <h2 className="text-sm font-semibold line-clamp-1">
                                {product.title}
                            </h2>
                            <p className="text-xs text-gray-500 line-clamp-1">
                                {product.description}
                            </p>
                            <p className="text-sm font-bold">
                                ${product.price}
                            </p>
                        </li>
                    ))}
            </ul>
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={!products?.prev}
                    className={`px-4 py-2 bg-blue-500 text-gray-100 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-500`}
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!products?.next}
                    className="disabled:bg-gray-200 disabled:text-gray-500 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
