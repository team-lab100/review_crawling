const { exec } = require('child_process');

const curlCommand = `curl 'https://brand.naver.com/n/v1/contents/reviews/query-pages' -H 'accept: application/json, text/plain, */*' -H 'accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' -H 'cache-control: no-cache' -H 'content-type: application/json' -H 'cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g=' -H 'origin: https://brand.naver.com' -H 'pragma: no-cache' -H 'priority: u=1, i' -H 'referer: https://brand.naver.com/onnuristore/products/9627336845' -H 'sec-ch-ua: "Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"' -H 'sec-ch-ua-mobile: ?0' -H 'sec-ch-ua-platform: "macOS"' -H 'sec-fetch-dest: empty' -H 'sec-fetch-mode: cors' -H 'sec-fetch-site: same-origin' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' -H 'x-client-version: 20240716122101' --data-raw '{"checkoutMerchantNo":511403278,"originProductNo":9581556402,"page":1,"pageSize":20,"reviewSearchSortType":"REVIEW_RANKING"}'`;
// const productNo = 10386843825
// const curlCommand = `curl 'https://brand.naver.com/onnuristore/products/${productNo}' -X GET -H 'Accept: application/json'  -H 'Content-Type: application/json' -H 'Cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g='`;
// const curlCommand = `curl 'https://brand.naver.com/onnuristore/products/10386843825' -X GET -H 'Accept: application/json'  -H 'Content-Type: application/json' -H 'Cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g='`;

let res = exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing curl: ${error}`);
    return;
  } else {
    // console.log(`Response: ${stdout}`);
    console.log(typeof stdout);
    const test = JSON.parse(stdout.replace('\n', ''))
    // console.log(test['page'])
    // console.log(test.contents)
    
    const data = JSON.stringify(stdout)
    // console.log(data)
    // res = JSON.parse(res.replace('\n', ''))
    console.log(`Response: ${stdout.contents}`);
    return test.contents
    // console.log(stderr)
    // return stdout
  }
});

console.log(res)
console.log("dataaaa :" + res)
// console.log(res.contents)

// res = JSON.parse(res.replace('\n', ''))





// curl `https://brand.naver.com/onnuristore/products/<productNo>' \
//   -X GET \
//   -H 'Accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -H 'Cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g='



// curl `https://brand.naver.com/onnuristore/products/${productNo}` -X GET -H 'Accept: application/json' \
// -H 'Content-Type: application/json' \
// -H 'Cookie: _fwb=709qj0FPbVJ5wy6tlY3HGW.1705024913798; NAC=Q9qTBMARa78S; NNB=YTJCYANJHRUGM; ASID=01d6a0ba0000019072ca6b5f00000054; NACT=1; page_uid=ipBNElqptbNssQdim0hsssssspK-235780; wcs_bt=s_c9a0395764e1:1721297340|s_249b24fea2a949a1:1718934313|s_13b6802d38fe4:1718933571; BUC=E_1rS2wBTcUuMRLAtWsdfHOLehcoB-VjGrCOpo90V4g='