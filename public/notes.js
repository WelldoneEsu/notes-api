const BASE_URL = 'https://notes-api-1-3k3m.onrender.com';

const notesList = document.getElementById('notes-list');
const createNoteForm = document.getElementById('create-note-form');
const editNoteModal = document.getElementById('edit-note-modal');
const editNoteForm = document.getElementById('edit-note-form');
const token = localStorage.getItem('token');
const tagFilterInput = document.getElementById('tag-filter');

let allNotes = []; // store all notes for client-side filtering

// Check for authentication token
function checkAuth() {
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Fetch and display notes
async function fetchNotes() {
    if (!token) return;
    try {
        const res = await fetch(`${BASE_URL}/api/notes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
            logout();
            return;
        }

        if (!res.ok) throw new Error('Failed to fetch notes');

        allNotes = await res.json();
        renderNotes(allNotes);
    } catch (err) {
        console.error('Error fetching notes:', err);
        notesList.innerHTML = '<p>Error loading notes. Please try again.</p>';
    }
}

// Render notes to DOM
function renderNotes(notes) {
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = '<p>No notes found. Create your first note!</p>';
        return;
    }

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';

        const noteHTML = `
            <h3>
                ${note.title}
                <span class="note-icons">
                    <button class="edit-btn" data-id="${note._id}" data-title="${encodeURIComponent(note.title)}" data-content="${encodeURIComponent(note.content)}" data-tags="${encodeURIComponent(note.tags.join(', '))}">✏️</button>
                    <button class="delete-btn" data-id="${note._id}">🗑️</button>
                </span>
            </h3>
            <p>${note.content}</p>
            <small><strong>Tags:</strong> ${note.tags.join(', ') || 'None'}</small>
        `;
        noteCard.innerHTML = noteHTML;
        notesList.appendChild(noteCard);
    });

    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const title = decodeURIComponent(btn.dataset.title);
            const content = decodeURIComponent(btn.dataset.content);
            const tags = decodeURIComponent(btn.dataset.tags);
            openEditModal(id, title, content, tags);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteNote(id);
        });
    });
}

// Create a new note
createNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const tags = document.getElementById('note-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    try {
        const res = await fetch(`${BASE_URL}/api/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, tags })
        });

        if (!res.ok) throw new Error('Failed to create note');
        createNoteForm.reset();
        fetchNotes();
    } catch (err) {
        console.error('Error creating note:', err);
        alert('Could not create note.');
    }
});

// Delete a note
async function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        try {
            const res = await fetch(`${BASE_URL}/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to delete note');
            fetchNotes();
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Could not delete note.');
        }
    }
}

// Open edit modal
function openEditModal(id, title, content, tags) {
    document.getElementById('edit-note-id').value = id;
    document.getElementById('edit-note-title').value = title;
    document.getElementById('edit-note-content').value = content;
    document.getElementById('edit-note-tags').value = tags;
    editNoteModal.style.display = 'block';
}

// Close modal handlers
document.querySelector('.close-btn').addEventListener('click', () => {
    editNoteModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editNoteModal) {
        editNoteModal.style.display = 'none';
    }
});

// Save edited note
editNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-note-id').value;
    const title = document.getElementById('edit-note-title').value;
    const content = document.getElementById('edit-note-content').value;
    const tags = document.getElementById('edit-note-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    try {
        const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, tags })
        });

        if (!res.ok) throw new Error('Failed to update note');
        editNoteModal.style.display = 'none';
        fetchNotes();
    } catch (err) {
        console.error('Error updating note:', err);
        alert('Could not update note.');
    }
});

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

document.getElementById('logout-btn').addEventListener('click', logout);

// Filter notes by tags
tagFilterInput.addEventListener('input', () => {
    const input = tagFilterInput.value.toLowerCase();
    const filterTags = input
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    if (filterTags.length === 0) {
        renderNotes(allNotes);
        return;
    }

    const filtered = allNotes.filter(note => {
        const noteTags = note.tags.map(t => t.toLowerCase());
        return filterTags.every(tag => noteTags.includes(tag));
    });

    renderNotes(filtered);
});

// Initial page load
checkAuth();
fetchNotes();
