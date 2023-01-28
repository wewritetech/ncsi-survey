const Question = require("../models/questions.model");
const Response = require('../models/responses.model');
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const Answer = require("../models/answers.model");

// Login
const login = async (req, res) => {
  if (req.method == 'POST') {
    const {email, password} = req.body;

    const [userExists] = await User.findByEmail(email);

    if(userExists.length == 0) {
      return res.render('admin-wewrite/login', {
        layout: false,
        error: true,
        message: 'User does not exist!',
        redirectLink: 'wewrite-admin/login'
      });
    }

    if(userExists[0].role !== 'WEWRITE'){
      return res.render('admin-wewrite/login', {
        layout: false,
        error: true,
        message: 'Unauthorized',
        redirectLink: 'wewrite-admin/login'
      });
    }

    if(userExists.length > 0 && !await bcrypt.compare(password, userExists[0].password)) {
      return res.render('admin-wewrite/login', {
        layout: false,
        error: true,
        message: 'Password is incorrect!',
        redirectLink: 'wewrite-admin/login'
      });
    } else {
      req.session.user = userExists[0].email;
      return res.redirect('/wewrite-admin/dashboard');
    }

  }

  res.render('admin-wewrite/login', {
    layout: false,
    error: null,
  });
}

// Logout
const logout = (req, res) => {
  req.session.destroy();

  res.redirect('/wewrite-admin/login');
}

// Dashboard
const dashboard = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.user) {
    const [questions] = await Question.findAll();
    const [responses] = await Response.findAll();
  
    const totalQuestions = questions.length;
    const totalResponses = responses.length;

    const [recentResponses] = await Response.getDesc();


    console.log(totalQuestions)


    //GRAPH DATA FOR BAR CHART -  DATA BY MONTHS
    const [monthresponses]= await Response.getDataByMonth();
    let data = monthresponses;
    let monthArrayData = [] 
    monthArrayData.push(data[0]?data[0]['count']:0); //Jan
    monthArrayData.push(data[1]?data[1]['count']:0); //Feb
    monthArrayData.push(data[2]?data[2]['count']:0); //Mar
    monthArrayData.push(data[3]?data[3]['count']:0); //Apr
    monthArrayData.push(data[4]?data[4]['count']:0); //May
    monthArrayData.push(data[5]?data[5]['count']:0); //Jun
    monthArrayData.push(data[6]?data[6]['count']:0); //Jul
    monthArrayData.push(data[7]?data[7]['count']:0); //Aug
    monthArrayData.push(data[8]?data[8]['count']:0); //Sep
    monthArrayData.push(data[9]?data[9]['count']:0); //Oct
    monthArrayData.push(data[10]?data[10]['count']:0); //Nov
    monthArrayData.push(data[11]?data[11]['count']:0); //Dec
    console.log('monthArrayData :>> ', monthArrayData);
  
    res.render('admin-wewrite/dashboard', {
      title: 'Dashboard',
      layout:false,
      totalQuestions,
      totalResponses,
      recentResponses,
      monthArrayData
    });
  } 
    else return res.redirect('/wewrite-admin/login');
}

// Questions
const questions = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if (req.session.user) {

    const [questions] = await Question.adminFindAll();

    // console.log('questions :>> ', questions[0]);
    var financial = [];
    var tele = [];
    var insurance = [];
    var health = [];
    var transp = [];
    var power = [];
    var online = [];
    var public = [];
    var hospitality = [];
    

    questions.forEach(async (question) => {
      const answers = await Answer.getAnswerByQuestionId(question.id);
      // console.log('answers :>> ', answers[0]);
      var data = {
        ...question,
        answers: answers[0]
      }
      

      if(data.sectorId == 1){
        financial.push(data)
      }
      if(data.sectorId == 2){
        tele.push(data)
      }
      if(data.sectorId == 3){
        insurance.push(data)
      }
      if(data.sectorId == 4){
        health.push(data)
      }
      if(data.sectorId == 5){
        transp.push(data)
      }
      if(data.sectorId == 6){
        power.push(data)
      }
      if(data.sectorId == 7){
        online.push(data)
      }
      if(data.sectorId == 8){
        public.push(data)
      }
      if(data.sectorId == 9){
        hospitality.push(data)
      }
      

      if(0===--questions.length){
        res.render('admin-wewrite/questions', {
          title: 'Questions',
          layout: false,
          financial,
          tele,
          insurance,
          health,
          transp,
          power,
          online,
          public,
          hospitality

        });
      }
  })
  }
    else return res.redirect('/wewrite-admin/login');
}

