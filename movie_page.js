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
    subPageCard.insertAdjacentHTML('beforeend', subPageMovieDiv);
}

const print = async () => {
    const data = await getdata();
    const subPageCard = document.querySelector("#subpagecard");
    
    createSubPageCard(data, subPageCard);
}

print();