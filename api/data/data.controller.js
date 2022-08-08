require("dotenv").config();
const axios = require("axios");

module.exports = {
  getData: (req, res, next) => {
    axios({
      method: "get",
      url: process.env.URL,
      headers: {
        Connection: "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        cookie:
          "ak_bmsc=86BBC566F6E3EA12E2532333B6EA6302~000000000000000000000000000000~YAAQrowsMdBQZWKCAQAAcXajexDOng8Or63I9wEgMGaVi4jgtKyYMmRIFtNlEId+Bq2GGO9DMFffHD8isMj5s7XK6mcNzDlAjynl3OBLW0qpztc2J8b6WQUfvN3QEIEI4wVJt+YxzcR/HWevT5vBl59sGsPJKK9ZRbdegCGj9JPo2tU6sqXRmU0k2eNJn5tvzeXFtKjlUmxr2lvkEIYgcSpsH+3o7OrjTLxG5P0rUJc3C6vWbM9hdoaQq3EbWiKXHt2Jk7BKQulWW/+PE8/vvlY1VcBQ8XnWYGZrvFH1HHdKsiPGgl/NjkHCsRYhrecrQPSxQfLziiTXvHcqcXBwbuWOvebarF2lP+pOf2LHcBxe3FqziRhsUwVghxBMFMB6Vk0858sF+DWVA/U=; Domain=.nseindia.com; Path=/; Expires=Fri, 08 Aug 2025 06:08:06 GMT; Max-Age=7200; HttpOnly",
      },
    })
      .then((result) => {
        let cookie = result.headers["set-cookie"];
        return axios({
          method: "get",
          url: process.env.OPTION_URL,
          headers: {
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            cookie: cookie,
          },
        });
      })
      .then((result) => {
        let dataDecords = result.data;
        if (!dataDecords) {
          res.status(401).send({
            success: 0,
            data: result,
            message: "No data found!",
          });
        }
        let selectedDate =
          req.query.date &&
          dataDecords.records.expiryDates.includes(req.query.date)
            ? req.query.date
            : dataDecords.records.expiryDates[0];

        let filterData = dataDecords.records.data.filter(
          (a) => a.expiryDate == selectedDate
        );
        let excelData = [];
        filterData.forEach((element) => {
          let prepareElement = {
            Strike_Price: element.strikePrice,
            Expiry_Date: element.expiryDate,
            CALL_OI: element.CE ? element.CE.openInterest : 0,
            CALL_VOL: element.CE ? element.CE.totalTradedVolume : 0,
            CALL_IV: element.CE ? element.CE.impliedVolatility : 0,
            CALL_LTP: element.CE ? element.CE.lastPrice : 0,
            PUT_OI: element.PE ? element.PE.openInterest : 0,
            PUT_VOL: element.PE ? element.PE.totalTradedVolume : 0,
            PUT_IV: element.PE ? element.PE.impliedVolatility : 0,
            PUT_LTP: element.PE ? element.PE.lastPrice : 0,
          };
          excelData.push(prepareElement);
        });
        let order = req.query.order;
        if (order && "undefined" != order) {
          excelData.sort(GetSortOrder(order));
        }
        res.status(200).send({
          success: 1,
          data: excelData,
          expiryDates: dataDecords.records.expiryDates,
          selectedDate,
          message: "Fetched data successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          success: 0,
          data: err,
          message: "Failed to fetch data.",
        });
      });
  },
};

function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
}
