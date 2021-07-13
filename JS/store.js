var cartIndex = 0;

$(function() {
  var browser = supportedBrowser();
  checkCompatability();
  if(!browser.status) {
    $("<h2></h2>").text(browser.name + " is not currently supported, please use Chrome or Firefox")
      .css({
        "text-align": "center",
	"font-size": "65px",
        "color": "#f4d442",
        "text-shadow": "-1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000",
	"padding": "25px",
	"background": "#bbb",
        "border": "2px solid #999"
      })
      .appendTo("#showItems");
  } else {
    createTable("Apparel", items.clothing);
    document.getElementById("showItems").appendChild(document.createElement("BR"));
    createTable("Miscellaneous", items.misc);
    document.getElementById("showItems").appendChild(document.createElement("BR"));
    $("#showItems").hide(0).delay(100).slideDown(500);
  }
});

function checkCompatability() {
  if(!String.prototype.repeat) {
    String.prototype.repeat = function(times) {
     return (new Array(times + 1)).join(this);
    };
  }

}

function createTable(title, data) {
  var tbl = document.createElement("table");
  tbl.setAttribute("class", "merch");
  document.getElementById("showItems").appendChild(tbl);
  var cap = document.createElement("caption");
  cap.innerHTML = title;
  tbl.appendChild(cap);
  tbl.appendChild(document.createElement("th"));
  var tr = document.createElement("tr");
  tbl.appendChild(tr);
  var th = document.createElement("th");
  th.setAttribute("width", "26%");
  tr.appendChild(th);
  th = document.createElement("th");
  th.setAttribute("width", "17%px");
  th.innerHTML = "Name";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Size";
  th.setAttribute("width", "17%");
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Price";
  th.setAttribute("width", "17%");
  tr.appendChild(th);
  tr.appendChild(document.createElement("th"));

  for(var i = 0; i < data.length; i++) {
    tr = document.createElement("tr");
    tbl.appendChild(tr);
    var td = document.createElement("td");
    var img = document.createElement("img");
    img.setAttribute("src", data[i].square_imgSrc);
    img.setAttribute("data-full-img-src", data[i].full_imgSrc);
    img.setAttribute("alt", data[i].name);
    img.setAttribute("title", "Click To Zoom");
    img.setAttribute("data-description", data[i].description);
    img.setAttribute("class", "cb");

    imgdiv = document.createElement("div");
    imgdiv.setAttribute("class", "img-div");
    imgdiv.appendChild(img);
    td.appendChild(imgdiv)
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = data[i].name;
    td.setAttribute("class", "cb");
    td.setAttribute("data-full-img-src", data[i].full_imgSrc);
    td.setAttribute("alt", data[i].name);
    td.setAttribute("title", "Click To Zoom");
    td.setAttribute("data-description", data[i].description);
    td.setAttribute("id", i+"Name"+title[0]);
    tr.appendChild(td);

    td = document.createElement("td");
    var sel = document.createElement("select");
    for(var j = 0; j < data[i].sizes.length; j++){
      var op = document.createElement("option");
      op.innerHTML = data[i].sizes[j];
      op.setAttribute("value", decimalPlaces(String(data[i].prices[j]), 2)+"|"+data[i].sizes[j]);
      sel.appendChild(op);
    }
    sel.setAttribute("id", i+"Sizes"+title[0]);
    sel.setAttribute("class", "size");
    /*sel.setAttribute("id", data[i].name+"Sizes"); */
    sel.setAttribute("onchange", "showPrice.call(this, event)");
    td.appendChild(sel);
    tr.appendChild(td);

    td = document.createElement("td");
    sp = document.createElement("span");
    sp.innerHTML = '$';
    td.appendChild(sp);
    sp = document.createElement("span");
    sp.setAttribute("id", i+"Price"+title[0]);
    /*sp.setAttribute("id", data[i].name+"Price");*/
    sp.innerHTML = decimalPlaces(String(data[i].prices[0]), 2);/*data[i].prices[0];*/
    td.appendChild(sp);
    tr.appendChild(td);

    td = document.createElement("td");
    btn = document.createElement("button");
    btn.innerHTML = "Add To Cart";
    btn.setAttribute("id", i+"Btn"+title[0]);
    /*btn.setAttribute("id", data[i].name+"Btn");*/
    btn.setAttribute("data-title", title);
    btn.setAttribute("onclick", "addToCart.call(this, event)");
    td.appendChild(btn);
    tr.appendChild(td);
  }

  $(".cb").each(function(){
    $(this).colorbox({
      href: $(this).attr("data-full-img-src"),
      transition: "elastic",
      title: $(this).attr("alt") + " | " + $(this).attr("data-description"),
      maxWidth: "50%",
      maxHeight: "100%",
      width: "auto",
      height: "auto",
      opacity: 0.5
    });
  });
}

