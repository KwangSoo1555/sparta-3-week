let Movie_id = 0;
let num = 0;
let reviewArr = [];
let clickedNum = -1;

// 1. 리뷰 작성, 사용자 확인
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

async function getdata() {
    // localStorage에서 데이터 가져오기
    const movieInfo = sessionStorage.getItem('movie-info');
    const movieData = await JSON.parse(movieInfo);

    Movie_id = await movieData.movie_id

    const ReviewInfo = localStorage.getItem(Movie_id);
    const ReviewData = await JSON.parse(ReviewInfo);

    if (ReviewData !== null) {
        reviewArr = ReviewData;
        if (reviewArr.length > 0) {
            const lastNum = reviewArr[reviewArr.length - 1];
            num = lastNum._num + 1;
        }
    }

    return movieData;
}

function createSubPageCard(movieData) {
    // 서브 페이지 카드 만들기
    const subPageMovieDiv = `
            <div class="col" id="movieCard">
                <div class="card h-100">
                    <div class="card-body">
                    <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" class="card-img-top" alt="이미지 준비중">
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

    let editBtnPop = document.getElementsByClassName('editBtn');
    let editBtnPopLength = editBtnPop.length;
    for (let i = 0; i < editBtnPopLength; i++) {
        editBtnPop[i].addEventListener('click', openFirstPopUp);
    };
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
        <button class="editBtn" id="${review._num}" onclick="editReviewNum(this.id)"> 수정</button> 
        <button id="${-review._num}" onclick="deleteReview(this.id)"> 삭제</button>
    </div>
    `;
    document.querySelector("#review_card").insertAdjacentHTML('beforeend', review_div);
}

function reviewSave() {
    if ((clickedNum/1) < 0) {
        const newReview = new Review(num,
            document.getElementById('review-name').value,
            document.getElementById('review-score').value,
            document.getElementById('review-context').value,
            document.getElementById('review-pw').value);
        reviewArr.push(newReview);
    } else {
        const editReview = new Review(clickedNum,
            document.getElementById('review-name').value,
            document.getElementById('review-score').value,
            document.getElementById('review-context').value,
            document.getElementById('review-pw').value);

        let editNum = 0;
        for (let i = 0; i < reviewArr.length; i++) {
            if (clickedNum === reviewArr[i]._num) {
                editNum = i;
                break;
            }
        }
        reviewArr.splice(editNum, 1, editReview);
        clickedNum = -1;
    }
    localStorage.removeItem(Movie_id);
    localStorage.setItem(Movie_id, JSON.stringify(reviewArr));
    window.location.reload();
    reviewPrint();
}

function editReviewNum(clickId) {
    clickedNum = clickId / 1;

    const pw = prompt("비밀번호를 입력해주세요.");

    pwCheckArr = reviewArr.find((data) => data._num === clickedNum);

    if (pw === pwCheckArr._passward) {
        
    } else {
        alert("비밀번호가 틀렸습니다.");
        window.location.reload();
    }
    
}

function deleteReview(clickId) {
    const clickReviewNum = (- clickId) / 1;

    const pw = prompt("비밀번호를 입력해주세요.");

    pwCheckArr = reviewArr.find((data) => data._num === clickReviewNum);

    if (pw === pwCheckArr._passward) {
        reviewArr = reviewArr.filter((data) => data._num !== clickReviewNum);

        localStorage.removeItem(Movie_id);
        localStorage.setItem(Movie_id, JSON.stringify(reviewArr));
        window.location.reload();
    } else {
        alert("비밀번호가 틀렸습니다.");
        window.location.reload();
    }
}

function remove_cards() {
    const cardlist = document.getElementById('review_card');

    cardlist.innerHTML = "";
}

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

print();
