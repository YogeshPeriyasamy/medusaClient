## Medusa working model

Product
 └─ Variant
     └─ Price (per region)
     └─ Inventory (per location)

Cart
 └─ Belongs to Region
 └─ Uses Sales Channel
 └─ Resolves prices via Region + Channel

Order
 └─ Created from Cart
 └─ Paid via Payment Provider
