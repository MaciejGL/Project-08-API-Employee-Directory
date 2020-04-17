const cardSection = document.getElementById('main');
const modal = document.getElementById('modal');
let employees = []

const checkStatus = response => {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

const fetchData = (url) => {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
}

const profiles = (data) => {
    const profiles = data.results
    employees = profiles;
    employees.forEach((person, index) => {
        html = `
        <div class="card" data-index="${index}">
        
        <img src="${person.picture.large}" alt="${person.name.first} ${person.name.last}">
       
        <div class="description">
        <h2 class="name">${person.name.first} ${person.name.last}</h2>
        <p>${person.email}</p>
        <p>${person.location.city}</p>
        </div>
        </div>
        `
        cardSection.innerHTML += html;
    })
}

fetchData('https://randomuser.me/api/1.3/?results=12')
    .then(data => profiles(data))


// MODAL SECTION  ----------------------------------------------------------


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
    } = employees[i]

    // Get date and format ----------------------------------------------------------

    let date = new Date(dob.date)
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getYear();
    if (day < 10) {
        day = `0${day}`
    }
    if (month < 10) {
        month = `0${month}`
    }

    // Create html to display ----------------------------------------------------------

    let htmlModal = `
    
    <div class="closeBtn"><img src="images/iconfinder_icon-close_211652.svg" alt="close button"></div>
    <div class="modalTop">
    <img src="${picture.large}" alt="${name.first} ${name.last}">
    <h2>${name.first} ${name.last}</h2>
    <p>${email}</p>
    <p>${city}</p>
    </div>
    <div class="modalBottom">
    <p>${phone}</p>
    <p>${street.number} ${street.name}, ${state} ${postcode}</p>
    <p>Birthday: ${day}/${month}/${year}</p>
    </div>`

    return htmlModal
}

// Function to display modal ----------------------------------------------------------

const displayModal = (index) => {
    let i = index
    console.log(i)
    document.getElementById('modalCard').innerHTML = createModal(i)

    modal.classList.add('modal-On')

    // Modal Closing function 

    const closeModal = () => {
        modal.classList.remove('modal-On')
    }

    document.querySelector('.closeBtn').addEventListener('click', closeModal)
    document.querySelector('#modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-On')) {
            closeModal()
        }
    })
    document.addEventListener('keyup', (e) => {
        console.log(e.key)
        if (e.key == "Escape") {
            closeModal();
        }
        if (e.key == "ArrowRight") {

            i++;

            if (i == 12) {
                i = 0
            }

            document.getElementById('modalCard').innerHTML = createModal(i)
        } else if (e.key == "ArrowLeft") {
            if (i == 0) {
                i = 12
            }

            i--;



            document.getElementById('modalCard').innerHTML = createModal(i)
        }
    })
}


// Listener to display correct Modal ----------------------------------------------------------

cardSection.addEventListener('click', (e) => {
        if (e.target.tagName !== "MAIN") {
            const card = e.target.closest(".card")
            const index = card.getAttribute("data-index")
            displayModal(index)
        }

    }

)