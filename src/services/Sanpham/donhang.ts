const ORDERS_KEY = 'orders_data';
const PRODUCTS_KEY = 'products_data';

const initialOrders = [
    {
        id: 'DH001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        products: [
            { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
        ],
        totalAmount: 25000000,
        status: 'pending',
        createdAt: '2024-01-15'
    }
];

const getOrders = () => {
    const data = localStorage.getItem(ORDERS_KEY);
    if (!data) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
        return initialOrders;
    }
    return JSON.parse(data);
};

const saveOrders = (data: any[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(data));
};

const getProducts = () => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
};

const saveProducts = (data: any[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
};

export async function queryDonHangList(params: {
    current?: number;
    pageSize?: number;
    keyword?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortField?: string;
    sortOrder?: string;
}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let data = getOrders();

            if (params.keyword) {
                const lowerKeyword = params.keyword.toLowerCase();
                data = data.filter((item: any) =>
                    item.id.toLowerCase().includes(lowerKeyword) ||
                    item.customerName.toLowerCase().includes(lowerKeyword)
                );
            }

            if (params.status) {
                data = data.filter((item: any) => item.status === params.status);
            }

            if (params.startDate && params.endDate) {
                data = data.filter((item: any) =>
                    item.createdAt >= params.startDate! && item.createdAt <= params.endDate!
                );
            }

            if (params.sortField && params.sortOrder) {
                data.sort((a: any, b: any) => {
                    let result = 0;
                    if (params.sortField === 'createdAt') {
                        result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    } else if (params.sortField === 'totalAmount') {
                        result = a.totalAmount - b.totalAmount;
                    }
                    return params.sortOrder === 'ascend' ? result : -result;
                });
            }

            const total = data.length;
            const current = params.current || 1;
            const pageSize = params.pageSize || 10;
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

export async function addDonHang(data: any) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const products = getProducts();

            for (const item of data.products) {
                const product = products.find((p: any) => p.id === item.productId);
                if (!product || product.quantity < item.quantity) {
                    resolve({ data: { success: false, message: `Sản phẩm ${item.productName} không đủ số lượng` } });
                    return;
                }
            }

            const orders = getOrders();
            const newOrder = {
                ...data,
                id: `DH${Date.now()}`,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'pending'
            };
            orders.unshift(newOrder);
            saveOrders(orders);
            resolve({ data: { success: true } });
        }, 500);
    });
}

export async function updateDonHangStatus(id: string, status: string) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getOrders();
            const orderIndex = orders.findIndex((o: any) => o.id === id);

            if (orderIndex === -1) {
                resolve({ data: { success: false } });
                return;
            }

            const currentOrder = orders[orderIndex];
            const oldStatus = currentOrder.status;

            if (oldStatus === status) {
                resolve({ data: { success: true } });
                return;
            }

            const products = getProducts();

            if (status === 'completed' && oldStatus !== 'completed') {
                for (const item of currentOrder.products) {
                    const pIndex = products.findIndex((p: any) => p.id === item.productId);
                    if (pIndex > -1) {
                        products[pIndex].quantity -= item.quantity;
                    }
                }
            } else if (status === 'cancelled' && oldStatus === 'completed') {
                for (const item of currentOrder.products) {
                    const pIndex = products.findIndex((p: any) => p.id === item.productId);
                    if (pIndex > -1) {
                        products[pIndex].quantity += item.quantity;
                    }
                }
            }

            saveProducts(products);

            currentOrder.status = status;
            saveOrders(orders);

            resolve({ data: { success: true } });
        }, 500);
    });
}

export async function getAllOrders() {
    return new Promise((resolve) => {
        const orders = getOrders();
        resolve(orders);
    });
}
