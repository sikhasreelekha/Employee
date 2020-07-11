$(document).ready(function(){

var doc = new jsPDF();
var specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};

$('#btn').click(function () {
    doc.fromHTML($('.content').html(), 10, 8, {
        'width': 190,
            'elementHandlers': specialElementHandlers
    });
    doc.save('sample-file.pdf');
    		

});
})