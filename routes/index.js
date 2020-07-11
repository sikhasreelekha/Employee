var express = require('express');
var router = express.Router();
var multer  = require('multer')
var monk=require('monk');
var nodemailer = require('nodemailer');
var db=monk('localhost:27017/employee');
var login = db.get('login')
var qualification = db.get('qualification');
var certification=db.get('certification');
var publication=db.get('publication');
var otherachievements=db.get('otherachievements');
var workshop=db.get('workshop');
var done=db.get('done');
var guided=db.get('guided');
var personal=db.get('personal');
var notifications=db.get('notifications');
var notify=db.get('notify');
//image upload function
var storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});
//logout
router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});
router.get('/profile', function(req, res, next) {
  res.render('profile');
});
// Get register page

router.get('/home', function(req,res){
	if(req.session && req.session.user){
      res.locals.user = req.session.user;
      if(req.session.user.role=="Faculty"){
	      qualification.find({"User":req.session.user.id}, function(err,docs){
	      certification.find({"user":req.session.user.id}, function(err,docs1){
	      publication.find({"user":req.session.user.id},function(err,docs2){
	      workshop.find({"user":req.session.user.id},function(err,docs3){
	      done.find({"user":req.session.user.id},function(err,docs4){
	      guided.find({"user":req.session.user.id},function(err,docs5){
	      personal.find({"Userid":req.session.user.id},function(err,docs6){
          otherachievements.find({"user":req.session.user.id},function(err,docs7){
          notifications.find({"College":req.session.user.college,"Department":req.session.user.department},function(err,docs10){
	      login.find({"id":req.session.user.id},function(err,docs11){
	      res.locals.quali = docs;
	      res.locals.certi = docs1;
	      res.locals.publi=docs2;
          res.locals.wor=docs3;
	      res.locals.done=docs4;
	      res.locals.guided=docs5;
	      res.locals.personal=docs6;
          //console.log(docs6);
          res.locals.otherachievements=docs7;
          res.locals.notify=docs10;
          res.locals.notlength=docs10.length;
          res.locals.data=docs11;
	      res.render('index');
	      })
	      })
	      })
	      })
	      })
	      })
	      })
	      })
          })
	      })
	    }
	    else if(req.session.user.role=="HOD"){
	    	qualification.find({"department":req.session.user.department}, function(err,docs){
	    	certification.find({"department":req.session.user.department}, function(err,docs1){
				publication.find({"department":req.session.user.department}, function(err,docs2){
				done.find({"department":req.session.user.department}, function(err,docs3){
				workshop.find({"department":req.session.user.department}, function(err,docs4){
				guided.find({"department":req.session.user.department}, function(err,docs5){
				personal.find({"userid":req.session.user.id},function(err,docs6){
				otherachievements.find({"department":req.session.user.department},function(err,docs7){
				login.find({"id":req.session.user.id},function(err,docs11){
	    	    res.locals.quali = docs;
	            res.locals.certi = docs1;
	            res.locals.publi = docs2;
				res.locals.done=docs3;
                res.locals.wor=docs4;
				res.locals.guided=docs5;
				res.locals.personal=docs6;
				//console.log(docs6);
				res.locals.otherachievements=docs7;
				res.locals.data=docs11;
                //console.log(docs11);
	            res.render('index');
	      });
	      });
	      });
		  });
	      });
	      });
	      });
	      });
	      });
	    }
	    else{
	    	console.log("error");
	    }
  }
})
// Post Login Details
router.post('/login', function(req, res) {
	//console.log(req.body.id);
	//console.log(req.body.password);
	login.findOne({"id":req.body.id,"password":req.body.password},function(err,docs){
		console.log(docs);
		if(!docs){
			console.log('invalid');
			res.render('login');
		}
		else if(docs){
			delete docs.password;
			req.session.user = docs;
			//console.log('success');
			res.redirect('/home');
		}
		else{
			res.render(err);
		}
	});
});
//post registration data
router.post('/registration', function(req,res){
  var data = {
  	id : req.body.id,
  	username : req.body.username,
	email : req.body.email,
	role : req.body.role,
	password : req.body.password_1,
	cpassword : req.body.password_2,
	mobile : req.body.mobile,
	department : req.body.department,
	college : req.body.college
  }
  login.insert(data, function(err,docs){
  	res.redirect('/');
  })
});
//post qualification details
router.post('/qualification', upload.single('image'),function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		User:req.session.user.username,
		Qualification:req.body.Qualification,
		Institution:req.body.Institution,
		Duration:req.body.Duration,
		days:req.body.days,
		DOB:req.body.DOB,
		CGPA:req.body.CGPA,
		PercentageCGPA:req.body.PercentageCGPA,
		role : req.session.user.role,
		department : req.session.user.department,
		college : req.session.user.college,
		Specialization:req.body.Specialization,
		Image:req.file.originalname
		//Status:"qualification"
	}
	qualification.insert(data,function(err,docs){
		console.log(docs);
	});
  res.redirect('/home');
}
});
router.post('/cert',upload.single('image'), function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		user:req.session.user.id,
		Name:req.body.Name,
		Type:req.body.Type,
		days:req.body.days,
		Issuedby:req.body.Issuedby,
		Duration:req.body.Duration,
		DOB:req.body.DOB,
		score:req.body.Score,
		role : req.session.user.role,
		Image:req.file.originalname,
		//role : req.body.role,
		department : req.session.user.department,
		college : req.session.user.college
		//Status:"certification"
	}
	certification.insert(data,function(err,docs){
		console.log(docs);
	});
  res.redirect('/home');
}
});
router.post('/otherachievements',upload.single('image'), function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		user:req.session.user.id,
		Achievement_Name:req.body.Achievement_Name,
		Purpose:req.body.Purpose,
		From_where:req.body.From_where,
		Dateofobtain:req.body.Dateofobtain,
		PercentageCGPA:req.body.PercentageCGPA,
		Percentage:req.body.Percentage,
		Image:req.file.originalname,
		role : req.session.user.role,
		department : req.session.user.department,
		college : req.session.user.college
}
	otherachievements.insert(data,function(err,docs){
		console.log(docs);
	});
  res.redirect('/home');
}
});
router.post('/pub', upload.single('image'),function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		user:req.session.user.id,
		Type:req.body.Type,
		Date:req.body.Date,
		Name:req.body.Name,
		Paper:req.body.Paper,
		Issuedby:req.body.Issuedby,
		Scope:req.body.Scope,
		//period:req.body.period,
		Titleofpurpose:req.body.Titleofpurpose,
		Image:req.file.originalname,
		College:req.session.user.college,
		role : req.session.user.role,
		department : req.session.user.department,
	}
	publication.insert(data,function(err,docs){
		console.log(docs);
	});
	res.redirect('/home');
}
});

