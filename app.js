document.addEventListener('DOMContentLoaded', () => {
    const itemForm = document.getElementById('item-form');
    const itemIdInput = document.getElementById('item-id');
    const nameInput = document.getElementById('name');
    const descInput = document.getElementById('description');
    const itemsTbody = document.getElementById('items-tbody');
    const formTitle = document.getElementById('form-title');
    const cancelBtn = document.getElementById('cancel-btn');

    const API_URL = '/api/items';

    // 1. READ: Fetch and display items
    async function fetchItems() {
        try {
            const response = await fetch(API_URL);
            const items = await response.json();
            renderItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    // Render items into the table
    function renderItems(items) {
        itemsTbody.innerHTML = '';
        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.description || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="editItem(${item.id}, '${item.name.replace(/'/g, "\\'")}', '${(item.description || '').replace(/'/g, "\\'")}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                </td>
            `;
            itemsTbody.appendChild(tr);
        });
    }

    // 2. CREATE or UPDATE item on form submit
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = itemIdInput.value;
        const name = nameInput.value;
        const description = descInput.value;

        const payload = { name, description };

        try {
            if (id) {
                // Update existing item
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new item
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            // Reset form and fetch updated list
            resetForm();
            fetchItems();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    });

    // Populate the form to Edit an Item
    window.editItem = function(id, name, description) {
        itemIdInput.value = id;
        nameInput.value = name;
        descInput.value = description;
        
        formTitle.textContent = 'Edit Item';
        cancelBtn.style.display = 'inline-block';
    }

    // 3. DELETE an item
    window.deleteItem = async function(id) {
        if (!confirm('Are you sure you want to delete this item?')) return;
        
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    // Reset Form to Create mode
    cancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        itemIdInput.value = '';
        nameInput.value = '';
        descInput.value = '';
        formTitle.textContent = 'Add New Item';
        cancelBtn.style.display = 'none';
    }

    // Initial load
    fetchItems();
});