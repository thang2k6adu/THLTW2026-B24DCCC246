const PRODUCTS_KEY = 'products_data';

const initialProducts = [
    { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
    { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
    { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
    { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
    { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
    { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const getProducts = () => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.parse(data);
};

const saveProducts = (data: any[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
};

export async function querySanphamList(params: {
    current?: number;
    pageSize?: number;
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    sortField?: string;
    sortOrder?: string;
}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let data = getProducts();

            if (params.name) {
                data = data.filter((item: any) =>
                    item.name.toLowerCase().includes(params.name?.toLowerCase())
                );
            }

            if (params.category) {
                data = data.filter((item: any) => item.category === params.category);
            }

            if (params.minPrice !== undefined) {
                data = data.filter((item: any) => item.price >= params.minPrice!);
            }

            if (params.maxPrice !== undefined) {
                data = data.filter((item: any) => item.price <= params.maxPrice!);
            }

            if (params.status) {
                data = data.filter((item: any) => {
                    if (params.status === 'con_hang') return item.quantity > 10;
                    if (params.status === 'sap_het') return item.quantity > 0 && item.quantity <= 10;
                    if (params.status === 'het_hang') return item.quantity === 0;
                    return true;
                });
            }

            if (params.sortField && params.sortOrder) {
                data.sort((a: any, b: any) => {
                    let result = 0;
                    if (params.sortField === 'name') {
                        result = a.name.localeCompare(b.name);
                    } else if (params.sortField === 'price') {
                        result = a.price - b.price;
                    } else if (params.sortField === 'quantity') {
                        result = a.quantity - b.quantity;
                    }
                    return params.sortOrder === 'ascend' ? result : -result;
                });
            }

            const total = data.length;
            const current = params.current || 1;
            const pageSize = params.pageSize || 5;
            const startIndex = (current - 1) * pageSize;
            const paginatedData = data.slice(startIndex, startIndex + pageSize);

            resolve({
                data: {
                    data: paginatedData,
                    total,
                    success: true,
                },
            });
        }, 500);
    });
}

export async function addSanpham(data: any) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getProducts();
            const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
            const newProduct = { ...data, id: newId };
            products.unshift(newProduct);
            saveProducts(products);
            resolve({
                data: {
                    success: true,
                },
            });
        }, 500);
    });
}

export async function updateSanpham(data: any) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getProducts();
            const index = products.findIndex((p: any) => p.id === data.id);
            if (index > -1) {
                products[index] = { ...products[index], ...data };
                saveProducts(products);
                resolve({
                    data: {
                        success: true,
                    },
                });
            } else {
                resolve({
                    data: {
                        success: false,
                    },
                });
            }
        }, 500);
    });
}

export async function deleteSanpham(id: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = getProducts();
            const newProducts = products.filter((p: any) => p.id !== id);
            saveProducts(newProducts);
            resolve({
                data: {
                    success: true,
                },
            });
        }, 500);
    });
}

export async function getAllProducts() {
    return new Promise((resolve) => {
        const products = getProducts();
        resolve(products);
    });
}
