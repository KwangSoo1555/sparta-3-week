
// api 가져오기
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWI5NGFhM2NlYmVlNTE3MDA1OGZkNTE4YmYyMzdmOSIsInN1YiI6IjY2MjhlMTQwZTI5NWI0MDE0YTlhM2EyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.92T_Xg7sAwljnOVmTCWxLkYMWTXdvllzp8EVPjlWVv0'
    }
};

//탑10

const kofic_movieData = [];

async function kofic_getdata() {
    const now = new Date('2024-05-01');
    const year = now.getFullYear();
    let month;
    if (now.getMonth() < 10) {month = '0' + (now.getMonth() + 1)} else {month = now.getMonth() + 1};
    let date;
    if (now.getDate() < 10) {date = '0' + (now.getDate()-1)} else {date = now.getDate()-1};
    const today = String(year).concat(month, date);
    console.log(today);

    const kofic_response = await fetch(`http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=a81bd7ef54b23cba78542e2c105ad5b1&targetDt=${today}`);
    const kofic_data = await kofic_response.json();
    
    for(i of kofic_data.boxOfficeResult.dailyBoxOfficeList) {
        const movie = {};
        movie['title'] = i['movieNm'];
        movie['rank'] = i['rank'];

        kofic_movieData.push(movie);
    }
    return kofic_movieData;
}

function kofic_makeCard(i) {
    let new_rank = ""
    if (i.rankOldAndNew === "NEW") {
        new_rank = "NEW!!!"
    };

    const rankDiv = `
    <p>${i.rank}위: ${i.title}</p>
    `;

    // document.querySelector("#kofic_rank").insertAdjacentHTML('beforeend', rankDiv);
    document.querySelector("#exampleModal .modal-body").insertAdjacentHTML('beforeend', rankDiv);
}

async function kofic_print() {
    await kofic_getdata();
    // const top3Movies = kofic_movieData.slice(0, 3); // 상위 3위 데이터만 가져오기
    // top3Movies.forEach(i => {
    //     kofic_makeCard(i);
        // 10위까지 불러오기 
    kofic_movieData.forEach(i => {
        kofic_makeCard(i);
    });
}

kofic_print();

//탑10끝




const movieData = [];
 async function getdata() {
//페이지수 추가
for(let i = 1; i <=5; i++){
    
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko-US&page=${i}`, options);
    const data = await response.json();


    // api key 뽑기
    for (item of data['results']) {

        const movie = {};
        movie['movie_id'] = item['id'];
        movie['title'] = item['title'];
        movie['overview'] = item['overview'];
        movie['poster_path'] = item['poster_path'];
        movie['vote_average'] = item['vote_average'];
        movie['original_title'] = item['original_title'];
        movie['popularity'] = item['popularity']; //인기순.
        movie['release_date'] = item['release_date']; //개봉날짜
        movie['genre_ids'] = item['genre_ids'];//장르 
       
        movieData.push(movie);
}
    };
    return movieData;
};




// 카드 만들기
function makeCard(item, count) {

    const movieDiv = `
    <div class="col" id="movieCard${count}" onclick="subPageOpen(${item.movie_id})">
        <div class="card h-100">
            <div>
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="이미지 준비중">
            </div>
            <div class="card-body">
                <h5 class="card-title" id="movieTitle${count}">${item.title}</h5>
                <p class="card-text">${item.overview}</p>
            </div>
            <div class="card-footer">
                <small class="text-body-secondary">★ ${item.vote_average}</small>
            </div>
        </div>
    </div>
    `;

    document.querySelector("#moviecard").insertAdjacentHTML('beforeend', movieDiv);
}

// 검색 구현
function movieSearch() {
    // 검색한 값
    const ex = document.querySelector("#searchbar").value.toLowerCase();

    // 검색한 값과 영화 제목 비교
    const searchedData = movieData.filter((i) => {
        if (i['title'].toLowerCase().search(ex) !== -1) {
            return i['title'];
        }
    });

    //동영상 숨기기
    const videoBox = document.querySelector(".main");
    videoBox.style.display = "none";


    // 카드 초기화
    toggleCard();

    // 카드붙여
    let count = 0;
    searchedData.forEach(item => {
        makeCard(item, count);
        count++;
    });

    if (searchedData.length === 0) {
        alert("해당 영화는 존재하지 않습니다.");
        resetCard();
    }
}



// 카드 초기화
function resetCard() {
    
    window.location.reload(); //카드정렬후 초기화
   
    for (let count = 0; count < movieData.length; count++) {
        document.querySelector(`#movieCard${count}`).setAttribute("style", "display: block;");
        document.querySelector("#searchbar").value = "";
    }
}

