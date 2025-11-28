const templates = {
    book: Handlebars.compile(document.querySelector('#template-book').innerHTML)
};

class BooksList{
    constructor(){
        const thisBooksList = this;

        thisBooksList.data = dataSource.books;

        thisBooksList.favoriteBooks = [];
        thisBooksList.filters = [];

        thisBooksList.getElements();
        thisBooksList.render();
        thisBooksList.initActions();
    }

    getElements(){
        const thisBooksList = this;

        thisBooksList.dom = {};
        thisBooksList.dom.bookList = document.querySelector('.books-list');
        thisBooksList.dom.filtersForm = document.querySelector('.filters');
    }

    render(){
        const thisBooksList = this;

        for(const book of thisBooksList.data){
            const ratingBg = thisBooksList.determineRatingBg(book.rating);
            const ratingWidth = book.rating * 10;

        const bookData = {
            ...book,
            ratingBg: ratingBg,
            ratingWidth: ratingWidth,
        };

        const generatedHTML = templates.book(bookData);
        const element = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.dom.bookList.appendChild(element);
      }
    }

    initActions(){
        const thisBooksList = this;

        thisBooksList.dom.bookList.addEventListener('dblclick', function(event){
            event.preventDefault();

            const image = event.target.closest('.book__image');
            if(!image) return;

            const bookId = image.getAttribute('data-id');

            image.classList.toggle('favorite');

            if(image.classList.contains('favorite')){
                thisBooksList.favoriteBooks.push(bookId);
            } else {
                const index = thisBooksList.favoriteBooks.indexOf(bookId);
                thisBooksList.favoriteBooks.splice(index, 1);
            }
        });

        thisBooksList.dom.filtersForm.addEventListener('click', function(event){
            const element = event.target;

            if(element.tagName == 'INPUT' && element.type == 'checkbox' && element.name == 'filter'){
                const value = element.value;

                if(element.checked){
                    if(!thisBooksList.filters.includes(value)){
                        thisBooksList.filters.push(value);
                    }
                } else {
                    const index = thisBooksList.filters.indexOf(value);
                    if(index !== -1){
                        thisBooksList.filters.splice(index, 1);
                    }
                }

                thisBooksList.filterBooks();
            }
        });
    }

    filterBooks(){
        const thisBooksList = this;

        for (const book of thisBooksList.data){
        let shouldBeHidden = false;

        for(const filter of thisBooksList.filters){
            if(!book.details[filter]){
                shouldBeHidden = true;
                break;
            }
        }
        const image = thisBooksList.dom.bookList.querySelector('.book__image[data-id="' + book.id + '"]');

        if (!image) continue;

        if(shouldBeHidden){
            image.classList.add('hidden');
        } else {
            image.classList.remove('hidden');
        }
    }
}

    determineRatingBg(rating) {
        if (rating <= 6) {
          return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
        } else if (rating > 6 && rating <= 8) {
          return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
        } else if (rating > 8 && rating <= 9) {
          return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
        } else if (rating > 9) {
          return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
}

const app = new BooksList();
