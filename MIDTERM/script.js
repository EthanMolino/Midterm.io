const API_URL = 'https://api.sampleapis.com/rickandmorty/characters';
const container = document.getElementById('character-container');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');

const modalBody = document.getElementById('modalBody');
const charModal = new bootstrap.Modal(document.getElementById('characterModal'));

let characters = [];

async function init() {
    try {
        const res = await fetch(API_URL);
        characters = await res.json();
        render(characters);
    } catch (err) {
        container.innerHTML = `<div class="text-center w-100 py-5">Connection to Citadel failed.</div>`;
    }
}

function render(data) {
    container.innerHTML = '';
    searchCount.innerText = `${data.length} Results`;

    data.forEach(char => {
        const statusClass = char.status === 'Alive' ? 'text-success' : char.status === 'Dead' ? 'text-danger' : 'text-warning';
        
        container.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3 char-card-wrapper" onclick="showPopup(${char.id})">
                <div class="char-card h-100 shadow">
                    <img src="${char.image}" class="card-img-top" alt="${char.name}">
                    <div class="card-body p-4">
                        <span class="badge badge-species mb-2">${char.species}</span>
                        <h5 class="fw-bold mb-1">${char.name}</h5>
                        <p class="small mb-0 ${statusClass}">● ${char.status}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

function showPopup(id) {
    const char = characters.find(c => c.id === id);
    if (!char) return;

    modalBody.innerHTML = `
        <img src="${char.image}" class="modal-profile-img mb-4 shadow" alt="${char.name}">
        <h2 class="fw-bold mb-1">${char.name}</h2>
        <p class="text-success small fw-bold mb-4 uppercase">${char.species} — ${char.status}</p>
        <div class="row g-2 text-start">
            <div class="col-6"><div class="p-3 rounded bg-dark border border-secondary"><small class="text-secondary d-block">Gender</small><b>${char.gender || 'N/A'}</b></div></div>
            <div class="col-6"><div class="p-3 rounded bg-dark border border-secondary"><small class="text-secondary d-block">Origin</small><b>${char.origin || 'Unknown'}</b></div></div>
        </div>
    `;
    charModal.show();
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = characters.filter(c => c.name.toLowerCase().includes(term));
    render(filtered);
});

init();