
// sessionStorage에서 데이터 가져오기
const getdata = async () => {
    const movieData = await JSON.parse(sessionStorage.getItem('movie-info'));
    return movieData;
}
// 서브 페이지 카드 만들기
const createDetailsPageCard = (movieData) => {
    const detailsPageMovieDiv = `
        <div class="card-wrapper">
            <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" class="movie_img" alt="이미지 준비중">
            <p class="movie_title" id="movieTitle">${movieData.title}</p>
            <p class="movie_info">${movieData.overview}</p>
            <p class="movie_star">★ ${movieData.vote_average}</p>
            <button class="back" onclick="window.location.href = './index.html'">돌아가기</button>
        </div>
        `;

    document.getElementById("details-page-wrapper").insertAdjacentHTML('beforebegin', detailsPageMovieDiv);
}

// sessionStorage에서 가져온 데이터와 카드 만들기 함수를 매개변수로 연결
(async () => {
    const data = await getdata();
    createDetailsPageCard(data);
})();

// 1. 리뷰 작성, 사용자 확인, local storage에 정보 저장
const startReviewRegisterButton = document.getElementById('review-create-button-pop');
const firstRegisterPop = document.getElementById('review-create-pop-info-1');
const secondRegisterPop = document.getElementById('review-create-pop-info-2');
const toggleToFirstRegister = document.getElementById('review-create-go-first-pop');
const toggleToSecondRegister = document.getElementById('review-create-go-second-pop');

const checkRegisterName = document.getElementById('review-create-name');
const checkRegisterStar = document.getElementById('review-create-score');
const checkRegisterContext = document.getElementById('review-create-context');
const checkRegisterPW = document.getElementById('review-create-pw');

// 1-1. 팝업 핸들링 및 유효성 검사
const openRegisterFirstPopUp = (event) => {
    event.stopPropagation();

    firstRegisterPop.style.display = 'block';
    secondRegisterPop.style.display = 'none';
}

const openRegisterSecondPopUp = (event) => {
    event.stopPropagation();

    if (checkRegisterName.value.length < 2 ||
        checkRegisterName.value.split('').includes(' ') ||
        checkRegisterStar.value.length === 0 ||
        checkRegisterContext.value.length < 5 ||
        checkRegisterPW.value.length < 4) {
        // 리뷰 작성 유효성 추가 검사 필요 시 조건 추가 가능

        firstRegisterPop.style.display = 'none';
        secondRegisterPop.style.display = 'block';

    } else {
        alert('정보가 저장되었습니다.');

        reviewSave();
        closeRegisterPopUp();
    }
}

startReviewRegisterButton.addEventListener('click', openRegisterFirstPopUp);

toggleToSecondRegister.addEventListener('click', openRegisterSecondPopUp);
toggleToFirstRegister.addEventListener('click', openRegisterFirstPopUp);

// sub page로 넘어온 movie id에 대해서만 local storage를 저장할 수 있게

// 1-3. 유효성 검사가 통과된 각 value들을 local storage에 순차로 저장
const reviewSave = async () => {
    const data = await getdata();

    let storageReviews = JSON.parse(localStorage.getItem(data.movie_id)) || [];
    let reviewIndex = storageReviews.length;

    const reviewData = {
        reviewIndex: reviewIndex,
        movieId: data.movie_id,
        reviewerName: checkRegisterName.value,
        reviewerStar: checkRegisterStar.value,
        reviewerContext: checkRegisterContext.value,
        reviewerPassword: checkRegisterPW.value
    };

    if (Object.values(reviewData).every(el => el !== '' && el !== false)) {
        storageReviews.push(reviewData);
        localStorage.setItem(data.movie_id, JSON.stringify(storageReviews));

        reviewIndex = storageReviews.length;

        location.reload();
    }
    return reviewData;
}

// 2. 작성된 리뷰는 local storage에 저장된 값으로만 수정, 삭제 기능 구현

// 2-1. 1-3에서 저장된 reviewData를 html 리뷰 작성 칸에 출력
const registerReview = async (registerData) => {
    const reviewCreateDiv = `
        <div class="review">
            <p class="card-title">이름: ${registerData.reviewerName}</p>
            <p class="card-score">별점: ${registerData.reviewerStar}</p>
            <p class="card-text">리뷰 내용: ${registerData.reviewerContext}</p>

        <button class="registed-modify-button" data-modify-review-index="${registerData.reviewIndex}">수정 및 삭제</button>
        </div>
        `;

    document.getElementById("review_wrapper").insertAdjacentHTML('beforeend', reviewCreateDiv);
}

const getLocalStoragedDatas = async () => {
    const reviewerDatas = await reviewSave();
    return JSON.parse(localStorage.getItem(reviewerDatas.movieId)) || [];
}

const printReview = async () => {
    const storagedReviewers = await getLocalStoragedDatas();
    storagedReviewers.forEach(registerReview);
}

// 2-2. 작성된 리뷰에서 작성자의 이름과 비밀번호가 일치할 때만 수정 또는 삭제로 변경
const startReviewModifyButton = document.getElementsByClassName('registed-modify-button');

