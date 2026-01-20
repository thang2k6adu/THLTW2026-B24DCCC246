# Coding Guide

This document outlines the coding standards, project structure, and best practices for the **THLTW2026-B24DCCC246** project.

## 1. Directory Structure

The project is built with UmiJS (React). The structure of `src` is organized as follows:

-   **`src/components`**: Reusable UI components.
    -   Each component should have its own directory (PascalCase) containing an `index.tsx` (and optionally `index.less` or styles).
    -   Example: `src/components/Footer/index.tsx`
-   **`src/services`**: API definitions.
    -   Organized by feature domain.
    -   Directories are typically PascalCase (e.g., `src/services/TodoList`).
    -   Files can be camelCase (e.g., `src/services/uploadFile.ts`, `src/services/base/api.ts`).
-   **`src/models`**: Global state management using UmiJS models.
    -   Files are camelCase (e.g., `src/models/todolist.ts`).
    -   Should return a custom hook structure (state and setters).
-   **`src/pages`**: Application pages/routes.
-   **`src/utils`**: Shared utilities (axios instance, formatters, etc.).
-   **`mock`**: (Root level) Mock API definitions for development.

## 2. Naming Conventions

-   **Directories**:
    -   Components: **PascalCase** (e.g., `Footer`, `RightContent`).
    -   Services: **PascalCase** is preferred for folders (e.g., `TodoList`, `DanhMuc`), though `base` exists as an exception.
    -   Others (`models`, `utils`, `pages`): **camelCase**.
-   **Files**:
    -   React Components: `index.tsx` inside the component folder, or **PascalCase.tsx** if standalone.
    -   Services/Models/Utils: **camelCase** (e.g., `randomuser.ts`, `uploadFile.ts`).
-   **Code**:
    -   Variables/Functions: **camelCase**.
    -   React Components: **PascalCase**.
    -   Interfaces/Types: **PascalCase** (often prefixed with `I` or `E` for Enums, though not strictly enforced in all existing code, consistency with surrounding code is key).

## 3. Coding Patterns

### Components
Functional components using React Hooks (`useState`, `useEffect`, etc.) and Umi hooks (`useIntl`, `useModel`).

```tsx
import React from 'react';
import { useIntl } from 'umi';

const MyComponent = () => {
  const intl = useIntl();
  return <div>{intl.formatMessage({ id: 'app.hello' })}</div>;
};

export default MyComponent;
```

### Services
Services should export async functions that use the project's request utility (e.g., axios wrapper).

```typescript
import request from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getData(params: any) {
  return request.get(`${ip3}/api/data`, { params });
}
```

### Models
Models follow the Pattern of "Custom Hooks".

```typescript
import { useState } from 'react';

export default () => {
  const [data, setData] = useState<any[]>([]);
  // ... functions to manipulate data
  return { data, setData };
};
```

## 4. Mock Data Strategy

We use the `mock/` directory at the project root to simulate backend APIs when the real backend is unavailable or incomplete.

### How to Create Mock Data (When Data is Missing)

If you are developing a feature and the backend API is not ready (missing data), follow these steps:

1.  **Locate/Create Mock File**:
    -   Check `mock/` for a relevant file (e.g., `mock/user.ts`).
    -   If it's a new feature, create a new file (e.g., `mock/myFeature.ts`).

2.  **Define the Endpoint**:
    -   Use the `export default` object syntax.
    -   The key is the method and path: `'METHOD /api/path'`.
    -   The value is a function handling `(req, res)` or a direct JSON object/array.

3.  **Example Implementation**:

    **Scenario**: You need an API `GET /api/todo/list` but it doesn't exist yet.

    Create `mock/todo.ts`:

    ```typescript
    import { Request, Response } from 'express';

    export default {
      // Option 1: Direct JSON return (Simple)
      'GET /api/todo/list': [
        { id: 1, title: 'Buy milk', completed: false },
        { id: 2, title: 'Walk the dog', completed: true },
      ],

      // Option 2: Function with logic (Advanced)
      'GET /api/todo/detail': (req: Request, res: Response) => {
        const { id } = req.query;
        if (id === '1') {
          res.send({ id: 1, title: 'Buy milk', description: '2% Fat' });
        } else {
          res.status(404).send({ message: 'Not Found' });
        }
      },

      // Option 3: POST request
      'POST /api/todo/create': (req: Request, res: Response) => {
        const { title } = req.body;
        // Simulate a success response
        res.send({ status: 'ok', data: { id: Math.random(), title } });
      },
    };
    ```

4.  **Important Notes**:
    -   The mock server usually hot-reloads. If not, restart via `npm start` or `yarn start`.
    -   Refer to existing files like `mock/user.ts` for handling timeouts (`waitTime`) or status codes (401, 403).

## 5. Feature Implementation Workflow (Example: Product Management)

Here is a step-by-step guide to implementing a generic "Product" feature (`Product`), demonstrating the flow from Mock -> Service -> Model -> UI.

### Step 1: Create Mock Data
Create `mock/product.ts` to simulate the backend.

```typescript
// mock/product.ts
import { Request, Response } from 'express';

const genList = (current: number, pageSize: number) => {
  const tableListDataSource: any[] = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      name: `Product ${index}`,
      price: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.5 ? 'Active' : 'Offline',
    });
  }
  return tableListDataSource;
};

export default {
  'GET /api/product/list': (req: Request, res: Response) => {
    const { current = 1, pageSize = 10 } = req.query;
    const data = genList(Number(current), Number(pageSize));
    res.send({
      data,
      total: 100,
      success: true,
      pageSize,
      current,
    });
  },
};
```

### Step 2: Create Service
Create `src/services/product.ts` to define API calls.

```typescript
// src/services/product.ts
import request from '@/utils/axios';

export async function queryProductList(params: { current?: number; pageSize?: number }) {
  return request.get('/api/product/list', { params });
}
```

### Step 3: Create Model
Create `src/models/product.ts` to manage state.

```typescript
// src/models/product.ts
import { useState, useCallback } from 'react';
import { queryProductList } from '@/services/product';

export default () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = useCallback(async (params = { current: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const res = await queryProductList(params);
      setProducts(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    fetchProducts,
  };
};
```

### Step 4: Create UI Page
Create `src/pages/Product/index.tsx` to display data.

```tsx
// src/pages/Product/index.tsx
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Table, Card } from 'antd';

const ProductPage = () => {
  const { products, loading, fetchProducts } = useModel('product');

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Card title="Product List">
      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        rowKey="key"
      />
    </Card>
  );
};

export default ProductPage;
```
