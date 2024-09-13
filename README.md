## Simple Order Management System

This project is a basic order management system developed using the DevArchitecture framework. The system allows company employees to manage customer information and orders. Users must log in to access the system, and their permissions depend on their assigned roles.

## 🚨 Screenshots Available 🚨
You can find a detailed PDF document containing screenshots of all the application pages under the ScreenShoots.pdf file. This document provides a complete visual overview of the system’s functionality and user interface.

To view the screenshots, [click here](./ScreenShoots.pdf)


## Role-based Access

Administrator: Can manage users, roles, customers, products, and has full access to all reporting screens.
User: Has limited access, mainly for viewing and managing products and inventory.
Customer Representative: Can manage customers, place orders, and view warehouse and order reports.

## Pages

Login Page: Mandatory for all users to log in.
User Management Page: For administrators to manage users.
Role Management Page: For administrators to assign and manage roles.
Customer Management Page: For administrators and customer representatives to manage customer details.
Product Management Page: For users, administrators, and customer representatives to manage product details.
Order Management Page: For customer representatives to place orders.
Warehouse Report Page: Displays product stock and availability (accessible by all roles).
Order Report Page: Displays order details and statuses (accessible by all roles).

## Technology Stack

Backend: .NET Core with a multi-layered architecture
Frontend: Angular CLI for UI development
Database: MS SQL for data storage
DevArchitecture Extensions: Pre-built modules for user management, role management, and authorization.

The system uses Entity Framework Core for database interactions and ensures that no data is permanently deleted, following a soft delete approach with an IsDeleted column.
