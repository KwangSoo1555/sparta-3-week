async function getdata() {
    // localStorage에서 데이터 가져오기
    const movieInfo = localStorage.getItem('movie-info');
    const movieData = await JSON.parse(movieInfo);

    return movieData;
}

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

// 리뷰 카드 생성
function make_review_card() {
    for (let i = 1; i <= localStorage.length; i++) {
        const review = JSON.parse(localStorage.getItem(`review${i}`));

        const review_div = `
        <div class="review_card_body">
            <h4 class="card-title">${review.review_name}</h4>
            <h6 class="card-subtitle mb-2 text-body-secondary">${review.review_star}</h6>
            <p class="card-text">${review.review_content}</p>
            <a href="#" class="card-link">수정</a>
            <a href="#" class="card-link">삭제</a>
        </div>
        `;

        document.querySelector("#review_card").insertAdjacentHTML('beforeend', review_div);
    }

}

// 최종 출력
const print = async () => {
    const data = await getdata();
    const subPageCard = document.querySelector("#subpagecard");
    
    createSubPageCard(data, subPageCard);
    make_review_card();
}

print();

// 리뷰 값 저장
function review_save() {
    console.log(document.querySelector("#review_name").value);
    
    const review = {};
    review.review_name = document.querySelector("#review_name").value;
    review.review_star = document.querySelector("#review_star").value;
    review.review_content = document.querySelector("#review_content").value;
    review.review_pw = document.querySelector("#review_pw").value;
    

    console.log(review);

    localStorage.setItem(`review${localStorage.length}`, JSON.stringify(review));

    alert("리뷰가 작성되었습니다!");
    window.location.reload();
}
