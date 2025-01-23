const xlsxFile = require('read-excel-file/node')
const fetch = require('node-fetch')
const fs = require('fs')
const { exec } = require('child_process');
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

const changeToOriginProductNo = async (productNo) => {
    const curlCommand = `curl 'https://brand.naver.com/onnuristore/products/${productNo}' \
        -H 'accept: application/json, text/plain, */*' \
        -H 'accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' \
        -H 'cache-control: no-cache' \
        -H 'content-type: application/json' \
        -H 'cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g=' \
        --compressed`;

    // curl 명령어를 실행하고 응답을 받아오는 함수를 비동기로 호출
    const executeCurl = () => {
        return new Promise((resolve, reject) => {
            exec(curlCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing curl: ${error}`);
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    };

    try {
        // curl 명령어 실행 및 응답 받기
        const res = await executeCurl();

        // JSON 데이터에서 productNo 추출
        const originNo = res.match(/"productNo":"(\d+)"/);

        if (originNo) {
            console.log(`Origin Product No: ${originNo[1]}`);
            return originNo[1];
        } else {
            console.error('Origin Product No not found in response');
            return null;
        }
    } catch (err) {
        console.error(`Error during curl execution: ${err}`);
        return null;
    }
};

const getReviews = async (originProductNo) => {
    let page = 1
    let reviews = []

    while (true) {
        const curlCommand = `curl 'https://brand.naver.com/n/v1/contents/reviews/query-pages' -H 'accept: application/json, text/plain, */*' -H 'accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' -H 'cache-control: no-cache' -H 'content-type: application/json' -H 'cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g=' -H 'origin: https://brand.naver.com' -H 'pragma: no-cache' -H 'priority: u=1, i' -H 'referer: https://brand.naver.com/onnuristore/products/9627336845' -H 'sec-ch-ua: "Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"' -H 'sec-ch-ua-mobile: ?0' -H 'sec-ch-ua-platform: "macOS"' -H 'sec-fetch-dest: empty' -H 'sec-fetch-mode: cors' -H 'sec-fetch-site: same-origin' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' -H 'x-client-version: 20240716122101' --data-raw '{"checkoutMerchantNo":511403278,"originProductNo":${originProductNo},"page":${page},"pageSize":20,"reviewSearchSortType":"REVIEW_RANKING"}'`;

        // curl 명령어를 실행하고 응답을 받아오는 함수를 비동기로 호출
        const executeCurl = () => {
            return new Promise((resolve, reject) => {
                exec(curlCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing curl: ${error}`);
                        reject(error);
                    } else {
                        const response = JSON.parse(stdout.trim());
                        resolve(response);
                    }
                });
            });
        };

        const res = await executeCurl();

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
