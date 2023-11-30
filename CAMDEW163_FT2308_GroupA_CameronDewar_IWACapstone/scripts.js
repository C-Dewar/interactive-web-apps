//Import variables from library/book data javaScript file
/** User Stories
 * As a user, I want to view a list of book previews, by title and author, so that I can discover new books to read.
 an image associated with all book previews so that I can recognize a book by the cover even if I forgot the name.
 the option of reading a summary of the book so that I can decide whether I want to read it.
 the option of seeing the date that a book was published so that I can determine how easy it is to obtain second-hand.
 find books based on specific text phrases so that I don’t need to remember the entire title of a book.
 filter books by author so that I can find books to read by authors that I enjoy.
 filter books by genre so that I can find books to read in genres that I enjoy.
 toggle between dark and light modes so that I can use the app comfortably at night.
 */
/** Default background colour setting relative to night or day */

import {authors, books, BOOKS_PER_PAGE, genres} from "./data.js"

//Import display variables from view javaScript file


/** Global scope variables  */
let filteredBooks = books;
let currentPage = 1;
const PREVIEW_RANGE = [0, BOOKS_PER_PAGE];

const themeCss = {
    "day": {dark: "10, 10, 20", light: "255, 255, 255",},
    "night": {dark: "255, 255, 255", light: "10, 10, 20",}
};

if (!books && !Array.isArray(books)) {
    throw new Error('Source required')
}

if (!PREVIEW_RANGE && PREVIEW_RANGE.length < 2) {
    throw new Error('Range must be an array with two numbers')
}

/** Query Selectors */
// ***** Header Elements *****
// Search Button
const dataSearchButton = document.querySelector('[data-header-search]');
// User Settings Button
const dataUserSettingsButton = document.querySelector('[data-header-overlay]');
// ***********************************


// ***** Search Overlay Elements *****
// Search Overlay
const dataSearchOverlay = document.querySelector('[data-search-overlay]');

// Search Title Field
const dataSearchTitle = document.querySelector('[data-search-title]');
// Search Genre Drop Down
const dataSearchGenres = document.querySelector('[data-search-genres]');
// Search Author Drop Down
const dataSearchAuthors = document.querySelector('[data-search-authors]');

// Cancel Button
const dataSearchCancel = document.querySelector('[data-search-cancel]');
// Search Button
const dataSearchForm = document.querySelector('[data-search-form]');
// ***********************************


// ***** User Setting Overlay Elements *****
const dataSettingsOverlay = document.querySelector('[data-settings-overlay]');

// ***** Change Theme Button *****
const dataSettingsTheme = document.querySelector('[data-settings-theme]');
// Cancel Button
const dataSettingsCancel = document.querySelector('[data-settings-cancel]');
// Save Button
const dataSettingsForm = document.querySelector('[data-settings-form]');
// *****************************************


// ***** Active Book Overlay *****
const dataListBookActive = document.querySelector('[data-list-active]');

const dataListBookBlur = document.querySelector('[data-list-blur]');
const dataListBookImage = document.querySelector('[data-list-image]');
const dataListBookTitle = document.querySelector('[data-list-title]');
const dataListBookSubtitle = document.querySelector('[data-list-subtitle]');
const dataListBookDescription = document.querySelector('[data-list-description]');

// Close Active Book Button
const dataListBookClose = document.querySelector('[data-list-close]');
// *****************************************


// ***** Main Book List Content Elements *****
// Books
const dataListItems = document.querySelector('[data-list-items]');
// No Books Found Message
const dataListMessage = document.querySelector('[data-list-message]');
// Show More Books Button
const dataShowMoreButton = document.querySelector('[data-list-button]');
// *****************************************


// ***** Event Listeners *****
// ***** Header Elements *****
dataSearchButton.addEventListener('click', () => {
    dataSearchOverlay.open = true;
    dataSearchOverlay.focus();
    dataSearchCancel.enabled = true;
});

dataUserSettingsButton.addEventListener('click', () => {
    dataSettingsOverlay.open = true;
    dataSettingsOverlay.focus();
    dataSettingsCancel.enabled = true;
});
// ***********************************


// ***** Search Overlay Elements *****
dataSearchCancel.addEventListener('click', () => {
    dataSearchOverlay.open = false;
});

dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Prevents a reset/page refresh
    const formData = new FormData(event.target);
    // Extracts form data
    const filters = Object.fromEntries(formData)
    // Creates an array that stores the filtered books
    const result = [];
    //Reset the currentPage Value to 1 after form submission
    currentPage = 1;

    const filtersTitle = filters.title.trim().toLowerCase();
    const filtersAuthor = filters.author;
    const filtersGenre = filters.genre;
    for (const singleBook of books) {
        const titleMatch = filtersTitle === '' || singleBook.title.toLowerCase().includes(filtersTitle);
        if (!titleMatch) continue;

        const authorMatch = filtersAuthor === 'any' || singleBook.author === filtersAuthor;
        if (!authorMatch) continue;

        const genreMatch = filtersGenre === 'any' || singleBook.genre === filtersGenre;
        if (!genreMatch) continue;

        if (titleMatch && authorMatch && genreMatch) {
            result.push(singleBook);
        }
    }
    result.length < 1 ? dataListMessage.classList.add('list__message_show') : dataListMessage.classList.remove('list__message_show');
    dataListItems.innerHTML = '';
    dataListItems.appendChild(createPreviewsFragment(result));
    window.scrollTo({top: 0, behavior: 'smooth'});
    dataSearchOverlay.open = false;
    dataSearchForm.reset();
});
// ***********************************


// ***** User Setting Overlay Elements *****
dataSettingsTheme.addEventListener('click', () => {
    // TODO: set selected theme value here.
});

