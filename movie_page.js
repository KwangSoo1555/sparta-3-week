async function getdata() {
    // localStorage에서 데이터 가져오기
    const movieInfo = localStorage.getItem('movie-info');
    const movieData = await JSON.parse(movieInfo);

    return movieData;
}

function createSubPageCard(movieData) {
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

    document.querySelector("#subpagecard").insertAdjacentHTML('beforeend', subPageMovieDiv);
}

const print = async () => {
    const data = await getdata();
    createSubPageCard(data);
}

print();

function review_save() {
    console.log("잘 됨");
    console.log(document.querySelector("#review_name").value);

    localStorage.setItem("review_name", document.querySelector("#review_name").value);
    make_review_card();
    window.location.reload();
}

function make_review_card() {
    const review_div = `
    <div class="card-body">
        <h4 class="card-title">이름</h4>
        <h6 class="card-subtitle mb-2 text-body-secondary">별점</h6>
        <p class="card-text">리뷰 내용</p>
        <a href="#" class="card-link">수정</a>
        <a href="#" class="card-link">삭제</a>
    </div>
    `;
    document.querySelector("#review_card").insertAdjacentHTML('beforeend', review_div);
}