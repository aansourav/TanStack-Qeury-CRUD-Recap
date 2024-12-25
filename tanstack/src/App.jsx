import { useState } from "react";
import AddProduct from "./components/AddProduct";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";

function App() {
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);

    const handleProductDelete = () => {
        setSelectedProductId(null);
    };

    const handleProductSelect = (id) => {
        setSelectedProductId(id);
        setEditingProductId(null); // Clear editing mode when selecting a new product
    };

    const handleEditClick = (id) => {
        setEditingProductId(id);
    };

    const handleUpdateComplete = () => {
        setEditingProductId(null);
    };

    return (
        <div className="flex gap-4">
            <AddProduct
                selectedProductId={editingProductId}
                onProductUpdate={handleUpdateComplete}
            />
            <ProductList
                onProductSelect={handleProductSelect}
                // onEditClick={handleEditClick}
            />
            <div className="w-2/5">
                {selectedProductId ? (
                    <ProductDetails
                        id={selectedProductId}
                        onProductDelete={handleProductDelete}
                        onEditClick={() => handleEditClick(selectedProductId)}
                    />
                ) : (
                    <div className="text-gray-500 text-center mt-10">
                        Select a product to view details
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
