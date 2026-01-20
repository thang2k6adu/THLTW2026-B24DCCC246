import { Request, Response } from 'express';

let tableListDataSource: any[] = [
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default {
    'GET /api/sanpham/list': (req: Request, res: Response) => {
        const { current = 1, pageSize = 10, name } = req.query;
        let dataSource = [...tableListDataSource];

        if (name) {
            dataSource = dataSource.filter(data => data.name.toLowerCase().includes((name as string).toLowerCase()));
        }

        const startIndex = (Number(current) - 1) * Number(pageSize);
        const endIndex = startIndex + Number(pageSize);
        const data = dataSource.slice(startIndex, endIndex);

        res.send({
            data,
            total: dataSource.length,
            success: true,
            pageSize,
            current,
        });
    },
    'POST /api/sanpham/add': (req: Request, res: Response) => {
        const newProduct = req.body;
        newProduct.id = tableListDataSource.length + 1;
        tableListDataSource.unshift(newProduct);
        res.send({
            success: true,
            message: 'Thêm sản phẩm thành công',
        });
    },
    'DELETE /api/sanpham/delete': (req: Request, res: Response) => {
        const { id } = req.body;
        tableListDataSource = tableListDataSource.filter(item => item.id !== id);
        res.send({
            success: true,
            message: 'Xóa sản phẩm thành công',
        });
    }
};
