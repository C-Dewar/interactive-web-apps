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
const defaultTheme = () => { 
const windowSettings = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';


document.documentElement.style.setProperty('--color-dark', css[theme].dark);
document.documentElement.style.setProperty('--color-light', css[theme].light); 
};


if (!books && !Array.isArray(books)){ throw new Error('Source required')};
if (!PREVIEW_RANGE && PREVIEW_RANGE.length < 2){throw new Error('Range must be an array with two numbers')};

/**
 * Function to update the "Show more" button with the appropriate text using the current page and book data variables.
 * are being displayed per page, it updates the button's text displayed as well as interactability (sets disabled if attempting to go before or beyond specified range)
 */

/** Update remaining books to be displayed via the remaining button function  */

const updateRemainingButton = () => {
    const remainingBooksCount = (filteredBooks.length - currentPage) * BOOKS_PER_PAGE;
    const remainingBooksDisplay = remainingBooksCount > 0 ? remainingBooksCount: 0;
    
    dataListButton.innerText = `Show more (${filteredBooks.length - BOOKS_PER_PAGE})`;
    
    dataListButton.disabled = !(remainingBooksCount > 0);
    
    dataListButton.innerHTML = /* html */ `
        <span>Show more</span>,
        <span class="list__remaining"> (${remainingBooksDisplay})</span>`;
    };
    
/** createPrieview function that will generate a preview from the selected book/element */
const createPreview = ({author, id, image, title}) => {
const element = document.createElement('button');
element.className = "preview";
element.dataset.preview = id;
element.innerHTML = /* HTML */ `<div>
<image class='preview__image' src = "${image}" alt="book cover"}</image>
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


/**  */

dataListClose.addEventListener('click',  dataListHandler);

dataListButton.addEventListener('click', dataListHandler);


/** Show search overlay handler function */
dataHeaderOverlay.addEventListener('click', () => {
    dataSearchOverlay.open === true ;
    dataSearchTitle.focus();
    dataSearchOverlay.style.display = "block";
});

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


const handleListItemClick = (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let selectedBook = null;

    for(const node of pathArray){
        if(selectedBook)break;

        const previewId = node?.dataset?.preview;

        if(!previewId)continue;

        for (const singleBook of books) {
            if (singleBook.id === node?.dataset.preview){
            selectedBook = singleBook; 
            break;
        } 
    }
}

if(!selectedBook) return;
    const { image, title, author, published, description} = clickedBook;
    dataListOverlay.open = true;
    dataListBlur.src = image;
    dataListImage = image;
    dataListTitle = title;
    dataListSubtitles = `${authors[author]} (${Date(published).getFullYear()})`
    dataListDescription.innerText = description;
    
};

/** Event Listeners */
dataSearchButton.addEventListener('click', handleSearchButtonClick);
dataSearchForm.addEventListener('submit', handleFilterFormSubmit);
dataSettingsCancel.addEventListener('click', handleSettingsCancelClick);
dataSettingsForm.addEventListener('submit', handleSettingsFormClick);
dataSettingsButton.addEventListener('click', handleSettingsButtonClick);
dataSettingsCancel.addEventListener('click', handleSettingsCancelClick);
dataListButton.addEventListener('click', handleListButtonClick);
dataListItems.addEventListener('click', handleListItemClick);
dataListClose.addEventListener('click', handleListClose);
/** Functional Defaults  */
defaultTheme();
updateRemainingButton();


