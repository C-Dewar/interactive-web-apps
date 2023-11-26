//Import variables from library/book data javaScript file

import {BOOKS_PER_PAGE, books, authors, genres} from "./data.js"

//Import display variables from view javaScript file


/** Global scope variables  */
let filteredBooks = books;
let currentPage = 1;
const PREVIEW_RANGE = [0, BOOKS_PER_PAGE];
const matches = books;

const day = {dark: "10, 10, 20", light: "255, 255, 255", };
  
const night = {dark: "255, 255, 255", light: "10, 10, 20",};
 

/** Query Selectors: */
// List
const dataListButton = document.querySelector('[data-list-button]');
const dataListMessage = document.querySelector('[data-list-message]');
const dataListTitle = document.querySelector('[data-list-title]');
const dataListItems = document.querySelector('[data-list-items]');
const dataListActive = document.querySelector('[data-list-active]');
const dataListBlur = document.querySelector('[data-list-blur]');
const dataListImage = document.querySelector('[data-list-image]');
const dataListSubtitles = document.querySelector('[data-list-subtitles]');
const dataListDescription = document.querySelector('[data-list-description]');
const dataListClose = document.querySelector('[data-list-close]');
//Search
const dataSearchButton = document.querySelector('[data-search-button]');
const dataSearchOverlay =  document.querySelector('[data-search-overlay]');
const dataSearchCancel = document.querySelector('[data-search-cancel]');
const dataSearchAuthors = document.querySelector('[data-search-authors]');
const dataSearchForm =  document.querySelector('[data-search-form]');
const dataSearchGenres  = document.querySelector('[data-list-genres]');
const dataSearchTitle =  document.querySelector('[data-list-title]');
const dataSearchHeader = document.querySelector('[data-header-search]');
const dataHeaderOverlay = document.querySelector('[data-header-overlay]');
//Settings
const dataSettingsButton = document.querySelector('[data-header-settings]');
const dataSettingsForm = document.querySelector('[data-settings-form]');
const dataSettingsOverlay =  document.querySelector('[data-settings-overlay]');
const dataSettingsCancel = document.querySelector('[data-settings-cancel]');
const dataSettingsTheme = document.querySelector('[data-settings-theme]');
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

const defaultTheme = (event) => {
    event.preventDefault();

    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
};
if (!books && !Array.isArray(books)){ throw new Error('Source required')};
if (!PREVIEW_RANGE && PREVIEW_RANGE.length < 2){throw new Error('Range must be an array with two numbers')};

/**
 * Function to update the "Show more" button with the appropriate text using the current page and book data variables.
 * are being displayed per page, it updates the button's text displayed as well as interactability (sets disabled if attempting to go before or beyond specified range)
 */

/** Update remaining books to be displayed via the remaining button function  */

