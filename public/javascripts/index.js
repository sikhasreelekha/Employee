var main = function() {
  $('.notification img').click(function() {
    $('.notification-menu').toggle(); 
  }); 
  
  $('.post .btn').click(function() {
    $(this).toggleClass('btn-like'); 
  }); 
}; 
$(document).ready(main); 

$(document).ready(function(){
	$('.delete').click(function(){
       var id = $(this).val();
       $.post('/remove',{id:id}, function(data){
       	 location.reload('/home');
       })
	})
})

function PrintContent() {
    var DocumentContainer = document.getElementById('print-box');
    var WindowObject = window.open('', 'PrintWindow', 'width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
    var strHtml = "<html>\n<head>\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"stylesheets/index.css\">\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css\">\n<table>\n</table>\n</head><body>\n<table></table>\n"
    + DocumentContainer.innerHTML + "\n</div>\n</body>\n</html>";
     WindowObject.document.writeln(strHtml);
    // WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
}