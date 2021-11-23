$(".date").append(moment().format('MMM Do YYYY'));
//
// Global Variables
//

const newsPageSize = 5;
var searchBox = document.querySelector("#tickerInput");
var searchButton = document.querySelector("#searchButton");

//
// Functions
//

function searchIsClicked(event) {
    event.preventDefault();
    console.log("searchIsClicked is running");

    //Add search value to history

    // Get value from input box
    // if input box is empty, show a modal "please type a ticker in the search box"
    console.log(searchBox.value);
    var textSearched = searchBox.value;
    if (textSearched === "") {
        alert("please type a ticker in the search box"); // change this to a modal
        return;
    }

    //call getTicker with value from searchBox
    getTicker(textSearched);
    searchBox.value = "tsla"; // change this to an empty string, tsla is for testing twice in a row


}

//Note the history buttons will call getTicker directly
function getTicker(myCriteria) {

    console.log("getTicker is running");

    //fetch from api
    //call getNews with Ticker as criteria
    //call tickerIsDone

    //Build URL based on criteria"
    //var callMe = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + myCriteria + "&interval=5min&apikey=FA3A9S4N1YYF4EFK"; //For yesterday's intraday time series data
    //var callMe = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + myCriteria + "&apikey=FA3A9S4N1YYF4EFK" //For daily time series data starting yesterday
    var callMe = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + myCriteria + "&apikey=FA3A9S4N1YYF4EFK" //For quote endpoint data

    console.log("fetch will call: " + callMe);

    //Call API
    fetch(callMe, {
        method: "GET",
        })
        .then(function(response) {

            response.json()

        .then(function(data) {   
            console.log(data);
            
            let quote = data["Global Quote"];
        
            //Push returned data into simplified return object
            let tickerDataObject = {
                ticker: quote["01. symbol"],
                recentPrice: quote["05. price"],
                previousClose: quote["08. previous close"],
                dailyChange: quote["09. change"],
                dailyChangePercent: quote["10. change percent"],
                // last5Days: [],
                // last1Month: [],
                // last6Months: [],
                // last1Year: [],
                // yearHigh: "",
                // yearLow: "",
            }
            console.log("TICKER DATA OBJECT",tickerDataObject);

            //Call downstream function to build out market data cards and fill in data, and downstream function for news search, getNews()
            tickerIsDone(tickerDataObject);
            getNews(myCriteria);
            saveLocalStorage(tickerDataObject)
            }       
                    
        
        )        
        .catch(error => {
            console.log("Error", error);
        })

    });

    

}

let tickerHistory = [];

function saveLocalStorage(tickerData){
    console.log("TICKER DATA IN SAVE LOCAL STORAGE", tickerData)
    if(tickerData.ticker === "undefined" || tickerData.ticker === null || !tickerData.ticker){
        return;
    } else {
        tickerHistory.push(tickerData)
        console.log("tickerHistory", tickerHistory)
    }
    
    localStorage.setItem("savedTickerData", JSON.stringify(tickerHistory))
}

// We can change the onclick event to a drop down or however else we want to render
const tickerHistoryBtn = document.getElementById("tickerHistoryBtn")
tickerHistoryBtn.addEventListener("click", function(){

    let savedTickers = JSON.parse(localStorage.getItem("savedTickerData")) || [];
    console.log("saved tickers", savedTickers)

    const tickerHistoryDiv = document.getElementById("showTickerHistory")
    tickerHistoryDiv.innerHTML = "";


    for(let i = 0; i < savedTickers.length; i++){
        var historyCard = document.createElement("div")
        historyCard.classList = "row stock-card-container";
   
        console.log(savedTickers[i].ticker)
        historyCard.innerHTML = `
        <div class="col s12 m6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">${savedTickers[i].ticker}</span>
              <p>Price: ${savedTickers[i].recentPrice}</p>
              <p>Prior Closing Price: ${savedTickers[i].previousClose}</p>
              <p>Daily Change: ${savedTickers[i].dailyChange}</p>
              <p>Daily Change %: ${savedTickers[i].dailyChangePercent}</p>
            </div>
            <div class="card-action">
            </div>
          </div>
        </div>
        
        `
    tickerHistoryDiv.append(historyCard)
    }

})
  