const updateRemainingButton = () => {
    const remainingBooksCount = filteredBooks.length - currentPage * BOOKS_PER_PAGE;
    const remainingBooksDisplay = remainingBooksCount > 0 ? remainingBooksCount : 0;

    dataListButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remainingBooksDisplay})</span>`;
    
    dataListButton.disabled = remainingBooksCount <= 0;
};
    
/** createPrieview function that will generate a preview from the selected book/element */
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
return element;
}



/** Create Previews Fragment Function
 * @
 */
const createPreviewsFragment = (filteredBooks, startIndex = PREVIEW_RANGE[0], endIndex = PREVIEW_RANGE[1]) => {
const fragment = document.createDocumentFragment(); 
const extracted = filteredBooks.slice(startIndex, endIndex);

for (let i = 0; i < extracted.length; i++){
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


/** create Genres Fragment */

const genresFragment = document.createDocumentFragment();
const genresOptionAll = document.createElement('option');
genresOptionAll.value = 'any';
genresFragment.innerText = 'All Genres';
genresFragment.appendChild(genresOptionAll);

for (const [id, name] of Object.entries(genres)) {
    const option = document.createElement('option')
    const value = id;
    const text = name;
    genresOptionAll.value = value;
    genresOptionAll.innerHTML = text;
    genresFragment.appendChild(option)
};

dataSearchGenres.appendChild(genresFragment);


/** create Authors Fragment */
const authorsFragment = document.createDocumentFragment();
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
    genres.appendChild(option);
}
dataSearchAuthors.appendChild(authorsFragment);



dataListButton.addEventListener('click', dataListHandler);


/**Search overlay handler function */


/** Search/Filter Form Submit Handler to submit and perform the search function using author, genre and book values pulled from the data.js file */

const handleFilterFormSubmit = (event) => {
    event.preventDefault();
//prevents a reset/page refresh
    const formData = new FormData(event.target);
//Extracts form data
    const filters = Object.fromEntries(formData)
//creates an array that stores the filtered books
    const result = [];
//Reset the currentPage Value to 1 after form submission
    currentPage = 1;

    const filtersTitle = filters.title.trim().toLowerCase();
    const filtersAuthor = filters.author;
    const filtersGenre = filters.genre;
    for(const singleBook of books ){
        const titleMatch = filtersTitle === '' || singleBook.title.toLowerCase().includes(filtersTitle);
        if(!titleMatch) continue;
        
        const authorMatch = filtersAuthor === 'any' || singleBook.author === filtersAuthor;
        if(!authorMatch) continue;

        const genreMatch = filtersGenre === 'any' || singleBook.genre === filtersGenre;
        if(!genreMatch) continue;

        if(titleMatch && authorMatch && genreMatch){
            result.push(singleBook);
        }
    }
result.length <1 ? dataListMessage.classList.add('list__message_show') : dataListMessage.classList.remove('list__message_show');
dataListItems.innerHTML = '';
const filteredBooks = result;
dataListItems.appendChild(createPreviewsFragment(filteredBooks));
window.scrollTo({top:0, behavior: 'smooth'});
dataSearchOverlay.open = false;
dataSearchForm.reset();
};

/** List click handler to  */
const handleListItem = (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let selectedBook = null;

    for(const node of pathArray){
        if(selectedBook)break;

        const previewId = node?.dataset?.preview;

        if(!previewId)continue;

        for (const singleBook of books) {
            if (singleBook.id === previewId){
            selectedBook = singleBook; 
            break;
        } 
    }
}

if(!selectedBook) return;
    const { image, title, author, published, description} = selectedBook;
    dataListActive.open = true;
    dataListBlur.src = image;
    dataListImage.src = image;
    dataListTitle.innerText = title;
    dataListSubtitles.innerHTML = `${authors[author]} (${Date(published).getFullYear()})`;
    dataListDescription.innerText = description;
    
};

/** Event Listeners  & Shorter handler functions*/

/**Search button Handler - Opens the search overlay*/
const handleSearchButtonClick = () =>{
    dataSearchOverlay.open = true;
    dataSearchTitle.focus();
};

dataSearchButton.addEventListener('click', handleSearchButtonClick);

dataSearchForm.addEventListener('submit', handleFilterFormSubmit);
/** Settings Cancel click Handler & Listener*/

const handleSearchCancelClick = () => {
    dataSearchOverlay.open = false;
    dataSearchForm.reset();
};
// Event Listener for search cancel button
dataSearchCancel.addEventListener('click', handleSearchCancelClick);

dataSettingsForm.addEventListener('submit', handleSettingsForm);

//Settings button click handler

const handleSettingsButton = () => {
    dataSettingsOverlay.open = true;
};

dataSettingsButton.addEventListener('click', handleSettingsButton);

//Settings cancel click button handler

const handleSettingsCancel = () => {
    dataSettingsOverlay.open = false;
};

dataSettingsCancel.addEventListener('click', handleSettingsCancel);


/**List Button Handler - Adds another page of books to the currently scrollable area.
 * Does so in increments of 36 books per page as defines by the global const.
 * */

const handleListButton = () => {
    const nextPage = currentPage + 1;
    currentPage = nextPage;

    // Calculate the start and end indexes for the next page
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = currentPage * BOOKS_PER_PAGE;

    // Check if endIndex is within the bounds of the filtered books array
    if (endIndex <= filteredBooks.length) {
        // Append the next set of books to the dataListItems
        const nextBooks = filteredBooks.slice(startIndex, endIndex);
        const fragment = createPreviewsFragment(nextBooks);
        dataListItems.appendChild(fragment);

        // Update the remaining button text and state
        updateRemainingButton();
    } else {
        // If there are no more books to display, disable the button
        dataListButton.disabled = true;
        dataListButton.innerText = 'No more books';
    }
};
//List button event listener
dataListButton.addEventListener('click', handleListButton);


dataListItems.addEventListener('click', handleListItem);


const handleListClose = () => {
    dataListOverlay.open = false;
};

dataListClose.addEventListener('click', handleListClose);