function showPrice(e) {
  var spID = this.id.slice(0, -6)+"Price"+this.id.slice(this.id.length-1);
  var sp = document.getElementById(spID);

  old_price = $("#"+spID).text();

  sp.innerHTML = this.value.substr(0, this.value.indexOf("|"));

  updateTotals();

  new_price = $("#"+spID).text();
  
  if(old_price != new_price) {
    $p = $("#"+spID).parent();
    $p.css({"transition":"background-color 0.5s","background-color":"#f4d442"});
    setTimeout(function(){$p.css({"background-color":"#f4f4f4"});}, 250);
  }
}

function addToCart(e) {
  suffix = $(this).attr("data-title")[0];
  /*console.log(document.getElementById(this.id.slice(0, -4)+"Name"+suffix));*/
  var name = document.getElementById(this.id.slice(0, -4)+"Name"+suffix).innerHTML;
  var s = document.getElementById(this.id.slice(0, -4)+"Sizes"+suffix);
  var size = s.value.substr(s.value.indexOf("|")+1, s.value.length);
  var price = document.getElementById(this.id.slice(0, -4)+"Price"+suffix).innerHTML;

  var cart = document.getElementById("cartItems");
  var tr = document.createElement("tr");
  tr.setAttribute("class", "item"+cartIndex);
  cart.appendChild(tr);

  var td = document.createElement("td");
  td.setAttribute("class", "item"+cartIndex);
  td.innerHTML = name;
  tr.appendChild(td);

  td = document.createElement("td");
  td.setAttribute("class", "item"+cartIndex);
  td.innerHTML = size;
  tr.appendChild(td);

  td = document.createElement("td");
  td.setAttribute("class", "item"+cartIndex);

  var sel = document.createElement("select");
  for(var i = 1; i < 11; i++) {
    var op = document.createElement("option");
    op.value = i;
    op.innerHTML = i;
    sel.appendChild(op);
  }
  sel.setAttribute("onchange", "changePrice.call(this, event)");
  sel.setAttribute("class", "item"+cartIndex);
  td.appendChild(sel);
  tr.appendChild(td);

  td = document.createElement("td");
  td.setAttribute("class", "item"+cartIndex);
  td.setAttribute("id", "item"+cartIndex+"Price");
  td.setAttribute("data-price", price);
  td.innerHTML = "$"+price;
  tr.appendChild(td);

  td = document.createElement("td");
  td.setAttribute("class", "item"+cartIndex);

  var btn = document.createElement("button");
  btn.setAttribute("class", "item"+cartIndex);
  btn.setAttribute("onclick", "removeFromCart.call(this, event)");
  btn.innerHTML = "remove";
  td.appendChild(btn);
  tr.appendChild(td);

  // Hidden input so data can be retrieved from the php mail script
  var form = document.getElementById("checkoutForm");

  var hInputName = document.createElement("INPUT");
  $(hInputName)
    .addClass("item"+cartIndex)
    .attr("name", "name"+cartIndex )
    .attr("type", "hidden")
    .attr("value", name);
  $(form).append(hInputName);

  var hInputSize = document.createElement("INPUT");
  $(hInputSize)
    .addClass("item"+cartIndex)
    .attr("name", "size"+cartIndex)
    .attr("type", "hidden")
    .attr("value", size);
  $(form).append(hInputSize);
  
  var hInputPrice = document.createElement("INPUT");
  $(hInputPrice)
    .attr("id", "item"+cartIndex+"PriceH")
    .addClass("item"+cartIndex)
    .attr("name", "price"+cartIndex)
    .attr("type", "hidden")
    .val(price);
  $(form).append(hInputPrice);
  
  var hInputQuantity = document.createElement("INPUT");
  $(hInputQuantity)
    .addClass("item"+cartIndex)
    .attr("id", "item"+cartIndex+"QuantityH")
    .attr("name", "quantity"+cartIndex)
    .attr("type", "hidden")
    .val(1);
  $(form).append(hInputQuantity);

  // End of hidden input
  cartIndex++;
  updateTotals();
}

