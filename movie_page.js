let Movie_id = 0;
let num = 0;
let reviewArr = [];

async function getdata() {
    // localStorage에서 데이터 가져오기
    const movieInfo = sessionStorage.getItem('movie-info');
    const movieData = await JSON.parse(movieInfo);

    Movie_id = await movieData.movie_id

    const ReviewInfo = localStorage.getItem(Movie_id);
    const ReviewData = await JSON.parse(ReviewInfo);

    if (ReviewData !== null) {
        reviewArr = ReviewData;
        console.log(reviewArr);
        num = reviewArr.length;
    }

    return movieData;
}

function createSubPageCard(movieData) {
    // 서브 페이지 카드 만들기
    const subPageMovieDiv = `
            <div class="col" id="movieCard">
                <div class="card h-100">
                    <div class = ptimg>
                        <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" class="card-img-top" alt="이미지 준비중">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title" id="movieTitle">${movieData.title}</h5>
                        <p class="card-text">${movieData.overview}</p>
                    
                    <div class="card-footer">
                        <small class="text-body-secondary">★ ${movieData.vote_average}</small>
                    </div>
                </div>
            </div>
            `;
    document
        .querySelector("#subpagecard")
        .insertAdjacentHTML('beforebegin', subPageMovieDiv);
}

const print = async () => {
    const data = await getdata();

    createSubPageCard(data);
    reviewPrint();
}

function reviewPrint() {
    remove_cards();
    reviewArr.forEach(data => {
        make_review_card(data);
    });

}
class Review {
    constructor(num, name, star, comment, passward) {
        this._num = num;
        this._name = name;
        this._star = star;
        this._comment = comment;
        this._passward = passward;
    }
}

function make_review_card(review) {
    const review_div = `
    <div class="card-body">
        <h4 class="card-title">${review._name}</h4>
        <h6 class="card-subtitle mb-2 text-body-secondary">${review._star}</h6>
        <p class="card-text">${review._comment}</p>
        <a href="#" class="card-link">수정</a>
        <a href="#" class="card-link">삭제</a>
    </div>
    `;
    document.querySelector("#review_card").insertAdjacentHTML('beforeend', review_div);
}

async function save_btn() {

    const newReview = new Review(num,
        document.querySelector("#review_name").value,
        document.querySelector("#review_star").value,
        document.querySelector("#review_content").value,
        document.querySelector("#review_pw").value);
    num++;
    reviewArr.push(newReview);

    reviewPrint();

    localStorage.removeItem(Movie_id);
    localStorage.setItem(Movie_id, JSON.stringify(reviewArr));
}

function remove_cards() {
    const cardlist = document.getElementById('review_card');

    cardlist.innerHTML = "";
}

print();
