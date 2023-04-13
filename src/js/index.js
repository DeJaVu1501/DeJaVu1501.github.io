import bootstrap5 from "./libs/bootstrap-5";

const sidebar = document.querySelector('.sidebar');
const navLinks = sidebar.getElementsByClassName("nav-link");
const cardText = document.getElementsByClassName('card-text')
const showMoreBtn = document.getElementsByClassName('showMore__btn')
const cardsList = document.getElementsByClassName('cards-list')
const navLinksNavbar = document.getElementsByClassName('navbar-nav')[0].getElementsByClassName('nav-link')

let page = 1;
const limit = 9;
let isLoading = false;

function fetchCards() {
    const baseURL = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
    isLoading = true;
    fetch(baseURL)
        .then(response => response.json())
        .then(data => data.map((el) => {
            console.log(data);
            cardsList[0].insertAdjacentHTML('beforeend', renderCard(el));
            page++
            isLoading = false;
        })).then(() => {
            Array.from(cardText).forEach(element => {
                let lines = element.textContent.split('\n');
                if (lines.length > 2) {
                    element.classList.add('textHidden')
                    element.closest('.card').querySelector('.showMore__btn').classList.add('textHidden')
                }
            });

            Array.from(showMoreBtn).forEach((btn) => {
                btn.addEventListener('click', () => {
                    btn.closest('.card').querySelector('.card-text').classList.remove('textHidden')
                    btn.classList.remove('textHidden')
                })
            })
        })
        .catch(error => console.error(error));
}

function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom && !isLoading) {
        fetchCards();
    }
}

const setActiveItem = (items) => {
    items.map((el) => {
        el.addEventListener('click', (e) => {
            let activeLink = items.find((link) => link.classList.contains('active'))
            if (!e.currentTarget.classList.contains('active')) {
                activeLink.classList.remove('active')
                e.currentTarget.classList.add('active')
            }
        })
    })
}

const renderCard = (cardData) => (
    `<li class="cards-list-item col-sm-12 col-lg-6 mb-4">
        <article class="card h-100">
          <img src="${cardData.download_url}" class="card-img-top h-100" alt="...">
          <div class="card-body">
            <h5 class="card-title mb-1 fs-4">Card title</h5>
            <p class="card-text mb-2 textHidden">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero quibusdam fuga numquam ea quam repellendus placeat, consequatur nemo dolore. Deserunt nam illo vero ducimus eos laudantium laborum. Blanditiis, dolorum natus!</p>
            <button type="button" class="btn showMore__btn textHidden p-0">Show more...</button>
          </div>
          <div class="card__actions p-3">
            <button type="button" class="btn btn-primary me-3">Save to collection</button>
            <button type="button" class="btn btn-outline-secondary">Share</button>
          </div>
        </article>
      </li>
    `)

document.addEventListener('DOMContentLoaded', function () {
    setActiveItem(Array.from(navLinks))
    setActiveItem(Array.from(navLinksNavbar))
    fetchCards()
});

window.addEventListener('scroll', handleScroll);