function tickerIsDone(tickerData){

    console.log("tickerIsDone is running");
    console.log(tickerData);
    
    //build dynamic html for ticker prices
        //Header Elements

        //create card element, add inner html for more elements, append the element
    var stockCard = document.createElement("div")
    stockCard.classList = "row stock-card-container";
    stockCard.innerHTML = `
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">${tickerData.ticker}</span>
          <p>Price: ${tickerData.recentPrice}</p>
          <p>Prior Closing Price: ${tickerData.previousClose}</p>
          <p>Daily Change: ${tickerData.dailyChange}</p>
          <p>Daily Change %: ${tickerData.dailyChangePercent}</p>
        </div>
        <div class="card-action">
        </div>
      </div>
    </div>
    
    `

    const tickerName = document.getElementById("tickerName");
    tickerName.textContent = tickerData.ticker;

    const price = document.getElementById("price");
    price.textContent = tickerData.recentPrice;
    
    // Get the properties from the tickerData object so the values can be added to page
     
    
        
    var cardHolder = document.querySelector("#cardHolder");

    cardHolder.appendChild(stockCard);

        //Card Elements

}

function getNews(myCriteria) {

    console.log("getNews is running");

    var returnMe = [];

    // If you pass testData to the function, it will return a static news object for testing
    // example call to get test data: getNews('testData')
    if (myCriteria === "testData") {

        //build the static stories

        var storyOne = {headLine:"Story One", 
        imageLink:"https://content.fortune.com/wp-content/uploads/2017/08/wall-street-jobs1.jpg", 
        story:"The blue fox jumped over the spoon.  The sun rose in the west and people ate dinner first.  Please return all code to where you found it.",
        storyURL:"https://www.msn.com/en-us/money/markets/wall-street-bonuses-will-jump-up-to-35-25-this-year-e2-80-94-the-most-since-the-great-recession/ar-AAQMwv2?ocid=BingNewsSearch"
        };
        var storyTwo = {headLine:"Story Two", 
        imageLink:"https://cdn.thecoolist.com/wp-content/uploads/2017/04/Cash-how-to-save-money.jpg", 
        story:"Somebody has been watching you.  They put cookies on your computer.  Would you like to see an add for something else?  Why can't we be friends.",
        storyURL:"https://abcnews.go.com/Business/wireStory/asian-stocks-rise-biden-xi-hold-video-summit-81196816"
        };
        var storyThree = {headLine:"Story Three", 
        imageLink:"https://www.playpennsylvania.com/wp-content/uploads/2019/10/Christie-PA-sports-betting-dumpster-fire.jpg", 
        story:"Late last night a student at a local programming bootcamp should have stopped while ahead.  Instead they tried to code one more feature and this happened.",
        storyURL:"https://www.msn.com/en-us/money/markets/stocks-in-japan-set-to-rise-as-stronger-than-expected-us-retail-sales-boost-wall-street/ar-AAQMQNi?ocid=BingNewsSearch"
        };

        //add them to the returnMe array

        returnMe.push(storyOne);
        returnMe.push(storyTwo);
        returnMe.push(storyThree);

        //return returnMe

        newsIsDone(returnMe);

    } else { //The API call and returning of data

        
        //Build URL based on criteria and global constant page size
        var callMe = "https://api.newscatcherapi.com/v2/search?q=" + myCriteria + "&page_size=" + newsPageSize;

        console.log("fetch will call: " + callMe);
        // method gets key                               
        fetch(callMe, {
            method: "GET", 
            headers: {"x-api-key" : "AdKiiLU0drgQWDBh7y1deZRLTm7UMHm_i2vy-lLB-zI"
            }})
            .then(function(response) {

                response.json()

            .then(function(data) {            
            
                //Push returned data into simplified return object
                for (let i = 0; i < data.articles.length; i++) {
                    
                    const element = data.articles[i];

                    returnMe.push( {headLine: element.title, 
                    imageLink: element.media, 
                    story: element.summary,
                    storyURL:element.link
                    });
                    
                }               
            
            })        
            .catch(error => {
                console.log("Error", error);
            })

        });

        //Call downstream function to build out news cards
        newsIsDone(returnMe);
            

    };

};

//This is called when getNews is complete
//Build Cards Here
function newsIsDone(newsData){

    console.log("newsIsDone is running");
    console.log(newsData);

};



//
// Listeners
//


searchButton.addEventListener("click", searchIsClicked);