// Responses
const responses = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if (req.session.user) {

    const [responses] = await Response.findAll();

    res.render('admin-wewrite/all_response', {
      title: 'Responses',
      layout: false,
      responses,
    });
  }
    else return res.redirect('/wewrite-admin/login');
}

const resetPassword = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if(req.session.user) {
    
    if (req.method === 'POST') {
      const {password, cpassword} = req.body;

      if(password !== cpassword){
        return res.render('wewrite-admin/password_reset', {
          layout: false,
          error: true,
          message: 'Passwords do not match',
          redirectLink: 'wewrite-admin/password_reset'
        });
      } else {
        const user = await User.update(req.session.user, await bcrypt.hash(password, 12));
        req.session.destroy();
        return res.redirect('/wewrite-admin/login');
      }
    }

    res.render('admin-wewrite/password_reset', {
      title: 'Password Reset',
      layout: false,
      error: null
    });
  }
    else return res.redirect('/wewrite-admin/login');
}

const analytics = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if (req.session.user) {

    const [financial] = await Response.getTotalBySector(1);
    const [tele] = await Response.getTotalBySector(2);
    const [insurance] = await Response.getTotalBySector(3);
    const [health] = await Response.getTotalBySector(4);
    const [transportation] = await Response.getTotalBySector(5);
    const [power] = await Response.getTotalBySector(6);
    const [online] = await Response.getTotalBySector(7);
    const [public] = await Response.getTotalBySector(8);
    const [hospitality] = await Response.getTotalBySector(9);
    const [totalResponse] = await Response.getTotalResponse();
    
    var data = {
      financial: financial[0]['count'],
      tele:tele[0]['count'],
      insurance:insurance[0]['count'],
      health:health[0]['count'],
      transportation:transportation[0]['count'],
      power:power[0]['count'],
      online:online[0]['count'],
      public:public[0]['count'],
      hospitality:hospitality[0]['count'],
      totalResponse:totalResponse[0]['count']
    }
    var allInOnePieChart = Object.values(data).slice(0,-1);// data in array except the totalResponse
  
  
        res.render('admin-wewrite/analytics', {
          title: 'Dashboard',
          layout: false,
          sectors:data,
          generelPie:allInOnePieChart
        });
      }
    else return res.redirect('/wewrite-admin/login');
}

const sectorResponses = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  
  if (req.session.user) {

    const [financial] = await Response.findBySector(1);
    const [tele] = await Response.findBySector(2);
    const [insurance] = await Response.findBySector(3);
    const [health] = await Response.findBySector(4);
    const [transportation] = await Response.findBySector(5);
    const [power] = await Response.findBySector(6);
    const [online] = await Response.findBySector(7);
    const [public] = await Response.findBySector(8);
    const [hospitality] = await Response.findBySector(9);

    res.render('admin-wewrite/section_response', {
      title: 'Dashboard',
      layout: false,
      financial,
      tele,
      insurance,
      health,
      transportation,
      power,
      online,
      public,
      hospitality
    });
  }
  
    else return res.redirect('/wewrite-admin/login');
}