function changePrice(e) {
  var $p = $("#"+this.className+"Price");
  var price = decimalPlaces("$"+parseFloat(($p).attr("data-price"))*parseFloat(this.value), 2);
  $p.html(price);
  
  // qty = parseFloat(this.value)
  //Hidden input so data can be retrieved from the php mail script
  
  $("#"+this.className+"QuantityH").val(this.value);
  $("#"+this.className+"PriceH").val(price.substr(1, price.length));

  //End of hidden input

  updateTotals();
}

function removeFromCart(e) {
  var row = document.getElementsByClassName(this.className);
  for(var i = 0; i < row.length; i++) {
    row.remove();
  }
  updateTotals();
}

function updateTotals() {
  var totalPrice = 0.0;
  var totalItems = 0;
  for(var i = 0; i < cartIndex; i++) {
    var row = document.getElementsByClassName("item"+i);
    for(var j = 0; j < row.length; j++) {
      if(row[j].innerHTML.substr(0, 1) == "$") {
        totalPrice += parseFloat(row[j].innerHTML.substr(1, row[j].innerHTML.length));
      } else if(row[j].value && !$(row[j]).is("INPUT")) {
        totalItems += parseInt(row[j].value);
      }
    }
  }

  if($("#checkoutForm").css("display") == "block") {
    if(totalItems <= 0) {
      $("#checkoutForm").slideUp(100);
      $("#floatingCart").fadeOut(100);
    }
  } else if($("#checkoutForm").css("display") == "none"){
    if(totalItems > 0) {
      $("#checkoutForm").slideDown(100);
      $("#floatingCart").fadeIn(100);
    }
  }

  totalPrice = "$"+decimalPlaces(String(totalPrice), 2);
  $("#totalPrice").text("Total Price: "+totalPrice);
  $("#totalItems").text("Total Items: "+totalItems);
  $("#floatingPrice").text(totalPrice);
}

function decimalPlaces(s, places) {
    var decIndex = s.indexOf(".")+1;
    if(decIndex <= 0) {
      /*return "0.00";*/
      s+=".";
      decIndex = s.indexOf(".")+1;
    }
    s = s.length > decIndex+places ? s.substr(0, decIndex+places) : s;
    s = s.length < decIndex+places ? s+="0".repeat(decIndex+places-s.length) : s;
    return s;
}

function inputFocus(e) {
  if(e.value==e.defaultValue) {
    e.value = "";
    e.style.color = "#000";
  }
}

function inputBlur(e) {
  if(e.value=="") {
    e.value = e.defaultValue;
    e.style.color = "#888";
  }
}

function checkRequiredFields() {
  checkout = true;
  if($("#name").val() == $("#name").prop("defaultValue")) {
    $("#name").val("");
    checkout = false;
  }

  if($("#department").val() == $("#department").prop("defaultValue")) {
    $("#department").val("");
    checkout = false;
  }
  
  if($("#email").val() == $("#email").prop("defaultValue")) {
    $("#email").val("");
    checkout = false;
  }
  return checkout;
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

function supportedBrowser() {
  console.log((!!window.StyleMedia));
  //Chrome
  if(!!window.chrome && !!window.chrome && !!window.chrome.webstore) {
    return {"status": true, "name": "Chrome"};
  }
  //Opera
  if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
    return {"status": false, "name": "Opera"};
  }
  //Firefox
  if(typeof InstallTrigger !== 'undefined') {
    return {"status": true, "name": "Firefox"};
  }
  //Edge
  if(!!window.StyleMedia) {
    return {"status": true, "name": "Edge"};
  }
  //IE
  if(/*cc_on!@*/false || !!document.documentMode) {
    return {"status": true, "name": "Internet Explorer"};
  }
  //Safari
  if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) {
    return {"status": true, "name": "Safari"};
  }
  //Anything else
  return {"status": false, "name": "This browser"};
}