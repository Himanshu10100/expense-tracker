import { CategoryRepository } from '../repositories/CategoryRepository';

export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async getAllCategories() {
        // Ensure defaults exist
        await this.categoryRepository.seedDefaultsIfEmpty();
        return await this.categoryRepository.findAll();
    }

    async createCategory(data: { name: string; color?: string }) {
        if (!data.name) {
            throw new Error('Category name is required');
        }
        return await this.categoryRepository.create(data);
    }
}