router.post('/workshop',upload.single('image'), function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		user:req.session.user.id,
		Name:req.body.Name,
		Type:req.body.Type,
		Duration:req.body.Duration,
		organisedby:req.body.organisedby,
		Image:req.file.originalname,
		role : req.session.user.role,
		department : req.session.user.department,
		college : req.session.user.college,
		
		//Status:"workshop"
	}
	workshop.insert(data,function(err,docs){
		console.log(docs);
	});
  res.redirect('/home');
}
});
router.post('/done', upload.single('image'), function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		user:req.session.user.id,
		user:req.session.user.username,
		Project_Title:req.body.Project_Title,
		Description:req.body.Description,
		Grants:req.body.Grants,
		Duration:req.body.Duration,
		days:req.body.days,
		//Image:req.file.originalname,
		Status:req.body.Status,
		Technical_Domain:req.body.Technical_Domain,
		Purpose:req.body.Purpose,
		//Department:req.session.user.department,
		role : req.session.user.role,
		department : req.session.user.department,
		college : req.session.user.college,
		//Nameofthecompany:req.body.Nameofthecompany,
		Image:req.file.originalname,
	}
	done.insert(data,function(err,docs){
		console.log(docs);
	});
	res.redirect('/home');
}
});
	router.post('/guided', upload.single('image'), function(req, res) {
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
	var data={
		user:req.session.user.id,
		Project_Title:req.body.Project_Title,
		Description:req.body.Description,
		Grants:req.body.Grants,
		Duration:req.body.Duration,
		//Image:req.file.originalname,
		Status:req.body.Status,
		Technical_Domain:req.body.Technical_Domain,
		Purpose:req.body.Purpose,
		role : req.session.user.role,
		department : req.session.user.department,
		college : req.session.user.college,
		//Department:req.session.user.department,
		//Nameofthecompany:req.body.Nameofthecompany,
		Image:req.file.originalname,
		//Status:"internationalproject"
	}
	guided.insert(data,function(err,docs){
		console.log(docs);
	});
  res.redirect('/home');
}
});
	
