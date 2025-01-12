const calendarBody = document.getElementById('calendar-body');
const monthYearDisplay = document.getElementById('month-year');
const journalModal = document.getElementById('journal-modal');
const overlay = document.getElementById('overlay');
const selectedDateDisplay = document.getElementById('selected-date');
const journalEntryInput = document.getElementById('journal-entry');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');

let currentDate = new Date();
let journalEntries = {};

// Function to render the calendar
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Set month and year in header
    monthYearDisplay.textContent = currentDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });

    // Get the first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Clear previous calendar days
    calendarBody.innerHTML = '';

    // Add empty days for the first week
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDiv = document.createElement('div');
        calendarBody.appendChild(emptyDiv);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-day');

        // Check if there's an existing journal entry
        const dateKey = `${year}-${month + 1}-${day}`;
        if (journalEntries[dateKey]) {
            dayDiv.style.backgroundColor = '#4caf50'; // Green for saved entries
            dayDiv.style.color = '#fff'; // White text
        }

        dayDiv.addEventListener('click', () => openJournalModal(dateKey));
        calendarBody.appendChild(dayDiv);
    }
}

// Function to open the journal modal
function openJournalModal(date) {
    selectedDateDisplay.textContent = date;
    journalEntryInput.value = journalEntries[date] || '';
    journalModal.style.display = 'block';
    overlay.style.display = 'block';
}

// Function to close the journal modal
function closeJournalModal() {
    journalModal.style.display = 'none';
    overlay.style.display = 'none';
}

// Function to save the journal entry
function saveJournalEntry() {
    const date = selectedDateDisplay.textContent; // Selected date
    const entry = journalEntryInput.value; // Journal entry content

    // Check if the entry is not empty
    if (entry.trim()) {
        journalEntries[date] = entry;

        // Find the corresponding calendar day and update its style
        const allDays = document.querySelectorAll('.calendar-day');
        allDays.forEach((day) => {
            const dayNumber = date.split('-')[2]; // Extract the day number from the date
            if (day.textContent === dayNumber) {
                day.style.backgroundColor = '#4caf50'; // Green background
                day.style.color = '#fff'; // White text
            }
        });
    } else {
        delete journalEntries[date]; // Remove entry if empty

        // Reset the style if the entry is deleted
        const allDays = document.querySelectorAll('.calendar-day');
        allDays.forEach((day) => {
            const dayNumber = date.split('-')[2];
            if (day.textContent === dayNumber) {
                day.style.backgroundColor = ''; // Default background
                day.style.color = ''; // Default text color
            }
        });
    }

    closeJournalModal(); // Close the modal
}

// Event listeners
saveButton.addEventListener('click', saveJournalEntry);
cancelButton.addEventListener('click', closeJournalModal);
overlay.addEventListener('click', closeJournalModal);

// Initial render
renderCalendar();