const firstModifyPop = document.getElementById('review-modify-pop-info-1');
const secondModifyPop = document.getElementById('review-modify-pop-info-2');
const thirdModifyPop = document.getElementById('review-modify-pop-info-3');

const toggleToFirstModify = document.getElementById('review-modify-go-first-pop');
const toggleToSecondModify = document.getElementById('review-modify-go-second-pop');

const toggleThirdModifyButton = document.getElementById('review-modify-checking-button');
const toggleThirdDeleteButton = document.getElementById('review-delete-checking-button');

const checkModifyName = document.getElementById('review-modify-name');
const checkModifyPW = document.getElementById('review-modify-pw');
const executeModifyScore = document.getElementById('review-modify-score');
const executeModifyContext = document.getElementById('review-modify-context');

// 2-2. localStorage에 저장된 reviewer 정보와 수정, 삭제 하려는 사용자의 정보 일치 유효성 검사
const contrastInputStoraged = async () => {
    const storagedReviewers = await getLocalStoragedDatas();

    let isContrast = false;

    for (const el of storagedReviewers) {
        if (currentReviewIndex === el.reviewIndex) {
            const isContrastName = el.reviewerName === checkModifyName.value;
            const isContrastPW = el.reviewerPassword === checkModifyPW.value;

            return isContrastName && isContrastPW ? isContrast = true : isContrast = false;
        }
    }
    return isContrast
}

const openModifyFirstPopUp = (event) => {
    event.stopPropagation();

    firstModifyPop.style.display = 'block';
    secondModifyPop.style.display = 'none';
    thirdModifyPop.style.display = 'none';
}

const openModifySecondPopUp = async (event) => {
    event.stopPropagation();

    if (!(await contrastInputStoraged())) {
        firstModifyPop.style.display = 'none';
        secondModifyPop.style.display = 'block';
        thirdModifyPop.style.display = 'none';

    } else {
        alert('입력된 사용자 정보의 일치 여부가 확인되었습니다.');

        firstModifyPop.style.display = 'none';
        secondModifyPop.style.display = 'none';
        thirdModifyPop.style.display = 'block';
    }
}

// 2-3. 수정 삭제
let currentReviewIndex = null;

const executeModify = async (event) => {
    event.stopPropagation();

    if (currentReviewIndex !== null) {
        const storagedReviewers = await getLocalStoragedDatas();
        const getStorageKey = await reviewSave();
        const modifyEqaulIndex = storagedReviewers.findIndex(el => el.reviewIndex === currentReviewIndex);

        if (modifyEqaulIndex !== -1) {
            if (executeModifyScore.value === 0 ||
                executeModifyContext.value === 0 ||
                executeModifyContext.value < 5) {
                alert('수정할 내용을 정확히 입력해주세요.');
            } else {
                confirm('수정 하시겠습니까?') ? alert('수정이 완료되었습니다.') : false;

                storagedReviewers[modifyEqaulIndex].reviewerStar = executeModifyScore.value;
                storagedReviewers[modifyEqaulIndex].reviewerContext = executeModifyContext.value;

                localStorage.setItem(getStorageKey.movieId, JSON.stringify(storagedReviewers));

                location.reload();
            }
        }
    }
}

const executeDelete = async (event) => {
    event.stopPropagation();

    if (currentReviewIndex !== null) {
        const storagedReviewers = await getLocalStoragedDatas();
        const getStorageKey = await reviewSave();
        const deleteEqaulIndex = storagedReviewers.findIndex(el => el.reviewIndex === currentReviewIndex);

        if (deleteEqaulIndex !== -1) {
            confirm('삭제 하시겠습니까?') ? alert('삭제가 완료되었습니다.') : false;

            storagedReviewers.splice(deleteEqaulIndex, 1);
            localStorage.setItem(getStorageKey.movieId, JSON.stringify(storagedReviewers));

            location.reload();
        }
    }
}

(async () => {
    await printReview();

    for (const value of startReviewModifyButton) {
        value.addEventListener('click', (event) => {
            currentReviewIndex = Number(event.target.dataset.modifyReviewIndex);
            openModifyFirstPopUp(event);
        })
    }
})();

toggleToSecondModify.addEventListener('click', openModifySecondPopUp);
toggleToFirstModify.addEventListener('click', openModifyFirstPopUp);

toggleThirdModifyButton.addEventListener('click', executeModify);
toggleThirdDeleteButton.addEventListener('click', executeDelete);

// 팝업 취소 관련
const cancelPopUpButton = document.getElementsByClassName('modal-cancel-button');

const closeRegisterPopUp = () => {
    firstRegisterPop.style.display = 'none';
    secondRegisterPop.style.display = 'none';
}

const closeModifyPopUp = () => {
    firstModifyPop.style.display = 'none';
    secondModifyPop.style.display = 'none';
    thirdModifyPop.style.display = 'none';
}

for (const value of cancelPopUpButton) {
    value.addEventListener('click', () => {
        closeRegisterPopUp();
        closeModifyPopUp();

        checkRegisterName.value = '';
        checkRegisterStar.value = '';
        checkRegisterContext.value = '';
        checkRegisterPW.value = '';

        checkModifyName.value = '';
        checkModifyPW.value = '';
        executeModifyScore.value = '';
        executeModifyContext.value = '';
    });
}