router.post('/personal', function(req, res) {
	var data={
		First_name:req.body.First_name,
		Last_name:req.body.Last_name,
		Email_Address:req.body.Email_Address,
		userid:req.body.userid,
		//Website:req.body.Website,
		//positionyouareapplyingfor:req.body.positionyouareapplyingfor,
		Salary:req.body.Salary,
		Date_of_joining:req.body.Date_of_joining,
		Alternativephone:req.body.Alternativephone,
		
		//Reference:req.body.Reference,
		//Status:"personal"
	}
	personal.insert(data,function(err,docs){
		console.log(docs);
	});
	res.redirect('/home');
});

router.post('/mail',function(req,res){
	if(req.session && req.session.user){
    res.locals.user = req.session.user;
    var data = {
    	Email : req.body.email,
    	Subject : req.body.subject,
    	Content : req.body.content,
    	EmpId : req.session.user.id,
		College : req.session.user.college,
		Department : req.session.user.department
    }
    notifications.insert(data, function(err,docs){
       console.log(docs);
    }); 
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	     host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
	    auth: {
	        user: 'sikhasreelekha@gmail.com',
	        pass: 'sreelekha@1243'
	    }
	});           
	var mailOptions = {
	from: '', // sender address
	to: req.body.email, // list of receivers
	subject : req.body.subject,
	text : req.body.content
	}
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, response){
	if(error){
	console.log("Email could not sent due to error: "+error);
	}else{
	console.log("Email has been sent successfully");
	}
	});
	res.redirect('/home');
}
})
router.post('/multimail',function(req,res){
    if(req.session && req.session.user){
    res.locals.user = req.session.user;
    login.find({"college":req.session.user.college,"department":req.session.user.department}, function(err,docs8){
    for(i=0;i<docs8.length;i++){
	var emails = docs8[i].email+',';
	//console.log(docs8[i].email+',')
    var data = {
    	Email : emails,
    	Subject : req.body.subject,
    	Content : req.body.content,
    	EmpId : req.session.user.id,
		College : req.session.user.college,
		Department : req.session.user.department
    }
    notifications.insert(data, function(err,docs){
       //console.log(docs);
    }); 
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	     host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
	    auth: {
	        user: 'sikhasreelekha@gmail.com',
	        pass: 'sreelekha@1243'
	    }
	});           
	var mailOptions = {
	from: '', // sender address
	to: emails, // list of receivers
	subject: req.body.subject,
	text: req.body.content
	}
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, response){
	if(error){
	console.log("Email could not sent due to error: "+error);
	}else{
	console.log("Email has been sent successfully");
	}
	});
}
	res.redirect('/home');
})
}
})
router.post('/remove', function(req, res) {
	notifications.remove({'EmpId':req.body.id}, function(err,docs){
		res.send(docs);
	})
});
module.exports = router;