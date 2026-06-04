const eventsContainer = document.getElementById('eventsContainer');
const eventForm = document.getElementById('eventForm');
const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');
const eventDescriptionInput = document.getElementById('eventDescription');
const formWarning = document.getElementById('formWarning');
const eventCount = document.getElementById('eventCount');
const searchInput = document.getElementById('searchInput');
const currentYear = document.getElementById('currentYear');

const initialEvents = [
  {
    id: 'evt-1',
    name: 'Community Tech Meetup',
    date: '2026-09-15',
    description: 'A gathering for local tech enthusiasts to share ideas and network.'
  },
  {
    id: 'evt-2',
    name: 'Summer Concert',
    date: '2026-08-02',
    description: 'Outdoor music festival featuring local bands and food trucks.'
  },
  {
    id: 'evt-3',
    name: 'Charity Run',
    date: '2026-07-05',
    description: '5K run to raise funds for community education initiatives.'
  }
];

let events = [...initialEvents];

const formatDate = dateString => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const isPastEvent = dateString => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateString + 'T00:00:00');
  return eventDate < today;
};

const renderEvents = filteredEvents => {
  const list = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  eventsContainer.innerHTML = '';

  if (list.length === 0) {
    eventsContainer.innerHTML = '<p class="empty-state">No matching events. Try another search term.</p>';
  }

  list.forEach(event => {
    const card = document.createElement('article');
    card.className = `event-card ${isPastEvent(event.date) ? 'past' : 'upcoming'}`;
    card.innerHTML = `
      <h3>${event.name}</h3>
      <time datetime="${event.date}">${formatDate(event.date)}</time>
      <p>${event.description}</p>
      <button class="delete-btn" data-id="${event.id}">Delete</button>
    `;

    eventsContainer.appendChild(card);
  });

  eventCount.textContent = `${list.length} ${list.length === 1 ? 'event' : 'events'} found`;
};

const refreshEvents = () => renderEvents(events);

const showWarning = message => {
  formWarning.textContent = message;
};

const clearForm = () => {
  eventNameInput.value = '';
  eventDateInput.value = '';
  eventDescriptionInput.value = '';
};

eventForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = eventNameInput.value.trim();
  const date = eventDateInput.value;
  const description = eventDescriptionInput.value.trim();

  if (!name || !date || !description) {
    showWarning('Please complete all fields before adding an event.');
    return;
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    name,
    date,
    description
  };

  events.push(newEvent);
  events = events.sort((a, b) => new Date(a.date) - new Date(b.date));
  refreshEvents();
  clearForm();
  showWarning('');
});

eventsContainer.addEventListener('click', e => {
  if (e.target.matches('.delete-btn')) {
    const id = e.target.dataset.id;
    events = events.filter(event => event.id !== id);
    refreshEvents();
  }
});

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = events.filter(event => {
    return event.name.toLowerCase().includes(searchTerm) || event.date.includes(searchTerm);
  });
  renderEvents(filtered);
});

currentYear.textContent = new Date().getFullYear();
refreshEvents();
