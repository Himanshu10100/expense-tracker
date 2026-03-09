import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, color } = req.body;
            const category = await this.categoryService.createCategory({ name, color });
            res.status(201).json(category);
        } catch (error: any) {
            // Very basic error structure adjustment for bad inputs
            if (error.message === 'Category name is required') {
                res.status(400).json({ error: error.message });
                return;
            }
            next(error);
        }
    };
}
