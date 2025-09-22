const BASE_URL = 'http://localhost:5000';

        const notesList = document.getElementById('notes-list');
        const createNoteForm = document.getElementById('create-note-form');
        const editNoteModal = document.getElementById('edit-note-modal');
        const editNoteForm = document.getElementById('edit-note-form');
        const token = localStorage.getItem('token');

        // Check for authentication token
        function checkAuth() {
            if (!token) {
                window.location.href = 'login.html';
            }
        }

        async function fetchNotes() {
            if (!token) return;
            try {
                const res = await fetch(`${BASE_URL}/api/notes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 401) { // Unauthorized, token might be expired
                    logout();
                    return;
                }
                if (!res.ok) throw new Error('Failed to fetch notes');
                const notes = await res.json();
                renderNotes(notes);
            } catch (err) {
                console.error('Error fetching notes:', err);
                notesList.innerHTML = '<p>Error loading notes. Please try again.</p>';
            }
        }

        function renderNotes(notes) {
            notesList.innerHTML = '';
            if (notes.length === 0) {
                notesList.innerHTML = '<p>No notes found. Create your first note!</p>';
                return;
            }
            notes.forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.className = 'note-card';
                noteCard.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    <small>Tags: ${note.tags.join(', ') || 'None'}</small>
                    <div class="note-actions">
                        <button onclick="openEditModal('${note._id}', '${note.title}', '${note.content.replace(/'/g, "\\'")}', '${note.tags.join(', ')}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.845-.844L9.807 10.74a1.5 1.5 0 0 0-.768-.767z"/></svg>
                        </button>
                        <button onclick="deleteNote('${note._id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4h7.764L13 3H3l1.118 1z"/></svg>
                        </button>
                    </div>
                `;
                notesList.appendChild(noteCard);
            });
        }

        createNoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('note-title').value;
            const content = document.getElementById('note-content').value;
            const tags = document.getElementById('note-tags').value.split(',').map(t => t.trim()).filter(t => t.length > 0);
            try {
                const res = await fetch(`${BASE_URL}/api/notes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ title, content, tags })
                });
                if (!res.ok) throw new Error('Failed to create note');
                createNoteForm.reset();
                fetchNotes(); // Refresh the list
            } catch (err) {
                console.error('Error creating note:', err);
                alert('Could not create note.');
            }
        });

        async function deleteNote(noteId) {
            if (confirm('Are you sure you want to delete this note?')) {
                try {
                    const res = await fetch(`${BASE_URL}/api/notes/${noteId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Failed to delete note');
                    fetchNotes(); // Refresh the list
                } catch (err) {
                    console.error('Error deleting note:', err);
                    alert('Could not delete note.');
                }
            }
        }

        function openEditModal(id, title, content, tags) {
            document.getElementById('edit-note-id').value = id;
            document.getElementById('edit-note-title').value = title;
            document.getElementById('edit-note-content').value = content;
            document.getElementById('edit-note-tags').value = tags;
            editNoteModal.style.display = 'block';
        }

        document.querySelector('.close-btn').onclick = () => {
            editNoteModal.style.display = 'none';
        }

        window.onclick = (event) => {
            if (event.target == editNoteModal) {
                editNoteModal.style.display = 'none';
            }
        }

        editNoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-note-id').value;
            const title = document.getElementById('edit-note-title').value;
            const content = document.getElementById('edit-note-content').value;
            const tags = document.getElementById('edit-note-tags').value.split(',').map(t => t.trim()).filter(t => t.length > 0);
            try {
                const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ title, content, tags })
                });
                if (!res.ok) throw new Error('Failed to update note');
                editNoteModal.style.display = 'none';
                fetchNotes(); // Refresh the list
            } catch (err) {
                console.error('Error updating note:', err);
                alert('Could not update note.');
            }
        });

        function logout() {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
        
        // Initial page load
        checkAuth();
        fetchNotes();
