document.addEventListener("DOMContentLoaded", () => {
    let contacts = [];
    let editIndex = -1;
    const tableBtn = document.getElementById("tableViewBtn");
    const cardBtn = document.getElementById("cardViewBtn");
    const addContactBtn = document.getElementById("addBtn");
    const searchInput = document.getElementById("search");
    const tableContainer = document.getElementById("tableContainer");
    const table = document.getElementById("contactTable");
    const cardContainer = document.getElementById("cardContainer");
    const modal = new bootstrap.Modal(document.getElementById("contactModal"));
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const saveBtn = document.getElementById("saveBtn");

    // VIEW TOGGLE
    tableBtn.addEventListener("click", () => {
        tableContainer.classList.remove("d-none");
        cardContainer.classList.add("d-none");
        document.getElementsByTagName('footer').style.backgroundColor = '#cfe2ff'
    });

    cardBtn.addEventListener("click", () => {
        tableContainer.classList.add("d-none");
        cardContainer.classList.remove("d-none");
        document.getElementsByTagName('footer').style.backgroundColor = '#eff9d0'
    });

    function noDataRow(){
        const noDataRow = document.createElement("tr");
        noDataRow.innerHTML = `
                <td colspan='4' class='text-center'>No contacts added yet.</td>
            `;
        table.appendChild(noDataRow);    
        searchInput.classList.add("d-none"); 
        cardViewBtn.classList.add("disabled"); 

    }

    // LOAD API
    function loadContacts() {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => {
                if (!res.ok) {
                    throw new Error("API failed");                            
                }
                return res.json();
            })
            .then(data => {
                contacts = data;
                displayContacts(contacts);
            })
            .catch(error => {
                console.error(error);
                noDataRow()
                alert(`${error}; Failed to load contacts`);
            });
    }

    // DISPLAY
    function displayContacts(data) {
        table.innerHTML = "";
        cardContainer.innerHTML = "";

        data.forEach((c, index) => {

            /* TABLE */
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${c.name}</td>
                <td class="d-none d-md-table-cell">${c.email}</td>
                <td>${c.phone}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn">
                    <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn">
                    <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            row.querySelector(".edit-btn").addEventListener("click", () => openEdit(index));
            row.querySelector(".delete-btn").addEventListener("click", () => deleteContact(index));
            table.appendChild(row);

            /* CARD */
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 mb-4";
            col.innerHTML = `
                <div class="card shadow-sm p-3 mb-3 h-100 bg-pastelgreen">

                    <h5>${c.name}</h5>
                    <p><i class="fa fa-envelope"></i> ${c.email}</p>
                    <p><i class="fa fa-phone"></i> ${c.phone}</p>

                    <div class="mt-auto d-flex justify-content-end gap-2">
                        <button class="btn btn-warning btn-sm edit-btn">
                        <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn">
                        <i class="fa fa-trash"></i>
                        </button>
                    </div>

                </div>
            `;
            col.querySelector(".edit-btn").addEventListener("click", () => openEdit(index));
            col.querySelector(".delete-btn").addEventListener("click", () => deleteContact(index));
            cardContainer.appendChild(col);
        });
    }

    // Reset states
    function clearValidation() {
        [nameInput, emailInput, phoneInput].forEach(input => {
            input.classList.remove("is-invalid");
        });
    }

    //Validate user input data
    function validateInputData() {

        let isValid = true;

        clearValidation();

        console.log(nameInput.value.trim(), emailInput.value.trim(), phoneInput.value.trim())

        // Name
        if (nameInput.value.trim() === "") {
            nameInput.classList.add("is-invalid");
            isValid = false;
        }

        // Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.add("is-invalid");
            isValid = false;
        }

        // Phone
        if (isNaN(phoneInput.value.trim())) {
            phoneInput.classList.add("is-invalid");
            isValid = false;
        }

        // Phone
        if (phoneInput.value.trim().length < 10 || phoneInput.value.trim().length > 10) {
            phoneInput.classList.add("is-invalid");
            isValid = false;
        }

        return isValid;
    }            

    // ADD
    addBtn.addEventListener("click", () => {
        editIndex = -1;
        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        clearValidation();
        modal.show();
    });

    // EDIT
    function openEdit(index) {
        editIndex = index;
        const c = contacts[index];
        nameInput.value = c.name;
        emailInput.value = c.email;
        phoneInput.value = c.phone;
        clearValidation();
        modal.show();
    }

    // SAVE (ADD + EDIT)
    saveBtn.addEventListener("click", () => {

        if (!validateInputData()) return;

        const newContact = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        if (editIndex === -1) {
            contacts.unshift(newContact);
        } else {
            contacts[editIndex] = newContact;
        }

        displayContacts(contacts);
        modal.hide();
    });

    // DELETE
    function deleteContact(index) {
        contacts.splice(index, 1);
        displayContacts(contacts);
    }

    // SEARCH
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();

        const filtered = contacts.filter(c =>
            c.name.toLowerCase().includes(value) ||
            c.phone.toLowerCase().includes(value)
        );
        displayContacts(filtered);
    });

    // INIT
    loadContacts();            
});