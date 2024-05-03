async function getdata() {
    // localStorage에서 데이터 가져오기
    const movieInfo = localStorage.getItem('movie-info');
    const movieData = await JSON.parse(movieInfo);

    return movieData;
}
console.log(getdata())

function createSubPageCard(movieData, subPageCard) {
    // 서브 페이지 카드 만들기
    const subPageMovieDiv = `
            <div class="col" id="movieCard">
                <div class="card h-100">
                    <div>
                        <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" class="card-img-top" alt="이미지 준비중">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title" id="movieTitle">${movieData.title}</h5>
                        <p class="card-text">${movieData.overview}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">★ ${movieData.vote_average}</small>
                    </div>
                </div>
            </div>
            `;
    subPageCard.insertAdjacentHTML('beforebegin', subPageMovieDiv);
}

const print = async () => {
    const data = await getdata();
    const subPageCard = document.querySelector("#subpagecard");
    const reviewDate = await reviewList ();
    const reviewCard = document.querySelector("#review_card");
    createSubPageCard(data, subPageCard);
    make_review_card(reviewDate,reviewCard);
}

print();



function make_review_card(reviewDate,reviewCard) {
    
    const review_div = `
    <div class="card-body">    
    <h4 class="card-title">${reviewDate.name}</h4>
        <h6 class="card-subtitle mb-2 text-body-secondary">${reviewDate.star}</h6>
        <p class="card-text">${reviewDate.review}</p>
        
        <a href="#" class="card-link">수정</a>
        <a href="#" class="card-link">삭제</a>
    </div>
    `;
    reviewCard.insertAdjacentHTML('beforeend', review_div);
}

function reviewList () {
    const reviewInfo = localStorage.getItem('reviewData');
    const reviewDate = JSON.parse(reviewInfo);
    return reviewDate
};
console.log(reviewList())
function makeReviewData () {
    // const currentPageURL = window.location.href
    const reviewCard = JSON.parse(localStorage.getItem('reviewData'));
    const saveReview = {
        name : document.getElementById('review_name').value,
        star : document.getElementById('review_star').value,
        review: document.getElementById('review_content').value,
        pw: document.getElementById('review_pw').value,
    };
    localStorage.setItem('reviewData',JSON.stringify(saveReview));
}


// console.log(reviewCard);
  