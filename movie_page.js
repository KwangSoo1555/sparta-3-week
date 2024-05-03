// localStorage에서 데이터 가져오기
async function getdata() {
    const movieData = await JSON.parse(sessionStorage.getItem('movie-info'));
    return movieData;
}

// 서브 페이지 카드 만들기
function createSubPageCard(movieData) {
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

    document.querySelector("#subpagecard").insertAdjacentHTML('beforebegin', subPageMovieDiv);
}

const print = async () => {
    const data = await getdata();
    createSubPageCard(data);
}

print();

// 1. 리뷰 작성, 사용자 확인, local storage에 정보 저장

const targetButtonPop = document.getElementById('button-pop');
const targetButtonPopClose = document.getElementById('close-pop');
const firstReviewPop = document.getElementById('review-pop-info-1');
const secondReviewPop = document.getElementById('review-pop-info-2');
const toggleToFirstButton = document.getElementById('go-to-first-pop');
const toggleToSecondButton = document.getElementById('go-to-second-pop');

const checkReviewName = document.getElementById('review-name');
const checkReviewStar = document.getElementById('review-score');
const checkReviewContext = document.getElementById('review-context');
const checkReviewPW = document.getElementById('review-pw');

// 1-1. 팝업 핸들링 및 유효성 검사
let isPopUpOpen = false;
let isSaveClientInfo = false;

function openFirstPopUp(event) {
    event.stopPropagation();
    firstReviewPop.style.display = 'block';
    secondReviewPop.style.display = 'none';

    isPopUpOpen = true;
}

function openSecondPopUp(event) {
    event.stopPropagation();

    if (checkReviewName.value.length < 3 ||
        checkReviewName.value.split('').includes(' ') ||
        checkReviewStar.value.length === 0 ||
        checkReviewContext.value.length < 5 ||
        checkReviewPW.value.length < 4) {
        // 리뷰 작성 유효성 추가 검사 필요 시 조건 추가 가능

        secondReviewPop.style.display = 'block';
        firstReviewPop.style.display = 'none';

    } else {
        alert('정보가 저장되었습니다.');

        reviewSave();

        firstReviewPop.style.display = 'none';
        secondReviewPop.style.display = 'none';
    }
    isPopUpOpen = true;
}

function closePopUp() {
    firstReviewPop.style.display = 'none';
    secondReviewPop.style.display = 'none';
    isPopUpOpen = false;
}

toggleToSecondButton.addEventListener('click', openSecondPopUp);
toggleToFirstButton.addEventListener('click', openFirstPopUp);

targetButtonPop.addEventListener('click', openFirstPopUp);
targetButtonPopClose.addEventListener('click', closePopUp);

document.addEventListener('click', function (event) {
    if (!firstReviewPop.contains(event.target) &&
        !targetButtonPop.contains(event.target) &&
        !secondReviewPop.contains(event.target)) {
        closePopUp();
    }
});

// 1-3. 팝업 취소 버튼
const cancelPopUpButton = document.getElementsByClassName('modal-cancel-button');

for (const button of cancelPopUpButton) {
    button.addEventListener('click', () => {
        closePopUp();
        checkReviewName.value = '';
        checkReviewStar.value = '';
        checkReviewContext.value = '';
        checkReviewPW.value = '';
    });
}

// 1-4. 유효성 검사가 통과된 각 value들을 local storage에 순차로 저장
function reviewSave() {
    const reviewData = {
        client_name: checkReviewName.value,
        client_review_star: checkReviewStar.value,
        client_review_context: checkReviewContext.value,
        review_password: checkReviewPW.value
    };
    localStorage.setItem("review_data" + localStorage.length, JSON.stringify(reviewData));
    location.reload();
}

// 2. 작성된 리뷰는 local storage에 저장된 값으로만 수정, 삭제 기능 구현
const registReview = async () => {
    for (let i = 0; i < localStorage.length; i++) {
        const registData = await JSON.parse(localStorage.getItem(`review_data${i}`));

        const reviewCreateDiv = `
        <div class="card-body">
        <h4 class="card-title">이름: ${registData.client_name}</h4>
        <h6 class="card-subtitle mb-2 text-body-secondary">별점: ${registData.client_review_star}</h6>
        <p class="card-text">리뷰 내용: ${registData.client_review_context}</p>

        <button class="regist-modify-button" id="regist-modify-button">수정</button>
        <button class="regist-delete-button" id="regist-delete-button">삭제</button>
        </div>
        `;

        document.getElementById("review-regist-section").insertAdjacentHTML('beforeend', reviewCreateDiv);
    }
}

registReview();