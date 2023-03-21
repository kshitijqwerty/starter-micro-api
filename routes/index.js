var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Course = require("../models/course");
var Attendence = require("../models/attendence");

// const mkcert = require('mkcert');

// // create a certificate authority
// const ca =  mkcert.createCA({
//   organization: 'Hello CA',
//   countryCode: 'NP',
//   state: 'Bagmati',
//   locality: 'Kathmandu',
//   validityDays: 365
// });

// // then create a tls certificate
// const cert =  mkcert.createCert({
//   domains: ['127.0.0.1', 'localhost'],
//   validityDays: 365,
//   caKey: ca.key,
//   caCert: ca.cert
// });

router.get("/", function (req, res, next) {
  return res.render("index.ejs");
});

router.post("/", function (req, res, next) {
  console.log(req.body);
  var personInfo = req.body;

  if (
    !personInfo.email ||
    !personInfo.roll ||
    !personInfo.password ||
    !personInfo.passwordConf ||
    !personInfo.course
  ) {
    res.send();
  } else {
    if (personInfo.password == personInfo.passwordConf) {
      User.findOne({ email: personInfo.email }, function (err, data) {
        if (!data) {
          var c;
          User.findOne({}, function (err, data) {
            if (data) {
              console.log("if");
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            var newPerson = new User({
              unique_id: c,
              email: personInfo.email,
              roll: personInfo.roll,
              password: personInfo.password,
              passwordConf: personInfo.passwordConf,
              course: personInfo.course.split(/\s+/),
            });

            newPerson.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
            .sort({ _id: -1 })
            .limit(1);
          res.send({ Success: "You are regestered,You can login now." });
        } else {
          res.send({ Success: "Email is already used." });
        }
      });
    } else {
      res.send({ Success: "password is not matched" });
    }
  }
});

router.get("/login", function (req, res, next) {
  if (req.session) {
    if (req.session.userId) {
      res.redirect("/profile");
    }
  }
  return res.render("login.ejs");
});

router.post("/login", function (req, res, next) {
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    if (data) {
      if (data.password == req.body.password) {
        //console.log("Done Login");
        req.session.userId = data.unique_id;
		req.session.user = data;
        //console.log(req.session.userId);
        res.send({ Success: "Success!" });
      } else {
        res.send({ Success: "Wrong password!" });
      }
    } else {
      res.send({ Success: "This Email Is not registered!" });
    }
  });
});

router.get("/profile", function (req, res, next) {
  console.log("profile");
  User.findOne({ unique_id: req.session.userId }, function (err, data) {
    console.log("data");
    console.log(data);
    if (!data) {
      res.redirect("/");
    } else {
      // Get current date as DD/MM/YY
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yy = today.getFullYear().toString().substr(-2);
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      today = dd + "/" + mm + "/" + yy;

      for (i in data.course) {
        Course.findOne(
          { class_id: data.course[i], date: today },
          function (err, data) {
            console.log(data);
            // if(!data){
            // 	var newCourse = new Course({
            // 		class_id:courseInfo.class_id,
            // 		date:courseInfo.date,
            // 		dname:courseInfo.dname,
            // 		uuid:courseInfo.uuid,
            // 		payload:courseInfo.payload,
            // 	});
            // 	newCourse.save(function(err, Person){
            // 		if(err)
            // 			console.log(err);
            // 		else
            // 			console.log('Success');
            // 	});
            // }
          }
        );
      }

      return res.render("data.ejs", {
        roll: data.roll,
        email: data.email,
        course: data.course,
      });
    }
  });
});

router.get("/logout", function (req, res, next) {
  console.log("logout");
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.get("/addCourse", function (req, res, next) {
  res.render("addcourse.ejs");
});

// router.post('/addCourse', function (req, res, next) {
// 	var courseInfo = req.body;
// 	console.log(courseInfo);
// 	if(!courseInfo.class_id || !courseInfo.date || !courseInfo.payload || !courseInfo.uuid){
// 		Course.findOne({class_id:rourseInfo.class_id, date:courseInfo.date },function(err,data){
// 			console.log("data");
// 			console.log(data);
// 			if(!data){
// 				res.redirect('/addCourse');
// 			}else{
// 				//console.log("found");
// 				return res.render('data.ejs', {"name":data.roll,"email":data.email});
// 			}
// 		});
// 	}

router.post("/addCourse", function (req, res, next) {
  var courseInfo = req.body;
  console.log(courseInfo);
  // console.log("data");

  if (
    !courseInfo.course ||
    !courseInfo.date ||
    !courseInfo.payload ||
    !courseInfo.uuid ||
    !courseInfo.dname
  ) {
    res.send();
  } else {
    Course.findOne(
      { class_id: courseInfo.course, date: courseInfo.date },
      function (err, data) {
        if (!data) {
          var c;
          Course.findOne({}, function (err, data) {
            var newCourse = new Course({
              class_id: courseInfo.course,
              date: courseInfo.date,
              dname: courseInfo.dname,
              uuid: courseInfo.uuid,
              payload: courseInfo.payload,
            });

            newCourse.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });

            var newAttendance = new Attendence({
              course: courseInfo.course,
              date: courseInfo.date,
              attList: [],
            });

            newAttendance.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
            .sort({ _id: -1 })
            .limit(1);
          res.send({
            Success:
              "Attendance Registered for date: " +
              courseInfo.date +
              " and course: " +
              courseInfo.course,
          });
        } else {
          res.send({
            Success:
              "Attendance already registered for date: " +
              courseInfo.date +
              " and course: " +
              courseInfo.course,
          });
        }
      }
    );
  }
});

router.post("/markAttendence", function (req, res, next) {
  if (req.session) {
	console.log("_______ ATTT MARKING _________");
	console.log(req.session)
    console.log(req.session.user.roll);
    var courseInfo = req.body;
    var courseInfo = JSON.parse(Object.keys(courseInfo)[0]);
    console.log(courseInfo);
    console.log("data");

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yy = today.getFullYear().toString().substr(-2);
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = dd + "/" + mm + "/" + yy;

	Course.findOne({class_id:courseInfo.course, date:today, uuid: courseInfo.uuid, payload:courseInfo.payload },function(err,data){
		if(!data){
			res.send({
				Success:
				  "Beacon Details Wrong: " + today + " and course: " + courseInfo.course,
			});
		}else{
			var c = req.session.user.roll.toString();
    		console.log("3");
			Attendence.findOne(
				{ course: courseInfo.course, date: today },
				function (err, data) {
				  if (!data) {
					res.send({
					  Success:
						"Attendance not registered for date: " +
						today +
						" and course: " +
						courseInfo.course,
					});
				  } else {
					var attList = data.attList;
					attList.push(c);
					data.attList = attList;
					data.save(function (err, Person) {
					  if (err) console.log(err);
					  else console.log("Success");
					});
					res.send({
					  Success:
						"Attendance marked for date: " +
						today +
						" and course: " +
						courseInfo.course,
					});
				}
			}
		);
    
    
        }
      }
    );
  }
});

router.get("/forgetpass", function (req, res, next) {
  res.render("forget.ejs");
});

router.post("/forgetpass", function (req, res, next) {
  //console.log('req.body');
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    console.log(data);
    if (!data) {
      res.send({ Success: "This Email Is not regestered!" });
    } else {
      // res.send({"Success":"Success!"});
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save(function (err, Person) {
          if (err) console.log(err);
          else console.log("Success");
          res.send({ Success: "Password changed!" });
        });
      } else {
        res.send({
          Success: "Password does not matched! Both Password should be same.",
        });
      }
    }
  });
});

module.exports = router;
