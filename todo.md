Create products admin system

- [ ] Create CRUD service
- [ ] All products should have:
  - [ ] Name
  - [ ] Price
  - [ ] Description
  - [ ] SKU
  - [ ] Brand
  - [ ] Category
  - [ ] Variants
    - [ ] Image
    - [ ] Inventory count
    - [ ] Size
    - [ ] Raw material linked with inventory
  - [ ] Created at
  - [ ] Updated at

Inventory
The inventory should manage the stock of the products and the raw materials used to create the products.

- [ ] Create CRUD service
- [ ] All inventory items should have:
  - [ ] Name
  - [ ] Quantity
  - [ ] Raw material
  - [ ] Created at
  - [ ] Updated at

> Note: The idea is to create a system that manages the stock of the products and the raw materials used to create the products. The products can have multiple variants, and each variant can have a different inventory count. The raw materials are linked with the inventory items, and the products are linked with the inventory items. When a product is sold, the inventory count of the product variant should be decreased, and the inventory count of the raw materials should be decreased as well.
