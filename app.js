const express = require("express");
var GoogleSpreadsheet = require("google-spreadsheet");
var async = require("async");
var async = require("async");

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet("1gMI24MugVmsLCgMpKawR_S-Z1rYdQc_TKWrRWlqw0Es");
var sheet;

var app = express();

const NODE_PORT = process.env.PORT;

var qsheetsByDifficulty = {
  easy: [],
  medium: [],
  hardcore: []
};

var mcq = {
  question: "",
  answers: [],
  correctAnswer: 0
};

async.series(
  [
    function setAuth(step) {
      // see notes below for authentication instructions!
      var creds = require("./rpa-mcqs-edb05515bbdc.json");
      // OR, if you cannot save the file locally (like on heroku)
      /*
      var creds_json = {
        client_email: "yourserviceaccountemailhere@google.com",
        private_key: "your long private key stuff here"
      };*/

      doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        console.log("Loaded doc: " + info.title + " by " + info.author.email);
        info.worksheets.length;

        info.worksheets.forEach((element, index) => {
          console.log(
            `sheet ${index}: ` +
              element.title +
              " " +
              element.rowCount +
              "x" +
              element.colCount
          );
        });

        step();
      });
    },
    function workingWithRows(step) {
      // google provides some query options
      //   sheet.getRows(
      //     {
      //       offset: 1,
      //       limit: 1000
      //     },
      //     function(err, rows) {
      //       console.log("Read " + rows.length + " rows");

      //       step();
      //     }
      //   );
      step();
    },
    function workingWithCells(step) {
      //   sheet.getCells(
      //     {
      //       "min-row": 1,
      //       "max-row": 5,
      //       "return-empty": true
      //     },
      //     function(err, cells) {
      //       var cell = cells[0];
      //       console.log(
      //         "Cell R" + cell.row + "C" + cell.col + " = " + cell.value
      //       );

      //       step();
      //     }
      //   );
      step();
    }
  ],
  function(err) {
    if (err) {
      console.log("Error: " + err);
    }
  }
);

app.get("/questions", (req, res) => {
  console.log("Get questions from google sheet");

  res.json({});
});

app.use(express.static(__dirname + "/rpa-mcq-web/dist/rpa-mcq-web"));

app.listen(NODE_PORT, function() {
  console.info("App server started on port " + NODE_PORT);
});