dataSettingsCancel.addEventListener('click', () => {
    dataSettingsCancel.enabled = false;
    dataSettingsOverlay.open = false;
});

dataSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // TODO: Save settings to change the theme here
    // window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ?
    //     dataSettingsTheme = 'night' : 'day';
    // if(dataSettingsTheme === 'night'){
    //     document.ducumentElement.style.setProperty('--color-dark', css.night.dark)
    //     document.ducumentElement.style.setProperty('--color-light', css.night.light)
    // }else{
    //     document.ducumentElement.style.setProperty('--color-dark', css.day.dark)
    //     document.ducumentElement.style.setProperty('--color-light', css.day.light)
    // }
});
// *****************************************


// ***** Active Book Overlay *****
dataListBookClose.addEventListener('click', () => {
    // TODO: Close Book Selected Book Preview
});
// *****************************************


// ***** Main Book List Content Elements *****
dataShowMoreButton.addEventListener('click', () => {
    console.log('Show more button clicked')
    // Calculate the start and end indexes for the next page
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex * BOOKS_PER_PAGE;

    // Check if endIndex is within the bounds of the filtered books array
    if (endIndex <= filteredBooks.length) {
        // Append the next set of books to the dataListItems
        const nextBooks = filteredBooks.slice(startIndex, endIndex);
        const fragment = createPreviewsFragment(nextBooks);
        dataListItems.appendChild(fragment);
        dataShowMoreButton.enabled = true;
        console.log('Show more button clicked 111')
        // Update the remaining button text and state
        updateRemainingButton();
    } else {
        // If there are no more books to display, disable the button
        dataShowMoreButton.disabled = true;
        dataShowMoreButton.innerText = 'No more books';
    }
});
// *****************************************


/**
 * Function to update the "Show more" button with the appropriate text using the current page and book data variables.
 * are being displayed per page, it updates the button's text displayed as well as interactability (sets disabled if attempting to go before or beyond specified range)
 */

/** Update remaining books to be displayed via the remaining button function  */
const updateRemainingButton = () => {
    console.log('Show more button clicked 222')
    const remainingBooksCount = filteredBooks.length - (currentPage * BOOKS_PER_PAGE);
    const remainingBooksDisplay = remainingBooksCount > 0 ? remainingBooksCount : 0;

    dataShowMoreButton.innerHTML =
        `<span>Show more</span>
        <span class="list__remaining"> (${remainingBooksDisplay})</span>`;

    dataShowMoreButton.disabled = !(remainingBooksCount > 0);
};


/** createPreview function that will generate a preview from the selected book/element */
const createPreview = ({author, id, image, title}) => {
    const element = document.createElement('button');
    element.className = "preview";
    element.dataset.preview = id;
    element.innerHTML = /* HTML */ `<div>
<img class='preview__image' src = "${image}" alt="book cover"}</img>
</div>
<div class ='preview__info'>
<dt class = "preview__title">${title}</dt>
<dt class = "preview__author"> by ${authors[author]}</dt>
`;
    element.addEventListener('click', () => handleListItem)
    return element;
};



/** Create Previews Fragment Function */
const createPreviewsFragment = (filteredBooks, startIndex = PREVIEW_RANGE[0], endIndex = PREVIEW_RANGE[1]) => {
    const fragment = document.createDocumentFragment();
    const extracted = filteredBooks.slice(startIndex, endIndex);

    for (let i = 0; i < extracted.length; i++) {
        const {author, id, image, title} = extracted[i];
        const preview = createPreview({
            author,
            id,
            image,
            title
        });

        fragment.appendChild(preview);
    }
    updateRemainingButton();
    return fragment;
};


dataListItems.appendChild(createPreviewsFragment(filteredBooks));
dataListItems.style.display = "grid";

/** Create Genres Fragment */
let genresFragment = document.createDocumentFragment();
const genresOptionAll = document.createElement('option');
genresOptionAll.value = 'any';
genresFragment.innerText = 'All Genres';
genresFragment.appendChild(genresOptionAll);

for (const [id, name] of Object.entries(genres)) {
    const option = document.createElement('option')
    const value = id;
    const text = name;
    option.value = value;
    option.innerHTML = text;
    genresFragment.appendChild(option);
}
dataSearchGenres.appendChild(genresFragment);

/** Create Authors Fragment */
let authorsFragment = document.createDocumentFragment();
const authorsOptionAll = document.createElement('option');
authorsOptionAll.value = 'any';
authorsFragment.innerText = 'All Authors';
authorsFragment.appendChild(authorsOptionAll);

for (const [id, name] of Object.entries(authors)) {
    const option = document.createElement('option')
    const value = id;
    const text = name;
    option.value = value;
    option.innerHTML = text;
    authorsFragment.appendChild(option);
}
dataSearchAuthors.appendChild(authorsFragment);


/** Search/Filter Form Submit Handler to submit and perform the search function using author, genre and title values pulled from the data.js file */

/** List click handler to target the selected book via click and expand the books preview/information */
const handleListItem = (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let selectedBook = null;

    for (const node of pathArray) {
        if (selectedBook) break;

        const previewId = node?.dataset?.preview;

        if (!previewId) continue;

        for (const singleBook of books) {
            if (singleBook.id === previewId) {
                selectedBook = singleBook;
                break;
            }
        }
    }

    if (!selectedBook) return;
    const {image, title, author, published, description} = selectedBook;
    dataListBookActive.open = true;
    dataListBookBlur.src = image;
    dataListBookImage.src = image;
    dataListBookTitle.innerText = title;
    dataListBookSubtitle.innerHTML = `${authors[author]} (${Date(published).getFullYear()})`;
    dataListBookDescription.innerText = description;
};

