async function getdata() {
    // localStorage에서 데이터 가져오기
    const movieInfo = sessionStorage.getItem('movie-info');
    movieData = await JSON.parse(movieInfo);

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
    document
        .querySelector("#subpagecard")
        .insertAdjacentHTML('beforeend', subPageMovieDiv);
}

const print = async () => {
    const data = await getdata();

    createSubPageCard(data);
    sessionStorage.clear();
}

print();
