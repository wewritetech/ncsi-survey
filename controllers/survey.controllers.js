const {getQuestionsWithAnswers} = require('../controllers/questions.controller');
const Answer = require('../models/answers.model');
const Question = require('../models/questions.model');
const Response = require('../models/responses.model');


// Welcome page
const Welcome = async (req, res) => {
  res.render('survey/welcome', {
    layout: false,
  });

}


// Page 1 (Sector)
const page1 = async (req, res) => {
  
    const questions = await getQuestionsWithAnswers();

    const first = questions[0];
    // console.log(first)
    console.log('page1')

  res.render('survey/index', {
    layout: false,
    first,
  });

}

// Page 2 (Sub Sector)
const page2 = async (req, res) => {

  console.log('page2')
  var sectorID = req.body.radio;
  console.log('sectorID', sectorID);

  // req.session.q1 = sectorID;

  if(sectorID == 6 || sectorID == 7 || sectorID == 8){
    console.log('going to page 3 alt  :>> ');
    res.redirect('/survey/page3Alt/'+sectorID);
  }

  const questions = await getQuestionsWithAnswers();


  const second = questions[1];
  // console.log(second)
  var QuestionPart = {
                        id: second.id,
                        question: second.question,
                        required: second.required,
                        responseType: second.responseType,
                        subSectorId: second.subSectorId,
                        sectorId: second.sectorId,
                      }

  var AnswersPart = second.answers.filter((value)=> value.sectorId==sectorID);

  var fullResponse = {...QuestionPart, answers: AnswersPart}

  // console.log('fullResponse :>> ', fullResponse);
  res.render('survey/page2', {
    layout: false,
    second: fullResponse,
    sector: sectorID,
  })
}


// Page 3 (Company)
const page3 = async (req, res) => {
  console.log('hello3')
  const questions = await getQuestionsWithAnswers();
  var data = req.body;

  console.log(data)
  const third = questions[2];
  // console.log(third)

  var QuestionPart = {
    id: third.id,
  question: third.question,
  required: third.required,
  responseType: third.responseType,
  subSectorId: third.subSectorId,
  sectorId: third.sectorId,
  }

  // const skipped = await Question.getQuestionBySector(data.sectorId);

var AnswersPart = third.answers.filter((value)=> value.sectorId==data.sectorId && value.subSectorId==data.radio);

var fullResponse = {...QuestionPart, answers: AnswersPart}

// console.log('fullResponse :>> ', fullResponse);

  res.render('survey/page3', {
    layout: false,
    third: fullResponse,
    sectorId:data.sectorId,
    subSectorId:data.radio
  })
}

const page3Alt = async (req, res) => {
  console.log('hello3 alt')
  const questions = await getQuestionsWithAnswers();
  var sectorID = req.params.sectorID;

  console.log('params '+sectorID)
  const third = questions[2];
  // console.log(third)

  var QuestionPart = {
    id: third.id,
    question: third.question,
    required: third.required,
    responseType: third.responseType,
    subSectorId: third.subSectorId || null,
    sectorId: third.sectorId,
  }

  // const skipped = await Question.getQuestionBySector(data.sectorId);

  var AnswersPart = third.answers.filter((value)=> value.sectorId==sectorID);

  var fullResponse = {...QuestionPart, answers: AnswersPart}

  // console.log('third.answers :>> ', third.answers);
  console.log('fullResponse :>> ', fullResponse);

    res.render('survey/page3', {
      layout: false,
      third: fullResponse,
      sectorId:sectorID,
      subSectorId: null
    })
 

}

// Page 4 (Main Questions)
const page4 = async (req, res) => {
  console.log('hello4 four')
  var resData = req.body;

  var allQuestions = [];
  const [questions] = await Question.getQuestionsByIds(resData.sectorId, resData.subSectorId);
  console.log(resData, 'resData.subSectorId ', resData.subSectorId );
  console.log(questions);

  if(resData.subSectorId == ''){
        
        var allQuestions = [];
        const [questions] = await Question.getQuestionBySector(resData.sectorId);
        // console.log(resData);
        // console.log(questions);

        questions.forEach(async (question,index) => {
          var answers = await Answer.getAnswerByQuestionId(question.id);
        

            //Replace all BANK or COMPANY NAME with selected company
            var newQuestion = question.question.replace('COMPANY', resData.radio)
            

            var updatedQuestion = {
              id:question.id,
              question:newQuestion,
              required:  question.required,
              subSectorId: question.subSectorId,
              sectorId: question.sectorId,
              responseType: question.responseType,
              status: question.status
            }


          var newAnswer = answers[0]
          var data = {
            ...updatedQuestion,
            answers:newAnswer
          }
          console.log('question :>> ', question);

          allQuestions.push(data);

          if(0===--questions.length){
            // console.log('all quelstions',allQuestions);
            res.render('survey/page4', {
              layout: false,
              questions:allQuestions,
              q1:resData.sectorId,
              q2:resData.subSectorId || null,
              q3:resData.radio,
            })
          }
        })
  }else{
    questions.forEach(async (question,index) => {
    var answers = await Answer.getAnswerByQuestionId(question.id);
   
    var newAnswer = answers[0]
    

      //Replace all BANK or COMPANY NAME with selected company
    var newQuestion = question.question.replace('COMPANY', resData.radio)
    

    var updatedQuestion = {
      id:question.id,
      question:newQuestion,
      required:  question.required,
      subSectorId: question.subSectorId,
      sectorId: question.sectorId,
      responseType: question.responseType,
      status: question.status
    }

    var data = {
      ...updatedQuestion,
      answers:newAnswer
    }

    allQuestions.push(data);

    if(0===--questions.length){
      // console.log('all quelstions',allQuestions);
      res.render('survey/page4', {
        layout: false,
        questions:allQuestions,
        q1:resData.sectorId,
        q2:resData.subSectorId,
        q3:resData.radio,

      })
    }
  })
  }
  
  
}




const submit = async (req, res) => {
  let data = req.body;
  console.log('data :>> ', data);
  let newData = Object.values(data);
  var resMessage = await Response.save(newData[0],newData[1]==''?'N/A':newData[1],newData[2],newData[3],newData[4],newData[5],newData[6],newData[7],newData[8],newData[9],newData[10],newData[11]);
  // console.log(first)
  console.log('submit')

  console.log('resMessage :>> ', resMessage);
  res.render('survey/success',{
    layout: false,
  });

}



module.exports = {
  Welcome,
    page1,
    page2,
    page3,
    page4,
    page3Alt,
    submit,
}
