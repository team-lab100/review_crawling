const xlsxFile = require('read-excel-file/node')
const fetch = require('node-fetch')
const fs = require('fs')
const readXlsxFile = async () => { //TODO: 1
    return await xlsxFile("스마트스토어 상품코드.xlsx").then((rows) => {
        return rows

    })

}

function jsonToCSV(json_data) {

    // 1-1. json 데이터 취득
    const json_array = json_data;
    // 1-2. json데이터를 문자열(string)로 넣은 경우, JSON 배열 객체로 만들기 위해 아래 코드 사용
    // const json_array = JSON.parse(json_data);


    // 2. CSV 문자열 변수 선언: json을 csv로 변환한 문자열이 담길 변수
    let csv_string = '';


    // 3. 제목 추출: json_array의 첫번째 요소(객체)에서 제목(머릿글)으로 사용할 키값을 추출
    const titles = Object.keys(json_array[0]);


    // 4. CSV문자열에 제목 삽입: 각 제목은 컴마로 구분, 마지막 제목은 줄바꿈 추가
    titles.forEach((title, index)=>{
        csv_string += (index !== titles.length-1 ? `"${title}",` : `${title}\r\n`);
    });


    // 5. 내용 추출: json_array의 모든 요소를 순회하며 '내용' 추출
    json_array.forEach((content, index)=>{

        let row = ''; // 각 인덱스에 해당하는 '내용'을 담을 행

        for(let title in content){ // for in 문은 객체의 키값만 추출하여 순회함.
            // 행에 '내용' 할당: 각 내용 앞에 컴마를 삽입하여 구분, 첫번째 내용은 앞에 컴마X
            row += (row === '' ? `"${content[title]}"` : `,"${content[title]}"`);
        }

        // CSV 문자열에 '내용' 행 삽입: 뒤에 줄바꿈(\r\n) 추가, 마지막 행은 줄바꿈X
        csv_string += (index !== json_array.length-1 ? `${row}\r\n`: `${row}`);
    })

    // 6. CSV 문자열 반환: 최종 결과물(string)
    return csv_string;
}

const changeToOriginProductNo = async (productNo) => { //TODO: 2
    const res = await fetch('https://brand.naver.com/onnuristore/products/'+productNo, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie' : 'NNB=FL3UCVU47ORGG'
        },

    })
        .then(response => {
            return response.text()
        })
    let originNo = res.match(/"productNo":"(\d+)"/)

    console.log('originProduct No : '+ originNo)

    return originNo[1]
}

const getReviews = async (originProductNo) => {
    let page = 1
    let reviews = []

    while (true) {
        let res = await fetch('https://brand.naver.com/n/v1/contents/reviews/query-pages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie' : 'NNB=TXKJRPJKEF7WK'
            },
            body: JSON.stringify({ //TODO: 3
//                 "merchantNo" : 511403278, //온누리스토어
//                 "merchantNo" : 511123589, //환경운동가
                "checkoutMerchantNo" : 511403278,
                "originProductNo" : originProductNo,
                "page" : page,
                "pageSize" : 20,
                "sortType" : "REVIEW_RANKING"
            })
        })
            .then(response => {
                return response.text()
            })
        if(res === 'OK') {

            break
        }
        if(!res) return
        res = JSON.parse(res.replace('\n', ''))

        let review = res['contents']

        let last = JSON.stringify(res['last'])
        sleep(3000)
        if (last === 'false') {
            page++
            console.log(page + last)
            reviews = reviews.concat(review)
        } else {
            console.log(page + last)
            reviews = reviews.concat(review)

            break
        }

    }

    return reviews
}

const reviewCrawl = async () => {

    let resultList = []

    const urlList = await readXlsxFile()

    for(let n in urlList) {
        sleep(2000)
        let productNo = urlList[n][0]
        let originProductNo = await changeToOriginProductNo(productNo)
        let reviewList = await getReviews(originProductNo)
        if(!reviewList) return
        resultList.concat(reviewList)
        for(let i in reviewList) {
            // resultList.push(reviewList[i])

            let reviewAttaches = reviewList[i]['reviewAttaches']
            let reviewAttachesConcat = ''

            for(let j = 0; j < reviewAttaches.length; j++) {
                if(j === reviewAttaches.length -1) {
                    reviewAttachesConcat = reviewAttachesConcat + `&${reviewAttaches[j]['attachPath']}&`
                    // reviewAttachesConcat = reviewAttachesConcat + reviewAttaches[j]['attachPath']
                } else {
                    reviewAttachesConcat = reviewAttachesConcat + `&${reviewAttaches[j]['attachPath']}&` + ','
                    // reviewAttachesConcat = reviewAttachesConcat + reviewAttaches[j]['attachPath'] + ','
                }
            }

            resultList.push({
                'id': reviewList[i]['id'],
                'knowledgeShoppingMallProductId' : reviewList[i]['knowledgeShoppingMallProductId'],
                'originProductNo' : reviewList[i]['originProductNo'],
                'productName' : reviewList[i]['productName'],
                'productOptionContent' : reviewList[i]['productOptionContent'],
                'reviewContent' :  reviewList[i]['reviewContent'],
                'reviewScore' : reviewList[i]['reviewScore'],
                'writerId' : reviewList[i]['writerId'],
                'createDate' : reviewList[i]['createDate'],
                'reviewUrls' : reviewAttachesConcat,
                'onnsProductItemNo' : urlList[n][1],
                'parseImg' : ''
            })
            reviewAttachesToArray = ''
        }

    }


    const csv_string = jsonToCSV(resultList)

    let data = {}
    data.reviews = []
    for(let i in resultList) {
        data.reviews.push(resultList[i])
    }
    fs.writeFileSync('230908-500150359.csv', csv_string)
};

function sleep(ms) {
    return new Promise((resolve => {setTimeout(resolve, ms)}))
}

// changeToOriginProductNo().then(r => console.log('end'));
// changeToOriginProductNo().then(r => console.log('end'));


reviewCrawl().then(r => console.log('end'));
