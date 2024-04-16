// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

// There are multiple csv node libraries which would make this even easier
// (e.g., https://usecsv.com/community/top-javascript-csv-parsers); but unsure
// of QA Wolf (or client's) preference for external libraries, so I'm using fs
const fs = require("fs");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false }); // see comment below about browser close()
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // we will assume the first 10 articles are the top 10 articles
  // (used Chrome dev tools to find classnames and DOM layout for Hacker News)
  const articles = await page.$$(".athing");

  // assume headers desired; if not, change the following assignment to ""
  let content = "Title,URL\n";

  // name of the CSV file to be created; change if desired
  const outputFilename = "aCSVFile.csv";
  
  // parse the data we need
  // (used Chrome dev tools to find classnames and DOM layout for Hacker News)
  for (let i = 0; i < 10; i++) {
    const article = articles[i];
    const title = await article.$eval(".titleline a", each => each.innerText);
    const url = await article.$eval(".titleline a", each => each.href);
    
    // save each article's title and URL to CSV string
    content += `${title},${url}\n`;
  } 

  // assume we should close browser as we're told to simply create the CSV
  // however, the above code used headless: false, which implies otherwise.
  // If the browser SHOULD be closed, then we should use headless: true.
  await browser.close();

  // this will overwrite the file if it already exists
  // write gathered article data to a CSV file
  fs.writeFile(outputFilename, content, err  => {
    return err 
      ? console.error(err)
      : console.log(`CSV File "${outputFilename}" created.`)
    });
}

(async () => {
  await saveHackerNewsArticles();
})();
