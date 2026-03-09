import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CategoryAttributes {
    id: string;
    name: string;
    color?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'color'> { }

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: string;
    public name!: string;
    public color!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '#3b82f6', // Default cool blue
        },
    },
    {
        sequelize,
        tableName: 'categories',
    }
);

export default Category;