const addQuestions = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if (req.session.user) {
    if(req.method == 'GET'){
      res.render('admin-wewrite/add_question', {
            layout: false,
            title: 'Add Questions'
          })
    }else{
      let body = req.body;
      let questionId = body.questionId;
      let question = body.question;
      let responseType = body.responseType;
      let required = body.required;
      let sectorId = body.sectorId;
      let subSectorId = body.subSectorId == 'null' ? null : body.subSectorId;
      try {
        let response = await Question.save(question,required,responseType,sectorId,subSectorId);
        if(response[0].affectedRows >= 1){
            res.render('admin-wewrite/message',
              {
                layout:false,
                error: false,
                message: "New Question Added",
                redirectLink: 'wewrite-admin/add-questions'
              }
          )
        }else{
          res.render('admin-wewrite/message',
          {
            layout:false,
            error: true,
            message: "Failed to add Question",
            redirectLink: 'wewrite-admin/add-questions'
          })

        }
      } catch (error) {
        console.log('error :>> ', error);
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Something went wrong ...try again",
          redirectLink: 'wewrite-admin/add-questions'
        })
      }
    }
    
  } else return res.redirect('/wewrite-admin/login');
}

const editQuestion = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if (req.session.user) {
    let question_id = req.params.id;
    console.log('question_id :>> ', question_id);
    try {
      let [response] = await Question.findOne(question_id)
      const answers = await Answer.getAnswerByQuestionId(parseInt(question_id));
      var newRes = response[0];
      var data = {
        ...newRes,
        answers: answers[0]
      }
      console.log('response :>> ', data);

      res.render('admin-wewrite/edit_question', {
        layout: false,
        title: 'Add Questions',
        response:data
      })
     
    } catch (error) {
      console.log('error :>> ', error);
      res.render('admin-wewrite/message',
      {
        layout:false,
        error: true,
        message: "Something went wrong ...try again",
        redirectLink: 'wewrite-admin/add-questions'
      })
    }
  } else return res.redirect('/wewrite-admin/login');
}

const updateQuestion = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  console.log('Update question')
  if (req.session.user) {
    console.log('Update question')
    try {
      console.log('body :>> ',);
      let body = req.body;
      let questionId = body.questionId;
      let question = body.question;
      let responseType = body.responseType;
      let required = body.required;
      let sectorId = body.sectorId;
      let subSectorId = body.subSectorId == 'null' ? null : body.subSectorId;
      let [response] = await Question.update(questionId,question,required,responseType,sectorId,subSectorId)
      console.log('body :>> ',body);

      console.log('response :>> ',questionId, question,required,responseType,sectorId,subSectorId, response);
      if(response.affectedRows >= 1){
        
        res.render('admin-wewrite/message',
          {
            layout:false,
            error: false,
            message: "New Question Added",
            redirectLink: 'wewrite-admin/questions'
          }
        )
      }else{
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Failed to add Question",
          redirectLink: 'wewrite-admin/questions'
        })

      }
    } catch (error) {
      res.render('admin-wewrite/message',
      {
        layout:false,
        error: true,
        message: "Something went wrong ...try again",
        redirectLink: 'wewrite-admin/questions'
      })
    }
  } else return res.redirect('/wewrite-admin/login');
}

const deleteQuestion = async (req, res) => {
  const {id} = req.params;
  
  console.log('delete',id)
  if (req.session.user) {
    try { 
     let [response] =  await Question.delete(Number(id));
     console.log('response :>> ', response);
      if(response.affectedRows >= 1){
          res.render('admin-wewrite/message',
            {
              layout:false,
              error: false,
              message: "Question DELETE",
              redirectLink: 'wewrite-admin/questions'
            }
        )
      }else{
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Failed to DELETE Question",
          redirectLink: 'wewrite-admin/questions'
        })

      }
    } catch (error) {
      console.log('error :>> ', error);
      res.render('admin-wewrite/message',
      {
        layout:false,
        error: true,
        message: "Something went wrong ...try again",
        redirectLink: 'wewrite-admin/questions'
      })
    } 
  
} else return res.redirect('/wewrite-admin/login');
}

