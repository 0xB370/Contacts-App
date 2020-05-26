function loginApp(){
    var data = {};
    data.email = document.getElementById("email").value;
    data.password = document.getElementById("password").value;
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      cache: false,
      contentType: 'application/json',
      datatype: "json",
      url: '/sessionLogin',
      success: function(data){
          if (data['fail']) 
              alert(data['mensaje']);
          else
              window.location.assign("/");
      }
    });
}


function signUpApp(){
    var data = {};
    data.email = document.getElementById("email").value;
    data.password = document.getElementById("password").value;
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      cache: false,
      contentType: 'application/json',
      datatype: "json",
      url: '/new-user',
      success: function(data){
          if (data['fail']) 
              alert(data['mensaje']);
          else
              window.location.assign("/");
      }
    });
}