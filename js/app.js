const cardSection = document.getElementById('main');
const modal = document.getElementById('modal');
let employees = [];
let cardsList = [];

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// API  ------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// Check status/Promise

const checkStatus = response => {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
};

// Get Data

const fetchData = (url) => {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json());
};

// Create card html with provided data from fetchData + make a list of cards

const profiles = (data) => {
    const profiles = data.results;
    employees = profiles;
    employees.forEach((person, index) => {
        let html = `
        <div class="card" data-index="${index}">
        
        <img src="${person.picture.large}" alt="${person.name.first} ${person.name.last}">
       
        <div class="description">
        <h2 class="name">${person.name.first} ${person.name.last}</h2>
        <p>${person.email}</p>
        <p>${person.location.city}</p>
        </div>
        </div>
        `;
        cardSection.innerHTML += html;


        cardsList = document.querySelectorAll('.card');
    });
};

fetchData('https://randomuser.me/api/1.3/?results=12&nat=us')
    .then(data => profiles(data));


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// MODAL SECTION  --------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------



const createModal = (i) => {

    // Destructuring ----------------------------------------------------------

    let {
        dob,
        picture,
        email,
        phone,
        name,
        location: {
            city,
            street,
            state,
            postcode
        },
    } = employees[i];

    // Get date and format ----------------------------------------------------------

    let date = new Date(dob.date);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getYear();
    if (day < 10) {
        day = `0${day}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }

    // Create textContent to display ----------------------------------------------------------

    document.getElementById('avatar').src = `${picture.large}`;
    document.getElementById('avatar').alt = `${name.first} ${name.last}`;
    document.getElementById('name').textContent = `${name.first} ${name.last}`;
    document.getElementById('email').textContent = email;
    document.getElementById('city').textContent = city;
    document.getElementById('phone').textContent = phone;
    document.getElementById('location').textContent = `${street.number} ${street.name}, ${state} ${postcode}`;
    document.getElementById('birthday').textContent = `Birthday: ${day}/${month}/${year}`;

};

// Function to display modal ----------------------------------------------------------

const displayModal = (index) => {
    let i = index;
    createModal(i);

    modal.classList.add('modal-On');

    // Modal Closing function 

    const closeModal = () => {
        modal.classList.remove('modal-On');
    };

    document.querySelector('.closeBtn').addEventListener('click', closeModal);
    document.querySelector('#modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-On')) {
            closeModal();
        }
    });
    document.addEventListener('keyup', (e) => {
        if (e.key == "Escape") {
            closeModal();
        }

        // Switch between array index

        if (e.key == "ArrowRight") {
            i++;
            if (i == 12) {
                i = 0;
            }

            createModal(i);
        } else if (e.key == "ArrowLeft") {
            if (i == 0) {
                i = 12;
            }
            i--;
            createModal(i);
        }
    });

    document.querySelector('.leftBtn').addEventListener('click', () => {
        if (i == 0) {
            i = 12;
        }
        i--;
        createModal(i);
    });
    document.querySelector('.rightBtn').addEventListener('click', () => {
        i++;
        if (i == 12) {
            i = 0;
        }

        createModal(i);
    });
};


// Listener to display correct Modal ----------------------------------------------------------

cardSection.addEventListener('click', (e) => {
        if (e.target.tagName !== "MAIN") {
            const card = e.target.closest(".card");
            const index = card.getAttribute("data-index");
            displayModal(index);
        }

    }

);


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Search ----------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


const searchBar = document.getElementById('search');

const search = (e) => {
    const searchValue = e.target.value.toLowerCase();
    let cards = [...cardsList]
        .filter(card => card.children[1].firstElementChild
            .textContent.toLowerCase()
            .includes(searchValue));
    cardSection.innerHTML = '';
    cards.forEach(card => {
        cardSection.innerHTML += card.outerHTML;
    });
};
searchBar.addEventListener('input', search);