const disableQuestion = async (req, res) => {
  const {id} = req.params;
  console.log('disable',id)
  if (req.session.user) { 
    try { 
     let [response] =  await Question.disable(Number(id));
     console.log('response :>> ', response);
      if(response.affectedRows >= 1){
          res.render('admin-wewrite/message',
            {
              layout:false,
              error: false,
              message: "Question DISABLED",
              redirectLink: 'wewrite-admin/questions'
            }
        )
      }else{
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Failed to DISABLED Question",
          redirectLink: 'wewrite-admin/questions'
        })

      }
    } catch (error) {
      console.log('error :>> ', error);
      res.render('admin-wewrite/message',
      {
        layout:false,
        error: true,
        message: "Something went wrong ...try again",
        redirectLink: 'wewrite-admin/questions'
      })
    } 
  
} else return res.redirect('/wewrite-admin/login');
}

const enableQuestion = async (req, res) => {
  const {id} = req.params;
  console.log('enabled',id)
  if (req.session.user) { 
    try { 
     let [response] =  await Question.enable(Number(id));
     console.log('response :>> ', response);
      if(response.affectedRows >= 1){
          res.render('admin-wewrite/message',
            {
              layout:false,
              error: false,
              message: "Question enabled",
              redirectLink: 'wewrite-admin/questions'
            }
        )
      }else{
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Failed to enabled Question",
          redirectLink: 'wewrite-admin/questions'
        })

      }
    } catch (error) {
      console.log('error :>> ', error);
      res.render('admin-wewrite/message',
      {
        layout:false,
        error: true,
        message: "Something went wrong ...try again",
        redirectLink: 'wewrite-admin/questions'
      })
    } 
  
} else return res.redirect('/wewrite-admin/login');
}



// Answers section

const addAnswer = async (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if (req.session.user) {
    if(req.method == 'GET'){
      res.render('admin-wewrite/add_question', {
            layout: false,
            title: 'Add Questions'
          })
    }else{
      let body = req.body;
      let questionId = body.questionId;
      let value = body.answer;
      let label = value.toUpperCase();
      let type = body.type == "INLINE" ? "RADIO-INLINE": body.type;
      let sectorId = body.sectorId;
      let subSectorId = body.subSectorId == 'null' || body.subSectorId == '' ? null : body.subSectorId;
      try { 
        console.log(value,label,questionId,type,sectorId,subSectorId)
        let response = await Answer.save(value,label,type,questionId,sectorId,subSectorId);
        if(response[0].affectedRows >= 1){
            res.render('admin-wewrite/message',
              {
                layout:false,
                error: false,
                message: "New Answer Added",
                redirectLink: 'wewrite-admin/questions'
              }
          )
        }else{
          res.render('admin-wewrite/message',
          {
            layout:false,
            error: true,
            message: "Failed to add Answer",
            redirectLink: 'wewrite-admin/questions'
          })

        }
      } catch (error) {
        console.log('error :>> ', error);
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Something went wrong ...try again",
          redirectLink: 'wewrite-admin/questions'
        })
      }
    }
    
  } else return res.redirect('/wewrite-admin/login');
}

const deleteAnswer = async (req, res) => {
  const {id} = req.params;
  console.log('delete answer',id)
  if (req.session.user) { 
      try { 
       let [response] =  await Answer.delete(Number(id));  
       console.log('response :>> ', response);
        if(response.affectedRows >= 1){
            res.render('admin-wewrite/message',
              {
                layout:false,
                error: false,
                message: "Answer DELETED",
                redirectLink: 'wewrite-admin/questions'
              }
          )
        }else{
          res.render('admin-wewrite/message',
          {
            layout:false,
            error: true,
            message: "Failed to DELETED Answer",
            redirectLink: 'wewrite-admin/questions'
          })

        }
      } catch (error) {
        console.log('error :>> ', error);
        res.render('admin-wewrite/message',
        {
          layout:false,
          error: true,
          message: "Something went wrong ...try again",
          redirectLink: 'wewrite-admin/questions'
        })
      } 
    
  } else return res.redirect('/wewrite-admin/login');
}


module.exports = {
  login,
  logout,
  dashboard,
  questions,
  addQuestions,
  addAnswer,
  editQuestion,
  updateQuestion,
  deleteQuestion,
  deleteAnswer,
  disableQuestion,
  enableQuestion,
  responses,
  resetPassword,
  analytics,
  sectorResponses,
}