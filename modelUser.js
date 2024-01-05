import { Sequelize, DataTypes } from 'sequelize';
import { connection } from './connectDB.js';

const UserModel = connection.define('users', {
  // Model attributes are defined here
  firm_name: {
    type: DataTypes.STRING(25),
    allowNull: false,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING(25)
  },
  last_name: {
    type: DataTypes.STRING(25)
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(25)
  },
  last_received_mail: {
    type: DataTypes.DATE
  },
  last_picked_up: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  has_mail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true // Si on souhaite un timestamps created_at et updated_at
});




export const User = UserModel;