// 출력
const print = async () => {
    const data = await getdata();
    let count = 0;
    data.forEach(item => {
        makeCard(item, count);
        count++;
    });

    document.getElementById("searchbtn").addEventListener("click", movieSearch);
    document.getElementById("search").focus();
    document.getElementById("search").addEventListener('keydown', event => {
        if (event.key == 'Enter') { movieSearch() };
    });
}

// 서브 페이지 열기
function subPageOpen(clickMovieId) {
    const clickedData = movieData.find((data) => data['movie_id'] === clickMovieId);
    sessionStorage.setItem("movie-info", JSON.stringify(clickedData));
    window.location.href = `movie_page.html?id=${clickMovieId}`;
}

//나린님 드랍다운 onclick에서 변경

document.getElementById("genre_select").addEventListener("change", function() {
    const selectValue = this.value; // 선택된 값 가져오기
    genre_sort(selectValue); 
});


//나린님 드랍다운
function genre_sort(value) {
    for (let count = 0; count < movieData.length; count++) {
        const movieCardDiv = document.querySelector(`#movieCard${count}`);
        const movie_genre_ids = movieData[count]['genre_ids'];

        if (value === "장르별 검색") {
            movieCardDiv.setAttribute("style", "display: block;");
        } else if (movie_genre_ids.includes(Number(value))) {
            movieCardDiv.setAttribute("style", "display: block;");
        } else {
            movieCardDiv.setAttribute("style", "display: none;");
        }

        const videoBox = document.querySelector(".main");
        videoBox.style.display = "none"; //추가
        
    };
}


print();


// 메인페이지 드랍다운 하는중
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.querySelector('#toggleBtn'); 
    const dropdown = document.querySelectorAll('.dropdown-item');

    dropdown.forEach((item) => {
        item.addEventListener('click', () => {
            toggleBtn.textContent = item.textContent;

            let Data = [];
            if (item.textContent === "인기순") {
                Data = movieData.sort((a, b) => b.popularity - a.popularity);
            } else if (item.textContent === "평점순") {
                Data = movieData.sort((a, b) => b.vote_average - a.vote_average);
            } else if (item.textContent === "최신순") {
                Data = movieData.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            } else {
                Data = movieData.sort((a, b) => a.title.localeCompare(b.title));
            }

            toggleCard();
            Data.forEach((item) => {
                makeCard(item);
            });
            // 동영상 숨기기
            const videoBox = document.querySelector(".main");
            videoBox.style.display = "none";
        });
    });
});
// 카드정렬 초기화
function toggleCard() {
    document.querySelector("#moviecard").innerHTML = "";
}

//동영상 상세정보 클릭
const mainBtn = document.querySelector('#main_detail')
mainBtn.addEventListener('click',()=>{
 window.location.href = "https://namu.wiki/w/%EB%B2%94%EC%A3%84%EB%8F%84%EC%8B%9C4";
})

document.getElementById("trailer").addEventListener("click", function() {
    window.location.href = "https://www.youtube.com/watch?v=OqfiM8zEzQA&t=1s";
  });

//시리즈클릭
 document.getElementById('series').addEventListener("click",function(){
    window.open("https://serieson.naver.com/v3/movie?", "_blank");
 })

//무료영화
document.getElementById('freemovie').addEventListener("click",function(){
    window.open("https://serieson.naver.com/v3/movie/free", "_blank");
})


  // 56초뒤 사라진다.
setTimeout(hideMainup, 56000);

function hideMainup(){
  const mainup = document.querySelector(".mainup");
  mainup.style.display = "none"; // mainup을 숨김
}
