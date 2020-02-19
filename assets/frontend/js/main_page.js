const filters = {
  query: "",
  ll: null, 
  location: "Turkey",
}
 

var nav = new Vue({
  el: ".navbar",

  methods:  {
    handleCurrentLocationSelection: selectCurrentLocation, 
    handleVenueKeyup: $.debounce(500, handleQuery),
    handleVenueQuery: handleQuery,
    locationFieldChange: handleLocationSelection,
    locationFieldFocus: event =>{
      const value = event.target.value.trim();
      if(value == "Geçersin konum" || value == "Güncel konum")
        event.target.value = "";
    }
  }
  
});



var app = new Vue({
  el: '#result-field',
  data: {
    items: []
  }
});
 




$(document).ready(function() {    
  
  /*
    Kullanıcının mevcut konumu talep ediliyor.
    Eğer tarayıcı geolocation özelliğini desteklemiyor ise ya da 
    kullanıcı konumunu belirtmeyi reddetti ise konum olarak türkiye
    belirlenecek
  */
  if (navigator.geolocation) { 
    navigator.geolocation.getCurrentPosition(success => {
      filters.location = null;
      filters.ll = success.coords.latitude + "," + success.coords.longitude;
      $("#location-field").val("Güncel konum");
    }, 
    error => {
      console.error(error);
    });
  } 
  requestVenueList();
});
   




//Mekan aramak için değer girildiğinde bu fonksiyon çağırılacak
function handleQuery(event) {
  const value = event.target.value.trim();
  /*
    Ok işaretleri tuşuna basıldığında veya sürekli boşluk tuşuna basıldığında vs
    tekrar tekrar istek oluşturmayı önlemek için bu koşulları ekledim
  */
  if(filters.query.length === 0 && value.length === 0 || filters.query == value) return;
  
  filters.query = value;
  requestVenueList();
}

 


//Mevcut lokasyonu seçmek için bu fonksiyon çağırılacak
function selectCurrentLocation() {
  if (navigator.geolocation) { 
    navigator.geolocation.getCurrentPosition(success => {
      filters.location = null;
      currentLL = success.coords.latitude + "," + success.coords.longitude;
      if(filters.ll == currentLL) return; 
      
      filters.ll = currentLL;
      $("#location-field").val("Güncel konum");
      requestVenueList();
    }, 
    error => {
      console.error(error);
    });
  }
}




//Kullanıcı konum seçtiğinde bu fonksiyon çağırılacak
function handleLocationSelection(event) {
  const dataList = document.body.querySelectorAll("#city-list option");

  const searchedLocation = event.target.value.trim().toLocaleLowerCase();
  for(let i =0; i < dataList.length; i++){
    const option = dataList[i];
    if(option.innerHTML.toLocaleLowerCase() === searchedLocation){
      this.value = option.innerHTML;
      filters.ll = option.dataset.value; 
      filters.location = null;
      requestVenueList();
      return;
    }
  }

  event.target.value = "Geçersiz konum";
}

 


//Filtre değerleri belirtildikten sonra fonksiyonlar veriyi çağırmak için bu fonksiyonu çağıracak
function requestVenueList() {    
  const endPoint = "https://api.foursquare.com/v2/venues/search?";
  const params = {
    client_id: "WGVX0MCKDWB4Y1LR3XTTDTTIXCCTOV5JNVZE1NSPBM43PUSS",
    client_secret: "OBP0JQOQ2UXRF1FSTAGVOHJ4H3NAWQGV22HBKUYQ0PM0YT4T",
    query: filters.query,
    v: "20200218"
  }  

  if(filters.ll)
    params.ll = filters.ll;
  else 
    params.near = filters.location;
  
  $.ajax({
    url: endPoint + new URLSearchParams(params),
    type: "get",
    success: data => { 
      console.log(data.response.venues);
      app.items = data.response.venues;
    },
    error:  (req, status, error) => {
      console.log("Hata", req, status, error);
    }
  });
}







/*
  Aslında arama sonucundan gelen mekan id bilgisi ile mekanları tek tek sorgulatıp,
  aldığım daha detaylı veriler ile listeyi daha kapsamlı yapmak istedim fakat 
  api istek limiti aşımı yüzünden hata verdi 

  app.items' a göndereceğim dizi ile foreach dönügüsü başlatıp her bir 
  mekan için aşağıdaki detay sorgusunu oluşturup gelen response' yi
  app.items'a atacak idim ve vue.js' de hazırladığım template ile 
  o mekanı sayfaya yazdıracak idi
*/
/*
function requestVenue(venueId){
  const endPoint = `https://api.foursquare.com/v2/venues/${venueId}?`;
  const params = {
    client_id: "WGVX0MCKDWB4Y1LR3XTTDTTIXCCTOV5JNVZE1NSPBM43PUSS",
    client_secret: "OBP0JQOQ2UXRF1FSTAGVOHJ4H3NAWQGV22HBKUYQ0PM0YT4T",  
    v: "20200218"
  }  
  $.ajax({
    url: endPoint + new URLSearchParams(params),
    type: "get",
    success: data => {
      app.items.push(data.response);
      console.log(data.response.venue);
    },
    error:  (req, status, error) => {
      console.log("Hata", req, status, error);
    }
  });
}

*/