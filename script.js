getData();

async function getData() {
  let result = await fetch(
    "https://it-studerende.dk/bikes/wp-json/wp/v2/bike?_embed&order=asc"
  );
  showBikes(await result.json());
}

function showBikes(bikes) {
  const catArr = [];
  //   console.log(bikes);
  bikes.forEach((bike) => {
    const template = document.querySelector("template").content;

    const copy = template.cloneNode(true);
    const catName = bike._embedded["wp:term"][0][0].name;
    catArr.push(catName);
    // console.log(bike._embedded["wp:term"][0][0].name);

    copy.querySelector("h3").textContent = catName;
    copy.querySelector("h2").textContent = bike.title.rendered;

    /* console.log(
      bike._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large
        .source_url
    ); */
    copy
      .querySelector("img")
      .setAttribute(
        "src",
        bike._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large
          .source_url
      );

    let bikePricetext = "$" + bike.price;
    if (bike.min_price) {
      bikePricetext = "$" + bike.min_price + " - " + bikePricetext;
    }

    copy.querySelector(".price").textContent = bikePricetext;

    var colours = bike._embedded["wp:term"][1];
    // console.log(colours);
    const ulEl = copy.querySelector(".colours");
    if (colours.length) {
      copy.querySelector(".p-colours span").remove();
      colours.forEach((color) => {
        const li = document.createElement("li");
        li.style.backgroundColor = "#" + color.name;
        ulEl.appendChild(li);

        console.log(color.name);
      });
    }
    //document.querySelector(".colours").textContent = bike.price;

    let stockText = bike.in_stock;

    if (bike.in_stock == 0) {
      stockText = "No";
    } else if (bike.in_stock == 999) {
      stockText = "Yes";
    }

    copy.querySelector(".instock").textContent = stockText;
    const mainEl = document.querySelector("main");
    mainEl.appendChild(copy);
  }); //end forEach

  const cleanCatArr = [...new Set(catArr)];
  //   console.log(catArr);
  //   console.log(cleanCatArr);
  cleanCatArr.forEach((cat) => {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    aEl.setAttribute("href", "#");
    aEl.textContent = cat;
    liEl.appendChild(aEl);
    document.querySelector("nav ul").appendChild(liEl);
  });
}
