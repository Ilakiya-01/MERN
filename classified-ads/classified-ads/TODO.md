# TODO: Fix Image Upload Issue in Sell Page

## Steps to Complete
- [x] Edit ProductForm.js: Update handleSubmit to only append File objects (new images) to FormData, not existing image URLs.
- [x] Edit products.js: Update PUT route to append new image paths to the existing product.images array.
- [x] Edit products.js: Change image storage from file.path to file.filename in POST and PUT routes to store filenames instead of full paths.
- [x] Verify changes: Ensure the edits are correct and no syntax errors.
