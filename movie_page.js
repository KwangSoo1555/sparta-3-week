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


//추가중
// html 에 글쓰고 저장하는 버튼 하나 만들어라

const reviewCheck = document.querySelector('#reviewCheck') //리뷰버튼
const inputElement = document.getElementById('inputCity'); //닉네임  
const floatingSelectGrid = document.querySelector('#inputState') //별점
const reviewInput = document.querySelector('#reviewInput') //리뷰입력
const inputZip = document.querySelector('#inputZip') //비번
const list = document.querySelector('#list') // 리스트



window.onload = function() {
    // localStorage에서 데이터 불러오기
    const nickname = localStorage.getItem('nickname');
    const review = localStorage.getItem('review');
    const star = localStorage.getItem('star');
    // const password = localStorage.getItem('password');
  
    // 데이터가 있는 경우 리스트에 추가
    if (nickname && review && star ) {
        reviewList(nickname, review, star);
    } 
    // else {
    //     alert('닉네임, 리뷰 , 비밀번호를 모두 입력해야 합니다!')
    // } 
};


//input 에 값넣고 버튼 클릭시 로컬스토리지로
reviewCheck.addEventListener('click', function(e){
    e.preventDefault(); //reload 안되게.

    localStorage.setItem('nickname', inputElement.value);
    localStorage.setItem('star', floatingSelectGrid.value);
    localStorage.setItem('review', reviewInput.value);
    localStorage.setItem('password', inputZip.value);
   
    reviewList(inputElement.value, reviewInput.value, floatingSelectGrid.value);
});
   
    function reviewList(nickname, review, star) {
  let tempHtml =`<a href="#" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">${nickname}<span id="star-rating">${star}</span></h5>
    </div>
    <p class="mb-1">${review}</p>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <button type="button" class="btn btn-primary btn-sm" id="updateBtn">수정</button>
    <button id="deletebutton" type="button" class="btn btn-secondary btn-sm">삭제</button>
</div>
  </a>`
    
  list.insertAdjacentHTML('beforeend', tempHtml)
   

};
